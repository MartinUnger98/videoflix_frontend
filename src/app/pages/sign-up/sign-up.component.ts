import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { passwordMatchValidator } from './password-validator';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RegisterResponse } from '../../services/auth.utils';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  primeicons = PrimeIcons;

  showPassword = false;
  showConfirmPassword = false;

  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);


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
    this.authService.register(registerData)
      .then((response: RegisterResponse) => {
        this.router.navigate(['/login'], { queryParams: { email: response.email } });
        console.log('Registration successful', response);
      })
      .catch((error) => {
        console.error('Registration failed', error);
      });

  }
}
