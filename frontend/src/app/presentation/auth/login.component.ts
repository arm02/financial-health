import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUseCase } from '../../core/usecase/auth.usecase';
import { AuthDTO } from '../../core/domain/dto/auth.dto';
import { LoginResponse, RegisterResponse } from '../../core/domain/entities/auth.collection';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterUseCase } from '../../core/usecase/register.usecase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authUseCase = inject(AuthUseCase);
  private registerUseCase = inject(RegisterUseCase);
  private router = inject(Router);

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

    if (this.action === 'register') {
      this.registerUseCase.execute(this.authModel).subscribe({
        next: (res: RegisterResponse) => {
          this.successMessage = 'Berhasil daftar akun! Silahkan login untuk masuk ke financial health!';
          this.action = 'login';
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.errorMessage = err?.error?.message || 'Login failed';
        },
      });
      return;
    }

    this.authUseCase.execute(this.authModel).subscribe({
      next: (res: LoginResponse) => {
        if (res.data.token) {
          localStorage.setItem('auth_token', res.data.token);
          this.router.navigateByUrl('/');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.errorMessage = err?.error?.message || 'Login failed';
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
