import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUseCase } from '../../core/usecase/auth.usecase';
import { AuthDTO } from '../../core/domain/dto/auth.dto';
import { LoginResponse, RegisterResponse } from '../../core/domain/entities/auth.entities';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterUseCase } from '../../core/usecase/register.usecase';
import { environment } from '../../../environments/environment';
import { LoaderBarLocal } from '../../core/helpers/components/loader';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderBarLocal],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private authUseCase = inject(AuthUseCase);
  private registerUseCase = inject(RegisterUseCase);
  private router = inject(Router);
  protected loader = signal(false);

  action: 'login' | 'register' = 'login';

  authModel: AuthDTO = {
    email: '',
    password: '',
  };
  successMessage = '';
  errorMessage = '';

  showPassword = false;

  onSubmit() {
    this.errorMessage = '';
    this.loader.set(true);
    if (this.action === 'register') {
      this.register();
      return;
    }
    this.login();
  }

  login() {
    this.authUseCase.execute(this.authModel).subscribe({
      next: (res: LoginResponse) => {
        if (res.data) {
          localStorage.setItem(
            environment.storage.authData || 'auth_data',
            JSON.stringify(res.data)
          );
          this.router.navigateByUrl('/');
          this.loader.set(false);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err?.error?.message || 'Login failed';
        this.loader.set(false);
      },
    });
  }

  register() {
    this.registerUseCase.execute(this.authModel).subscribe({
      next: () => {
        this.successMessage =
          'Berhasil daftar akun! Silahkan login untuk masuk ke financial health!';
        this.authModel = {
          email: '',
          password: '',
        };
        this.action = 'login';
        this.loader.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err?.error?.message || 'Login failed';
        this.loader.set(false);
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  switchAction(action: 'login' | 'register') {
    this.action = action;
  }
}
