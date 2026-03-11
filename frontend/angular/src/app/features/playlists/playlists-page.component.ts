import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PlaylistService } from '../../core/services/playlist.service';
import { AuthService } from '../../core/services/auth.service';
import { PlayerService } from '../../core/services/player.service';
import { NotificationService } from '../../core/services/notification.service';
import { Playlist, getPlaylistCoverUrl } from '../../core/models/playlist.model';
import { Track } from '../../core/models/track.model';
import { TrackPositionModalComponent } from './components/track-position-modal/track-position-modal.component';

@Component({
  selector: 'app-playlists-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TrackPositionModalComponent
  ],
  templateUrl: './playlists-page.component.html'
})
export class PlaylistsPageComponent implements OnInit, OnDestroy {
  playlists = signal<Playlist[]>([]);
  selectedPlaylist = signal<Playlist | null>(null);
  showDeleteConfirm = signal<number | null>(null);
  showPositionModal = signal<boolean>(false);
  selectedTrackForPosition = signal<Track | null>(null);
  
  private readonly destroy$ = new Subject<void>();

  protected readonly getPlaylistCoverUrl = getPlaylistCoverUrl;

  constructor(
    private readonly playlistService: PlaylistService,
    private readonly authService: AuthService,
    private readonly playerService: PlayerService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPlaylists(): void {
    const user = this.authService.user();
    if (!user) return;

    this.playlistService.getUserPlaylists(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (playlists) => {
          this.playlists.set(playlists);
          if (playlists.length > 0) {
            this.selectedPlaylist.set(playlists[0]);
          }
        }
      });
  }

  selectPlaylist(playlist: Playlist): void {
    this.selectedPlaylist.set(playlist);
  }

  playTrack(track: Track, tracks: Track[]): void {
    this.playerService.playTrack(track, tracks);
  }

  removeTrack(playlistId: number, trackId: number): void {
    this.playlistService.removeTrack(playlistId, trackId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPlaylist) => {
          this.notificationService.success('Трек удален из плейлиста');
          this.updatePlaylistInLists(updatedPlaylist);
        }
      });
  }

  openPositionModal(track: Track): void {
    this.selectedTrackForPosition.set(track);
    this.showPositionModal.set(true);
  }

  onPositionChanged(newPosition: number): void {
    const currentPlaylist = this.selectedPlaylist();
    const selectedTrack = this.selectedTrackForPosition();
    
    if (!currentPlaylist || !selectedTrack) return;

    this.playlistService.updateTrackPosition(currentPlaylist.id, selectedTrack.id, newPosition)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPlaylist) => {
          this.notificationService.success('Позиция трека изменена');
          this.updatePlaylistInLists(updatedPlaylist);
          this.showPositionModal.set(false);
          this.selectedTrackForPosition.set(null);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при изменении позиции трека');
        }
      });
  }

  private updatePlaylistInLists(updatedPlaylist: Playlist): void {
    this.playlists.update(playlists =>
      playlists.map(p => p.id === updatedPlaylist.id ? updatedPlaylist : p)
    );
    if (this.selectedPlaylist()?.id === updatedPlaylist.id) {
      this.selectedPlaylist.set(updatedPlaylist);
    }
  }

  confirmDelete(playlistId: number): void {
    this.showDeleteConfirm.set(playlistId);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(null);
  }

  deletePlaylist(playlistId: number): void {
    this.playlistService.delete(playlistId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Плейлист удален');
          this.playlists.update(playlists => playlists.filter(p => p.id !== playlistId));
          if (this.selectedPlaylist()?.id === playlistId) {
            this.selectedPlaylist.set(this.playlists()[0] || null);
          }
          this.showDeleteConfirm.set(null);
        }
      });
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