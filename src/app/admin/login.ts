import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api, problem } from '../core/api';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <main class="login">
      <h1>Painel do negócio</h1>
      <p>Entre para ver a agenda do dia e atualizar os atendimentos.</p>
      <form (ngSubmit)="submit()" #form="ngForm">
        <label>E-mail <input name="email" type="email" [(ngModel)]="email" required autocomplete="username" /></label>
        <label>Senha <input name="password" type="password" [(ngModel)]="password" required autocomplete="current-password" /></label>
        @if (error(); as message) {
          <p class="error" role="alert">{{ message }}</p>
        }
        <button type="submit" class="primary" [disabled]="!form.valid || sending()">Entrar</button>
      </form>
      <p class="demo">Demonstração: dona&#64;studiobela.demo, senha demo1234</p>
    </main>
  `,
  styles: `
    .login { max-width: 24rem; margin: 0 auto; padding: 4rem 1rem; display: grid; gap: 1rem; }
    h1 { font-size: 2.2rem; }
    p { margin: 0; color: var(--ink-soft); }
    form { display: grid; gap: 1rem; margin-top: 1rem; }
    label { display: grid; gap: 0.3rem; font-weight: 700; font-size: 0.95rem; }
    input { font-weight: 400; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 0.75rem 0.9rem; }
    .error { color: var(--danger); }
    .demo { font-size: 0.85rem; margin-top: 1.5rem; }
  `,
})
export class Login {
  private readonly api = inject(Api);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected readonly sending = signal(false);
  protected readonly error = signal<string | null>(null);

  protected submit() {
    this.sending.set(true);
    this.error.set(null);
    this.api.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('/painel'),
      error: (err) => {
        this.error.set(problem(err, 'Não foi possível entrar. Tente novamente.'));
        this.sending.set(false);
      },
    });
  }
}
