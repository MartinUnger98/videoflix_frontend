import { Routes } from '@angular/router';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ActivateComponent } from './pages/activate/activate.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { AuthGuard } from './guards/auth.guard';
import { VideoDetailComponent } from './pages/video-detail/video-detail.component';
import { VideoplayerComponent } from './pages/videoplayer/videoplayer.component';
import { ImprintComponent } from './pages/imprint/imprint.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { ScrollLayoutComponent } from './layouts/scroll-layout/scroll-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', component: StartPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      {
        path: 'password-reset-confirm/:uid/:token',
        component: ResetPasswordComponent,
      },
      { path: 'activate/:uid/:token', component: ActivateComponent },
      {
        path: 'main-page',
        component: MainpageComponent,
        canActivate: [AuthGuard],
      },
      { path: 'video-detail/:id', component: VideoDetailComponent },
    ],
  },
  {
    path: 'info',
    component: ScrollLayoutComponent,
    children: [
      { path: 'imprint', component: ImprintComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
