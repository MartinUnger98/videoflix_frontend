import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  primeicons = PrimeIcons;
  showPassword = false;
  loginError = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
