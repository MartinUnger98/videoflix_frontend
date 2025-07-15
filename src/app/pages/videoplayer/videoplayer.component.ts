import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import videojs from 'video.js';
import { VideosService } from '../../services/videos.service';
import { Video } from '../../utils/videos.utils';
import { PrimeIcons } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogModule } from 'primeng/dialog';

type VideoJsPlayer = ReturnType<typeof videojs>;

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [SelectModule, CommonModule, RouterModule, DialogModule],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent implements OnInit, AfterViewInit, OnDestroy {
  data = inject(DIALOG_DATA);
  dialogRef = inject(DialogRef<VideoplayerComponent>);
  player!: VideoJsPlayer;
  video: Video | null = null;
  primeIcons = PrimeIcons;
  showOptimizingNotice = true;
  showResolutions = false;

  route = inject(ActivatedRoute);
  router = inject(Router);
  videoService = inject(VideosService);

  ngOnInit(): void {
    this.video = this.data?.video;
    setTimeout(() => (this.showOptimizingNotice = false), 3000);
  }

  ngAfterViewInit(): void {
    if (this.video) {
      this.initPlayer();
    }
  }

  initPlayer(): void {
    if (this.player) {
      this.player.dispose();
    }

    const videoElement = document.getElementById('videoElement');
    if (!videoElement) return;

    this.player = videojs(videoElement, {
      fluid: true,
      controls: true,
      autoplay: false,
      responsive: true,
      sources: [
        {
          src: `http://localhost:8000/media/${this.video!.hls_playlist}`,
          type: 'application/x-mpegURL',
        },
      ],
    });

    this.player.ready(() => {
      const controlBar = this.player.getChild('ControlBar');
      if (controlBar) {
        this.createResolutionButton(controlBar);
      }
    });
  }

  createResolutionMenuButton(): void {
    const VideoJSButton = videojs.getComponent('Button');
    const vm = this;

    class ResolutionButton extends VideoJSButton {
      constructor(player: any, options: any) {
        super(player, options);
        this.el().setAttribute('aria-label', 'Quality');
        this.addClass('vjs-resolution-button');

        this.el().innerHTML = `
        <span class="pi ${vm.primeIcons.VIDEO}"></span>
        <div class="vjs-resolution-menu vjs-hidden">
          ${['Auto', '120p', '360p', '720p', '1080p']
            .map(
              (q) =>
                `<div class="vjs-resolution-option" data-quality="${q}">${q}</div>`
            )
            .join('')}
        </div>
      `;

        this.el()
          .querySelectorAll('.vjs-resolution-option')
          .forEach((el) => {
            el.addEventListener('click', (e) => {
              const target = e.target as HTMLElement;
              const quality = target.dataset['quality']!;
              vm.changeResolutionFromLabel(quality);
              this.toggleMenu(false);
            });
          });

        this.on('click', () => {
          const menu = this.el().querySelector(
            '.vjs-resolution-menu'
          ) as HTMLElement;
          const isOpen = !menu.classList.contains('vjs-hidden');
          this.toggleMenu(!isOpen);
        });
      }

      toggleMenu(show: boolean) {
        const menu = this.el().querySelector(
          '.vjs-resolution-menu'
        ) as HTMLElement;
        menu.classList.toggle('vjs-hidden', !show);
      }
    }

    videojs.registerComponent('ResolutionMenuButton', ResolutionButton);
  }

  createResolutionButton(controlBar: any): void {
    const vm = this;

    const btn = document.createElement('button');
    btn.className = 'vjs-control vjs-button vjs-resolution-button';
    btn.innerHTML = `<span class="pi ${this.primeIcons.VIDEO}"></span>`;
    btn.onclick = () => {
      const menu = controlBar.el().querySelector('.vjs-resolution-menu')!;
      menu.classList.toggle('vjs-hidden');
    };

    const menu = document.createElement('div');
    menu.className = 'vjs-resolution-menu vjs-hidden';

    const qualities = ['hls', '120p', '360p', '720p', '1080p'];
    qualities.forEach((q) => {
      const opt = document.createElement('div');
      opt.className = 'vjs-resolution-option';
      opt.innerText = q === 'hls' ? 'Auto' : q;
      opt.dataset['quality'] = q;
      opt.onclick = () => {
        vm.selectResolution(q, menu);
      };
      menu.appendChild(opt);
    });

    controlBar.el().appendChild(btn);
    controlBar.el().appendChild(menu);
  }

  selectResolution(label: string, menu: HTMLElement): void {
    this.changeResolutionFromLabel(label);
    menu.classList.add('vjs-hidden');

    const allOptions = menu.querySelectorAll('.vjs-resolution-option');
    allOptions.forEach((opt) => opt.classList.remove('selected'));

    const selected = Array.from(allOptions).find(
      (el) => el instanceof HTMLElement && el.dataset['quality'] === label
    );
    selected?.classList.add('selected');
  }

  renderResolutionMenu(container: HTMLElement): void {
    const existing = container.querySelector('.vjs-resolution-menu');
    if (existing) {
      existing.remove();
      return;
    }

    const menu = document.createElement('div');
    menu.className = 'vjs-resolution-menu';

    const qualities = ['120p', '360p', '720p', '1080p'];

    for (const q of qualities) {
      const option = document.createElement('div');
      option.className = 'vjs-resolution-option';
      option.innerText = q;

      option.onclick = () => {
        this.changeResolutionFromLabel(q);
        menu.remove();
        this.showResolutions = false;
      };

      menu.appendChild(option);
    }

    container.appendChild(menu);
  }

  changeResolutionFromLabel(label: string): void {
    if (!this.video || !this.player) return;

    if (label === 'hls') {
      this.player.src({
        src: `http://localhost:8000/media/${this.video.hls_playlist}`,
        type: 'application/x-mpegURL',
      });
      this.player.play();
      return;
    }

    const sources: { [key: string]: string } = {
      '120p': this.video.file_120p,
      '360p': this.video.file_360p,
      '720p': this.video.file_720p,
      '1080p': this.video.file_1080p,
    };

    const src = sources[label];
    if (!src) return;

    this.player.src({ src, type: 'video/mp4' });
    this.player.play();
  }

  goBack(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.player?.dispose();
  }

  onOpenResolutionClick(): void {
    this.showResolutions = !this.showResolutions;
  }
}
