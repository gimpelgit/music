import { Component } from '@angular/core';
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
export class PlayerComponent {
  constructor(public playerService: PlayerService) {}

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

  getVolumeIcon(): string {
    const { isMuted, volume } = this.playerService;
    
    if (isMuted() || volume() === 0) {
      return 'bi-volume-mute-fill';
    }
    if (volume() > 0.5) {
      return 'bi-volume-up-fill';
    }
    return 'bi-volume-down-fill';
  }

  getVolumePercentage(): number {
    return Math.floor(this.playerService.volume() * 100);
  }
}