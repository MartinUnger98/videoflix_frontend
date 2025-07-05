import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  primeicons = PrimeIcons;

  showPassword = false;
  showConfirmPassword = false;

  readonly fb = inject(FormBuilder);

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

  togglePassword(field: 'showPassword' | 'showConfirmPassword') {
    this[field] = !this[field];
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
