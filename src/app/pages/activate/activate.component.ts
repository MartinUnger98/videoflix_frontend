import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-activate',
  imports: [CommonModule, ButtonModule],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss',
})
export class ActivateComponent{

  authService = inject(AuthService);
  messageService = inject(MessageService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  onActivateBtnClick(): void {
    const uid = this.route.snapshot.paramMap.get('uid') ?? '';
    const token = this.route.snapshot.paramMap.get('token') ?? '';

    const data = { uid, token };

    this.authService.activateAccount(data).subscribe({
      next: (res) => {
        if (res.message === 'Account already activated.') {
          this.showMessage(res.message, 'info');
        } else {
          this.router.navigate(['/login']);
          this.showMessage('Welcome to Videoflix - your account is ready!', 'success');
        }
      },
      error: (error) => {
        this.showMessage(error.error.error, 'error');
      },
    });
  }

  showMessage(message: string, type: 'success' | 'info' | 'error'): void {
    const summary = type.charAt(0).toUpperCase() + type.slice(1);

    this.messageService.add({
      severity: type,
      summary: summary,
      detail: message,
    });
  }
}
