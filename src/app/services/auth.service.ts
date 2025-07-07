import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, lastValueFrom, Observable } from 'rxjs';
import { ActivateRequest, ActivateResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RequestPasswordResetRequest, RequestPasswordResetResponse, ResetPasswordRequest, ResetPasswordResponse } from './auth.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${environment.baseUrl}/api/register/`,
      data
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.baseUrl}/api/login/`,
      data
    );
  }

  activateAccount(data: ActivateRequest): Observable<ActivateResponse> {
    const url = `${environment.baseUrl}/api/activate/${data.uid}/${data.token}/`;
    return this.http.get<ActivateResponse>(url);
  }

  requestPasswordReset(data: RequestPasswordResetRequest): Observable<RequestPasswordResetResponse> {
    return this.http.post<RequestPasswordResetResponse>(
      `${environment.baseUrl}/api/password-reset-request/`,
      data
    );
  }

  resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${environment.baseUrl}/api/password-reset-complete/`,
      data
    );
  }
}
