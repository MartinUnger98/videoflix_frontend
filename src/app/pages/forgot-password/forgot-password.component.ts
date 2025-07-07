import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  primeicons = PrimeIcons;

  email: string = '';

  authService = inject(AuthService);
  messageService = inject(MessageService);
  router = inject(Router);

  onForgotPasswordBtnClick(): void {
    const data = { email: this.email };

    this.authService.requestPasswordReset(data).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.detail,
        });
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
}
