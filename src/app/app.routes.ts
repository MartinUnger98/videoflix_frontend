import { Routes } from '@angular/router';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { LoginComponent } from './pages/login/login.component';


export const routes: Routes = [
  {path: '', component: StartPageComponent},
  {path: 'login', component: LoginComponent}
];
