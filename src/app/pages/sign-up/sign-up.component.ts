import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { passwordMatchValidator } from './password-validator';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterResponse } from '../../services/auth.utils';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  primeicons = PrimeIcons;

  showPassword = false;
  showConfirmPassword = false;
  showSpinner = false;

  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  messageService = inject(MessageService);

  form: FormGroup = this.fb.group(
    {
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: passwordMatchValidator(),
    }
  );

  ngOnInit() {
    const emailFromUrl = this.route.snapshot.queryParamMap.get('email');
    if (emailFromUrl) {
      this.form.patchValue({ email: emailFromUrl });
    }
  }

  togglePassword(field: 'showPassword' | 'showConfirmPassword') {
    this[field] = !this[field];
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    const registerData = { email, password };
    this.showSpinner = true;
    this.authService.register(registerData).subscribe({
      next: (response: RegisterResponse) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login'], {
          queryParams: { email: response.email },
        });
        this.showSuccess();
        this.showSpinner = false;
      },
      error: (error) => {
        this.showError(error.error.email[0]);
        this.showSpinner = false;
      }
    });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account created! Please check your email to activate your account.' });
  }
  showError(errorMessage: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
  }
}
