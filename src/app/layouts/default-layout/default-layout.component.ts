import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ToastModule } from 'primeng/toast';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-default-layout',
  imports: [
    FooterComponent,
    HeaderComponent,
    ToastModule,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
})
export class DefaultLayoutComponent implements OnInit {
  currentRoute = '';
  outletSizeClass = '';
  footerSize = '';
  headerSize = '';
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.updateCurrentRoute();
    this.updateOutletSizeClass();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.updateCurrentRoute();
        this.updateOutletSizeClass();
      });
  }

  private updateCurrentRoute(): void {
    const deepestRoute = this.getDeepestChild(this.route);
    const path = deepestRoute?.snapshot.routeConfig?.path ?? '';

    switch (true) {
      case path.includes('activate'):
      case path === 'login':
      case path === 'forgot-password':
      case path === 'password-reset-confirm/:uid/:token':
        this.currentRoute = 'login';
        break;

      case path === 'sign-up':
        this.currentRoute = 'sign_up';
        break;

      case path === '':
        this.currentRoute = 'start_page';
        break;

      default:
        this.currentRoute = 'default';
        break;
    }
  }

  private updateOutletSizeClass(): void {
    const deepestRoute = this.getDeepestChild(this.route);
    const urlSegments = deepestRoute?.snapshot.url
      .map((segment) => segment.path)
      .join('/');

    switch (true) {
      case urlSegments?.includes('activate'):
      case urlSegments === '':
        this.outletSizeClass = '-small';
        this.headerSize = '-small';
        this.footerSize = '-small';
        break;

      case urlSegments?.includes('video-detail'):
      case urlSegments === 'main-page':
        break;

      default:
        this.outletSizeClass = '-default';
        this.headerSize = '-default';
        this.footerSize = '-default';
        break;
    }
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
