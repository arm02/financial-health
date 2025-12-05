import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private route = inject(Router);

    logout() {
        localStorage.removeItem('auth_token');
        this.route.navigate(['/auth/login']);
    }
}