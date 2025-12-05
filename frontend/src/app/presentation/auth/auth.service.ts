import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../../core/domain/entities/auth.entities';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private route = inject(Router);

  getUserData(): LoginData {
    return JSON.parse(localStorage.getItem('auth_data') || '') || null;
  }

  logout() {
    localStorage.removeItem('auth_data');
    this.route.navigate(['/auth/login']);
  }
}
