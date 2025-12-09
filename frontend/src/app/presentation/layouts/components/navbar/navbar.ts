import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../auth/auth.service';
import { LoginData } from '../../../../core/domain/entities/auth.entities';
import { Language, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, TranslateModule],
  providers: [TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  dropdownOpen = false;
  dropdownTranslateOpen = false;
  user: LoginData = this.authService.getUserData();
  currentLang: Language | string = '';

  ngOnInit(): void {
    this.currentLang = (this.translate.defaultLang || this.translate.getCurrentLang()).toUpperCase();
    this.translate.onLangChange.subscribe(e => {
      this.currentLang = e.lang.toUpperCase();
    });

    console.log(this.currentLang);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleDropdownTranslate() {
    this.dropdownTranslateOpen = !this.dropdownTranslateOpen;
  }

  logout() {
    this.authService.logout();
  }

  switch(lang: string) {
    this.translate.use(lang);
    this.toggleDropdownTranslate();
  }
}
