import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  AgendaItem,
  AppointmentStatus,
  AppointmentView,
  BusinessPage,
  LoginResponse,
} from './models';

const STORAGE_KEY = 'agenda.session';

@Injectable({ providedIn: 'root' })
export class Session {
  private readonly current = signal<LoginResponse | null>(Session.restore());
  readonly user = this.current.asReadonly();
  readonly loggedIn = computed(() => {
    const s = this.current();
    return s !== null && new Date(s.expiresAt).getTime() > Date.now();
  });

  set(session: LoginResponse | null) {
    this.current.set(session);
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // armazenamento indisponível (modo privado): a sessão vale só para esta aba
    }
  }

  token(): string | null {
    return this.loggedIn() ? this.current()!.accessToken : null;
  }

  private static restore(): LoginResponse | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LoginResponse) : null;
    } catch {
      return null;
    }
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Session).token();
  return next(token && req.url.startsWith('/api/admin') ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};

export const adminGuard: CanActivateFn = () =>
  inject(Session).loggedIn() ? true : inject(Router).parseUrl('/painel/entrar');

@Injectable({ providedIn: 'root' })
export class Api {
  private readonly http = inject(HttpClient);
  private readonly session = inject(Session);

  page(slug: string): Observable<BusinessPage> {
    return this.http.get<BusinessPage>(`/api/public/${slug}`);
  }

  availability(slug: string, serviceId: string, professionalId: string, date: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/public/${slug}/availability`, {
      params: { serviceId, professionalId, date },
    });
  }

  book(slug: string, body: {
    serviceId: string;
    professionalId: string;
    startAt: string;
    customerName: string;
    customerPhone: string;
  }): Observable<AppointmentView> {
    return this.http.post<AppointmentView>(`/api/public/${slug}/appointments`, body);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(tap((s) => this.session.set(s)));
  }

  agenda(date: string): Observable<AgendaItem[]> {
    return this.http.get<AgendaItem[]>('/api/admin/appointments', { params: { date } });
  }

  changeStatus(id: string, status: AppointmentStatus): Observable<AgendaItem> {
    return this.http.patch<AgendaItem>(`/api/admin/appointments/${id}`, { status });
  }
}

/** Extrai a mensagem do ProblemDetail do backend. */
export function problem(error: unknown, fallback: string): string {
  const detail = (error as { error?: { detail?: string } })?.error?.detail;
  return detail ?? fallback;
}
