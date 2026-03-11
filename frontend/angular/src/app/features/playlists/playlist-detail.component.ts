import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { PlaylistService } from '../../core/services/playlist.service';
import { PlayerService } from '../../core/services/player.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Playlist, getPlaylistCoverUrl } from '../../core/models/playlist.model';
import { Track } from '../../core/models/track.model';
import { TrackPositionModalComponent } from './components/track-position-modal/track-position-modal.component';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TrackPositionModalComponent
  ],
  templateUrl: './playlist-detail.component.html'
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {
  playlist = signal<Playlist | null>(null);
  loading = signal(true);
  showDeleteConfirm = signal<number | null>(null);
  showPositionModal = signal<boolean>(false);
  selectedTrackForPosition = signal<Track | null>(null);
  
  private readonly destroy$ = new Subject<void>();

  protected readonly getPlaylistCoverUrl = getPlaylistCoverUrl;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly playlistService: PlaylistService,
    private readonly playerService: PlayerService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const id = Number(params['id']);
        return this.playlistService.getById(id);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (playlist) => {
        this.playlist.set(playlist);
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Плейлист не найден');
        this.router.navigate(['/playlists']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isOwner(): boolean {
    const user = this.authService.user();
    const currentPlaylist = this.playlist();
    return !!user && !!currentPlaylist && user.id === currentPlaylist.userId;
  }

  playTrack(track: Track, tracks: Track[]): void {
    this.playerService.playTrack(track, tracks);
  }

  playAll(): void {
    const tracks = this.playlist()?.tracks;
    if (tracks && tracks.length > 0) {
      this.playerService.playTrack(tracks[0], tracks);
    }
  }

  removeTrack(trackId: number): void {
    const currentPlaylist = this.playlist();
    if (!currentPlaylist) return;

    this.playlistService.removeTrack(currentPlaylist.id, trackId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPlaylist) => {
          this.notificationService.success('Трек удален из плейлиста');
          this.playlist.set(updatedPlaylist);
          this.showDeleteConfirm.set(null);
        }
      });
  }

  openPositionModal(track: Track): void {
    this.selectedTrackForPosition.set(track);
    this.showPositionModal.set(true);
  }

  onPositionChanged(newPosition: number): void {
    const currentPlaylist = this.playlist();
    const selectedTrack = this.selectedTrackForPosition();
    
    if (!currentPlaylist || !selectedTrack) return;

    this.playlistService.updateTrackPosition(currentPlaylist.id, selectedTrack.id, newPosition)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPlaylist) => {
          this.notificationService.success('Позиция трека изменена');
          this.playlist.set(updatedPlaylist);
          this.showPositionModal.set(false);
          this.selectedTrackForPosition.set(null);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при изменении позиции трека');
        }
      });
  }

  confirmDelete(trackId: number): void {
    this.showDeleteConfirm.set(trackId);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(null);
  }

  deletePlaylist(): void {
    const currentPlaylist = this.playlist();
    if (!currentPlaylist) return;

    this.playlistService.delete(currentPlaylist.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Плейлист удален');
          this.router.navigate(['/playlists']);
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