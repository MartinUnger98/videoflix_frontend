import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  router = inject(Router);

  showFooter(): boolean {
    const url = this.router.url;
    return !(url === '/main-page' || url.startsWith('/video-detail'));
  }
}
