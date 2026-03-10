import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  
  isVolumeSliderVisible = false;
  private hideVolumeTimeout: any;

  constructor(public playerService: PlayerService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.hideVolumeTimeout) {
      clearTimeout(this.hideVolumeTimeout);
    }
  }

  togglePlay(): void {
    this.playerService.togglePlay();
  }

  playNext(): void {
    this.playerService.playNext();
  }

  playPrevious(): void {
    this.playerService.playPrevious();
  }

  onProgressClick(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    this.playerService.seekByPercentage(percentage);
  }

  formatTime(seconds: number): string {
    return this.playerService.formatTime(seconds);
  }

  showVolumeSlider(): void {
    if (this.hideVolumeTimeout) {
      clearTimeout(this.hideVolumeTimeout);
    }
    this.isVolumeSliderVisible = true;
  }

  hideVolumeSlider(): void {
    this.hideVolumeTimeout = setTimeout(() => {
      this.isVolumeSliderVisible = false;
    }, 1000);
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.playerService.setVolume(Number.parseFloat(input.value));
  }

  toggleMute(): void {
    this.playerService.toggleMute();
  }

  formatArtists(artists: { name: string }[]): string {
    return artists.map(a => a.name).join(', ');
  }
}