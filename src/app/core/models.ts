export interface ServiceView {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  prepaid: boolean;
}

export interface ProfessionalSummary {
  id: string;
  name: string;
}

export interface BusinessPage {
  slug: string;
  name: string;
  timezone: string;
  services: ServiceView[];
  professionals: ProfessionalSummary[];
}

export type AppointmentStatus =
  | 'AWAITING_PAYMENT'
  | 'BOOKED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface AppointmentView {
  id: string;
  startAt: string;
  endAt: string;
  status: AppointmentStatus;
  price: number;
  pixCopiaECola: string | null;
}

export interface AgendaItem {
  id: string;
  startAt: string;
  endAt: string;
  customerName: string;
  customerPhone: string;
  service: string;
  professional: string;
  status: AppointmentStatus;
  price: number;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  name: string;
  businessName: string;
  businessSlug: string;
}
