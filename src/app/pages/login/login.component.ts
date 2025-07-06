import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  primeicons = PrimeIcons;
  showPassword = false;
  loginError = false;
  email = '';
  route = inject(ActivatedRoute);

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    const emailFromUrl = this.route.snapshot.queryParamMap.get('email');
    if (emailFromUrl) {
      this.email = emailFromUrl;
    }
  }
}
