import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaylistService } from '../../../core/services/playlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Track } from '../../../core/models/track.model';
import { Playlist } from '../../../core/models/playlist.model';

@Component({
  selector: 'app-add-to-playlist-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-to-playlist-modal.component.html'
})
export class AddToPlaylistModalComponent implements OnInit {
  @Input({ required: true }) track!: Track;
  @Output() closeModal = new EventEmitter<void>();
  @Output() addToPlaylist = new EventEmitter<number>();

  newPlaylistName = '';
  showNewPlaylistForm = false;

  constructor(
    public readonly playlistService: PlaylistService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.playlistService.loadUserPlaylists(user.id);
    }
  }

  onAddToPlaylist(playlistId: number): void {
    this.addToPlaylist.emit(playlistId);
  }

  onCreatePlaylist(): void {
    if (!this.newPlaylistName.trim()) {
      this.notificationService.warning('Введите название плейлиста');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newPlaylistName.trim());
    formData.append('isPublic', 'true');
    formData.append('trackIds', this.track.id.toString());

    this.playlistService.create(formData).subscribe({
      next: (playlist) => {
        this.notificationService.success('Плейлист создан');
        this.addToPlaylist.emit(playlist.id);
      }
    });
  }

  trackInPlaylist(playlist: Playlist): boolean {
    return playlist.tracks.some(t => t.id === this.track.id);
  }
}