import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  router = inject(Router);
  hiddenButtonRoutes = ['/login'];
  primeIcons = PrimeIcons;

  showLoginButton(): boolean {
    const url = this.router.url;
    return !['/login', '/main-page'].includes(url);
  }

  showLogoutButton(): boolean {
    return this.router.url === '/main-page';
  }
}
