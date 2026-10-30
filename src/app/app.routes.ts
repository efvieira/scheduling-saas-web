import { Routes } from '@angular/router';
import { adminGuard } from './core/api';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'b/studio-bela' },
  { path: 'b/:slug', loadComponent: () => import('./booking/booking').then((m) => m.Booking) },
  { path: 'painel/entrar', loadComponent: () => import('./admin/login').then((m) => m.Login) },
  { path: 'painel', canActivate: [adminGuard], loadComponent: () => import('./admin/agenda').then((m) => m.Agenda) },
  { path: '**', redirectTo: '' },
];
