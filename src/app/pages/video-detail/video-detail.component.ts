import { Component, inject, OnInit } from '@angular/core';
import { VideosService } from '../../services/videos.service';
import { Video } from '../../utils/videos.utils';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { VideoplayerComponent } from '../videoplayer/videoplayer.component';

@Component({
  selector: 'app-video-detail',
  imports: [ButtonModule, CommonModule, DialogModule],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss',
})
export class VideoDetailComponent implements OnInit {
  video: Video | null = null;

  videoService = inject(VideosService);
  route = inject(ActivatedRoute);
  dialogservice = inject(Dialog);
  router = inject(Router);
  primeIcons = PrimeIcons;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.videoService.getVideoById(id).subscribe({
        next: (response) => {
          this.video = response;
        },
        error: (error) => {
          console.error('Error fetching video details:', error);
        },
      });
    } else {
      console.error('No video ID provided in route');
    }
  }

  onPlayVideo(video: Video): void {
    this.dialogservice.open(VideoplayerComponent, {
      data: {
        video,
      },
    });
  }
}
