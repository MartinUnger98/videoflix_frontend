import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Video } from '../utils/videos.utils';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  http = inject(HttpClient);

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${environment.baseUrl}/api/videos/`);
  }
}
