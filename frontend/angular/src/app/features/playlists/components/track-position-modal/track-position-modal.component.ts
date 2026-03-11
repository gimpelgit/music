import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Track } from '../../../../core/models/track.model';

@Component({
  selector: 'app-track-position-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './track-position-modal.component.html'
})
export class TrackPositionModalComponent implements OnInit {
  @Input({ required: true }) track!: Track;
  @Input({ required: true }) totalTracks!: number;
  @Input({ required: true }) currentPosition!: number;
  @Output() closeModal = new EventEmitter<void>();
  @Output() savePosition = new EventEmitter<number>();

  newPosition: number = 0;

  ngOnInit(): void {
    this.newPosition = this.currentPosition + 1;
  }

  onSave(): void {
    if (this.newPosition >= 1 && this.newPosition <= this.totalTracks) {
      this.savePosition.emit(this.newPosition - 1);
    }
  }

  formatArtists(artists: { name: string }[]): string {
    return artists.map(a => a.name).join(', ');
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}