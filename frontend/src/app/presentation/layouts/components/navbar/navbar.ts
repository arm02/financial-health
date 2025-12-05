import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../../auth/login.service';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private loginService = inject(LoginService);
  dropdownOpen = false;
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.loginService.logout();
  }
}
