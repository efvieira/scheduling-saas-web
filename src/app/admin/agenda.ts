import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Api, Session, problem } from '../core/api';
import { STATUS_LABEL, brl, isoDate, longDate, time } from '../core/format';
import { AgendaItem, AppointmentStatus } from '../core/models';

interface Action {
  label: string;
  status: AppointmentStatus;
}

const ACTIONS: Partial<Record<AppointmentStatus, Action[]>> = {
  AWAITING_PAYMENT: [{ label: 'Cancelar', status: 'CANCELLED' }],
  BOOKED: [
    { label: 'Confirmar', status: 'CONFIRMED' },
    { label: 'Atendido', status: 'COMPLETED' },
    { label: 'Faltou', status: 'NO_SHOW' },
    { label: 'Cancelar', status: 'CANCELLED' },
  ],
  CONFIRMED: [
    { label: 'Atendido', status: 'COMPLETED' },
    { label: 'Faltou', status: 'NO_SHOW' },
    { label: 'Cancelar', status: 'CANCELLED' },
  ],
};

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class Agenda {
  private readonly api = inject(Api);
  private readonly router = inject(Router);
  protected readonly session = inject(Session);

  protected readonly date = signal(isoDate(new Date()));
  protected readonly items = signal<AgendaItem[] | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly revenue = computed(() =>
    (this.items() ?? []).filter((i) => i.status === 'COMPLETED').reduce((sum, i) => sum + i.price, 0),
  );
  protected readonly active = computed(
    () => (this.items() ?? []).filter((i) => !['CANCELLED', 'NO_SHOW'].includes(i.status)).length,
  );

  protected readonly time = time;
  protected readonly brl = brl;
  protected readonly longDate = longDate;
  protected readonly label = STATUS_LABEL;
  protected readonly actions = (status: AppointmentStatus) => ACTIONS[status] ?? [];

  constructor() {
    effect(() => this.load(this.date()));
  }

  protected shift(days: number) {
    const [y, m, d] = this.date().split('-').map(Number);
    this.date.set(isoDate(new Date(Date.UTC(y, m - 1, d + days, 12))));
  }

  protected change(item: AgendaItem, status: AppointmentStatus) {
    this.api.changeStatus(item.id, status).subscribe({
      next: (updated) => this.items.update((list) => list!.map((i) => (i.id === updated.id ? updated : i))),
      error: (err) => this.error.set(problem(err, 'Não foi possível atualizar o atendimento.')),
    });
  }

  protected logout() {
    this.session.set(null);
    this.router.navigateByUrl('/painel/entrar');
  }

  private load(date: string) {
    this.items.set(null);
    this.error.set(null);
    this.api.agenda(date).subscribe({
      next: (items) => this.items.set(items),
      error: (err) => {
        if (err?.status === 401) {
          this.logout();
        }
        this.error.set(problem(err, 'Não foi possível carregar a agenda.'));
      },
    });
  }
}
