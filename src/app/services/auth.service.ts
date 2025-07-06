import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, lastValueFrom, Observable } from 'rxjs';
import { LoginData, LoginResponse, RegisterData, RegisterResponse } from './auth.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  register(data: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${environment.baseUrl}/api/register/`,
      data
    );
  }

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.baseUrl}/api/login/`,
      data
    );
  }
}
