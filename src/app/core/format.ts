import { AppointmentStatus } from './models';

const TZ = 'America/Sao_Paulo';

export const brl = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const time = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });

export const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ });

/** Data local (yyyy-MM-dd) no fuso de São Paulo, independente do fuso do navegador. */
export function isoDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(date);
}

export interface DayOption {
  iso: string;
  weekday: string;
  day: number;
  month: string;
}

/** Os próximos `count` dias a partir de `from`, para a faixa de seleção de data. */
export function nextDays(from: Date, count: number): DayOption[] {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(from.getTime() + i * 86_400_000);
    return {
      iso: isoDate(date),
      weekday: date.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: TZ }).replace('.', ''),
      day: Number(new Intl.DateTimeFormat('pt-BR', { day: 'numeric', timeZone: TZ }).format(date)),
      month: date.toLocaleDateString('pt-BR', { month: 'short', timeZone: TZ }).replace('.', ''),
    };
  });
}

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  AWAITING_PAYMENT: 'Aguardando Pix',
  BOOKED: 'Agendado',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Atendido',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Faltou',
};

/** Só dígitos, com DDI 55 quando a pessoa digita apenas DDD + número. */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
}
