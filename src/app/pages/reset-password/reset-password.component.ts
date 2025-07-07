import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { passwordMatchValidator } from '../sign-up/password-validator';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ResetPasswordForm } from '../../utils/forms-types';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  primeicons = PrimeIcons;

  showPassword = false;
  showConfirmPassword = false;

  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  messageService = inject(MessageService);

  form: FormGroup<ResetPasswordForm> = this.fb.nonNullable.group(
    {
      password: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator() }
  );

  togglePassword(field: 'showPassword' | 'showConfirmPassword') {
    this[field] = !this[field];
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const new_password = this.form.getRawValue().password;
    const uidb64 = this.route.snapshot.paramMap.get('uid') ?? '';
    const token = this.route.snapshot.paramMap.get('token') ?? '';

    const data = { uidb64, token, new_password };
    this.authService.resetPassword(data).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.error,
        });
      },
    });
  }
}
