import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  dropdownOpen = false;
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    
  }
}
