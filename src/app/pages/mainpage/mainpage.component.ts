import { Component, inject, OnInit } from '@angular/core';
import { GenreService } from '../../services/genre.service';
import { Genre } from '../../utils/genre.utils';
import { Video } from '../../utils/videos.utils';
import { VideosService } from '../../services/videos.service';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { VideoplayerComponent } from '../videoplayer/videoplayer.component';

@Component({
  selector: 'app-mainpage',
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    DialogModule
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
  router = inject(Router);
  breakpointObserver = inject(BreakpointObserver);
  dialogservice = inject(Dialog)
  primeIcons = PrimeIcons;

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

  onVideoClick(video: Video): void {
    if (this.breakpointObserver.isMatched('(max-width: 767px)')) {
      this.router.navigate(['/video-detail', video.id]);
    } else {
      this.selectedVideo = video;
    }
  }

  onPlayVideo(video: Video): void {
    this.dialogservice.open(VideoplayerComponent, {
      data: {
        video
      },
    });
  }
}
