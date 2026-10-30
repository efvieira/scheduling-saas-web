import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, problem } from '../core/api';
import { brl, longDate, nextDays, normalizePhone, time } from '../core/format';
import { AppointmentView, BusinessPage } from '../core/models';

@Component({
  selector: 'app-booking',
  imports: [FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking {
  private readonly api = inject(Api);

  readonly slug = input.required<string>();

  protected readonly page = signal<BusinessPage | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly days = nextDays(new Date(), 14);

  protected readonly serviceId = signal<string | null>(null);
  protected readonly professionalId = signal<string | null>(null);
  protected readonly date = signal(this.days[0].iso);
  protected readonly slots = signal<string[] | null>(null);
  protected readonly slot = signal<string | null>(null);

  protected name = '';
  protected phone = '';
  protected readonly sending = signal(false);
  protected readonly bookError = signal<string | null>(null);
  protected readonly booked = signal<AppointmentView | null>(null);
  protected readonly copied = signal(false);

  protected readonly service = computed(() => this.page()?.services.find((s) => s.id === this.serviceId()) ?? null);
  protected readonly professional = computed(
    () => this.page()?.professionals.find((p) => p.id === this.professionalId()) ?? null,
  );

  protected readonly brl = brl;
  protected readonly time = time;
  protected readonly longDate = longDate;

  constructor() {
    effect(() => {
      this.api.page(this.slug()).subscribe({
        next: (page) => this.page.set(page),
        error: () => this.loadError.set('Não encontramos esta página de agendamento. Confira o endereço.'),
      });
    });

    effect(() => {
      const [service, professional, date] = [this.serviceId(), this.professionalId(), this.date()];
      this.slot.set(null);
      this.slots.set(null);
      if (service && professional) {
        this.api.availability(this.slug(), service, professional, date).subscribe({
          next: (slots) => this.slots.set(slots),
          error: () => this.slots.set([]),
        });
      }
    });
  }

  protected confirm() {
    const [service, professional, slot] = [this.serviceId(), this.professionalId(), this.slot()];
    if (!service || !professional || !slot) {
      return;
    }
    this.sending.set(true);
    this.bookError.set(null);
    this.api
      .book(this.slug(), {
        serviceId: service,
        professionalId: professional,
        startAt: slot,
        customerName: this.name.trim(),
        customerPhone: normalizePhone(this.phone),
      })
      .subscribe({
        next: (appointment) => {
          this.booked.set(appointment);
          this.sending.set(false);
        },
        error: (err) => {
          this.bookError.set(problem(err, 'Não foi possível agendar. Tente outro horário.'));
          this.sending.set(false);
          if (err?.status === 409) {
            // alguém reservou antes: recarrega os horários livres
            this.slot.set(null);
            this.api.availability(this.slug(), service, professional, this.date()).subscribe((s) => this.slots.set(s));
          }
        },
      });
  }

  protected async copyPix(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      this.copied.set(true);
    } catch {
      this.copied.set(false);
    }
  }

  protected startOver() {
    this.booked.set(null);
    this.slot.set(null);
    this.name = '';
    this.phone = '';
    this.serviceId.set(null);
    this.professionalId.set(null);
  }
}
