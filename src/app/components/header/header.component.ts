import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

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

  authService = inject(AuthService);
  messageService = inject(MessageService);

  showLoginButton(): boolean {
    const url = this.router.url;
    return !['/login', '/main-page'].includes(url);
  }

  showLogoutButton(): boolean {
    return this.router.url === '/main-page';
  }

  onLogoutBtnClick() {
    this.authService.logout().subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        localStorage.clear();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      },
    });
  }
}
