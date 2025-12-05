import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUseCase } from '../../core/usecase/auth.usecase';
import { LoginDTO } from '../../core/domain/dto/auth.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>

    <form (ngSubmit)="onSubmit()" class="login-form">
      <input type="email" placeholder="Email" [(ngModel)]="email" name="email" required />

      <input
        type="password"
        placeholder="Password"
        [(ngModel)]="password"
        name="password"
        required
      />

      <button type="submit">Login</button>
    </form>

    <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  private authUseCase = inject(AuthUseCase);
  private router = inject(Router);

  onSubmit() {
    this.errorMessage = '';
    const payload: LoginDTO = {
      email: this.email,
      password: this.password,
    };
    this.authUseCase.execute(payload).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Login failed';
      },
    });
  }
}
