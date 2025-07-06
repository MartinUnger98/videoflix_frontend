import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, lastValueFrom, Observable } from 'rxjs';
import { LoginData, RegisterData, RegisterResponse } from './auth.utils';

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

  public login(data: LoginData) {
    const url = `${environment.baseUrl}/api/login/`;
    return lastValueFrom(this.http.post(url, data));
  }
}
