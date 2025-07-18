import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../services/auth.service';
import { LoginForm } from '../../utils/forms-types';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  primeicons = PrimeIcons;
  showPassword = false;
  showSpinner = false;
  loginError = '';

  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  form: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: this.fb.control<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    }),
    password: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    const emailFromUrl = this.route.snapshot.queryParamMap.get('email');
    if (emailFromUrl) {
      this.form.patchValue({ email: emailFromUrl });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loginError = '';
    const { email, password } = this.form.getRawValue();
    const loginData = { email, password };
    this.showSpinner = true;
    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.showSpinner = false;
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('email', response.email);
        this.router.navigate(['/main-page']);
      },
      error: (error) => {
        this.showSpinner = false;
        this.loginError = error.error.non_field_errors[0];
        console.log('Login error:', error);
      },
    });
  }
}
