import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
} from '@angular/core';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import Player from 'video.js/dist/types/player';
import VideoJsComponent from 'video.js/dist/types/component';
import { Video } from '../../utils/videos.utils';
import { VideosService } from '../../services/videos.service';
import { PrimeIcons } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';

interface QualityLevel {
  id: string;
  height: number;
  bitrate: number;
  enabled: boolean;
}

interface PlayerWithQualityLevels extends Player {
  qualityLevels(): {
    length: number;
    [index: number]: QualityLevel;
    on(event: 'addqualitylevel', callback: () => void): void;
  };
}

interface VideoJsComponentWithControlText extends Component {
  controlText(text: string): void;
}


@Component({
  selector: 'app-videoplayer',
  imports: [CommonModule, RouterModule, DialogModule, SelectModule],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent implements OnInit, AfterViewInit, OnDestroy {
  data = inject(DIALOG_DATA);
  dialogRef = inject(DialogRef<VideoplayerComponent>);
  route = inject(ActivatedRoute);
  router = inject(Router);
  videoService = inject(VideosService);

  player!: Player;
  video: Video | null = null;
  primeIcons = PrimeIcons;
  showOptimizingNotice = true;

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
    if (this.player) this.player.dispose();

    const videoElement = document.getElementById('videoElement');
    if (!videoElement) return;

    this.player = this.createVideoJsPlayer(videoElement);
    this.player.ready(() => this.onPlayerReady());
  }

   createVideoJsPlayer(videoElement: HTMLElement): Player {
    return videojs(videoElement, {
      controls: true,
      fluid: true,
      responsive: true,
      autoplay: false,
      html5: {
        vhs: {
          withCredentials: false,
          overrideNative: true,
        },
      },
      sources: [
        {
          src: `http://localhost:8000/media/${this.video!.hls_playlist}`,
          type: 'application/x-mpegURL',
        },
      ],
    });
  }

   onPlayerReady(): void {
    const qualityLevels = (this.player as PlayerWithQualityLevels).qualityLevels();
    const buttons: HTMLElement[] = [];
    let selectedIndex = -1;

    const menu = this.createQualityMenu();
    const autoBtn = this.createAutoButton(() => {
      for (let i = 0; i < qualityLevels.length; i++) {
        qualityLevels[i].enabled = true;
      }
      selectedIndex = -1;
      this.updateSelection(buttons, autoBtn, selectedIndex);
    });
    menu.appendChild(autoBtn);

    qualityLevels.on('addqualitylevel', () => {
      this.populateQualityLevels(
        qualityLevels,
        buttons,
        menu,
        autoBtn,
        selectedIndex
      );
      this.appendMenuIfMissing(menu);
    });

    this.registerQualityToggle(menu);
  }

   createQualityMenu(): HTMLElement {
    const menu = document.createElement('div');
    menu.className = 'vjs-quality-menu';
    Object.assign(menu.style, {
      position: 'absolute',
      display: 'none',
      flexDirection: 'column-reverse',
      bottom: '40px',
      right: '10px',
      zIndex: '1000',
      background: '#1e1e1e',
      borderRadius: '8px',
      padding: '8px 0',
      minWidth: '130px',
    });
    return menu;
  }

   createAutoButton(onClick: () => void): HTMLButtonElement {
    const autoBtn = document.createElement('button');
    autoBtn.className = 'vjs-quality-button';
    autoBtn.innerHTML = `<i class="${this.primeIcons.CHECK}" style="margin-right: 6px;"></i>Automatisch`;
    this.styleMenuButton(autoBtn);
    autoBtn.onclick = onClick;
    return autoBtn;
  }

   styleMenuButton(btn: HTMLButtonElement): void {
    Object.assign(btn.style, {
      color: '#ffffff',
      background: 'transparent',
      border: 'none',
      padding: '10px 16px',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '16px',
    });

    btn.onmouseenter = () => (btn.style.backgroundColor = '#333333');
    btn.onmouseleave = () => (btn.style.backgroundColor = 'transparent');
  }

   populateQualityLevels(
    qualityLevels: ReturnType<PlayerWithQualityLevels['qualityLevels']>,
    buttons: HTMLElement[],
    menu: HTMLElement,
    autoBtn: HTMLElement,
    selectedIndex: number
  ): void {
    while (buttons.length < qualityLevels.length) {
      const i = buttons.length;
      const level = qualityLevels[i];
      const label = `${level.height}p`;

      const btn = document.createElement('button');
      btn.setAttribute('data-label', label);
      btn.innerHTML = `<span style="width: 22px; display:inline-block;"></span>${label}`;
      btn.className = 'vjs-quality-button';
      this.styleMenuButton(btn);

      btn.onclick = () => {
        for (let j = 0; j < qualityLevels.length; j++) {
          qualityLevels[j].enabled = j === i;
        }
        selectedIndex = i;
        this.updateSelection(buttons, autoBtn, selectedIndex);
      };

      buttons.push(btn);
      menu.insertBefore(btn, autoBtn);
    }
  }

   updateSelection(
    buttons: HTMLElement[],
    autoBtn: HTMLElement,
    selectedIndex: number
  ): void {
    buttons.forEach((btn, i) => {
      btn.innerHTML =
        (i === selectedIndex
          ? `<i class="${this.primeIcons.CHECK}" style="margin-right: 6px;"></i>`
          : `<span style="width: 22px; display:inline-block;"></span>`) +
        btn.getAttribute('data-label');
    });

    autoBtn.innerHTML =
      (selectedIndex === -1
        ? `<i class="${this.primeIcons.CHECK}" style="margin-right: 6px;"></i>`
        : `<span style="width: 22px; display:inline-block;"></span>`) +
      'Automatisch';
  }

   appendMenuIfMissing(menu: HTMLElement): void {
    const videoContainer = document.querySelector('.video-js');
    if (videoContainer && !videoContainer.querySelector('.vjs-quality-menu')) {
      videoContainer.appendChild(menu);
    }
  }

   registerQualityToggle(menu: HTMLElement): void {
    const Button = videojs.getComponent('Button');

    class QualityToggle extends Button {
      constructor(player: Player, options: Record<string, unknown>) {
        super(player, options);
        ((this as unknown) as VideoJsComponentWithControlText).controlText('Qualität');
        this.addClass('vjs-quality-toggle');
      }

      handleClick() {
        menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
      }
    }

    videojs.registerComponent('QualityToggle', QualityToggle);
    this.player.getChild('controlBar')?.addChild('QualityToggle', {}, 10);

    const toggleBtn = document.querySelector('.vjs-quality-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = `<i class="${this.primeIcons.VIDEO}"></i>`;
    }
  }

  goBack(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.player?.dispose();
  }
}
