import { Component, inject, OnInit } from '@angular/core';
import { GenreService } from '../../services/genre.service';
import { Genre } from '../../utils/genre.utils';
import { Video } from '../../utils/videos.utils';
import { VideosService } from '../../services/videos.service';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mainpage',
  imports: [
    CommonModule,
    CarouselModule
  ],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss',
})
export class MainpageComponent implements OnInit {
  genres: Genre[] = [];
  videos: Video[] = [];
  selectedVideo: Video | null = null;

  genreService = inject(GenreService);
  videoService = inject(VideosService);

  ngOnInit(): void {
    this.genreService.getGenres().subscribe({
      next: (response) => {
        this.genres = response;
      },
      error: (error) => {
        console.error('Error fetching genres:', error);
      },
    });
    this.videoService.getVideos().subscribe({
      next: (response) => {
        this.videos = response;
        this.selectedVideo = response[1] || null;
      },
      error: (error) => {
        console.error('Error fetching videos:', error);
      },
    });
  }

  hasVideosForGenre(genreName: string): boolean {
    return this.videos.some((video) => video.genre_name === genreName);
  }

  getVideosForGenre(genreName: string): Video[] {
    return this.videos.filter((video) => video.genre_name === genreName);
  }
}
