import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-scroll-layout',
  imports: [
    FooterComponent,
    HeaderComponent,
    ToastModule,
    RouterOutlet
  ],
  templateUrl: './scroll-layout.component.html',
  styleUrl: './scroll-layout.component.scss'
})
export class ScrollLayoutComponent {

}
