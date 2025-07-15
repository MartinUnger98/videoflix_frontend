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
    return !(url === '/main-page' || url.startsWith('/video-detail'));
  }

  showLogoutButton(): boolean {
    const url = this.router.url;
    return ['/main-page'].includes(url) || url.startsWith('/video-detail');
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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.detail,
        });
      },
    });
  }

  onIconClick() {
    const url = this.router.url;
    if (url === '/main-page' || url.startsWith('/video-detail')) {
      this.router.navigate(['/main-page']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
