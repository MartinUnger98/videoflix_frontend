import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Genre } from '../utils/genre.utils';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  http = inject(HttpClient);

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${environment.baseUrl}/api/genres/`);
  }
}
