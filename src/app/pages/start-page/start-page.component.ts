import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeIcons } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-page',
  imports: [CommonModule, ButtonModule, InputTextModule],
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StartPageComponent {
  primeicons = PrimeIcons;
  router = inject(Router);

  goToSignUp(email: string) {
    this.router.navigate(['/sign-up'], { queryParams: { email } });
  }
}
