import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUseCase } from '../../core/usecase/auth.usecase';
import { LoginDTO } from '../../core/domain/dto/auth.dto';
import { LoginResponse } from '../../core/domain/entities/auth.collection';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  // template: `
  //   <h2>Login</h2>

  //   <form (ngSubmit)="onSubmit()" class="login-form">
  //     <input
  //       type="email"
  //       placeholder="Email"
  //       [(ngModel)]="loginModel.email"
  //       name="email"
  //       required
  //     />

  //     <input
  //       type="password"
  //       placeholder="Password"
  //       [(ngModel)]="loginModel.password"
  //       name="password"
  //       required
  //     />

  //     <button type="submit">Login</button>
  //   </form>

  //   <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
  // `,
})
export class LoginComponent {
  private authUseCase = inject(AuthUseCase);
  private router = inject(Router);

  loginModel: LoginDTO = {
    email: '',
    password: '',
  };
  errorMessage = '';

  showPassword = false;
  onSubmit() {
    this.errorMessage = '';
    this.authUseCase.execute(this.loginModel).subscribe({
      next: (res: LoginResponse) => {
        this.router.navigateByUrl('/');
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
}
