import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { AlbumService } from '../../core/services/album.service';
import { TrackService } from '../../core/services/track.service';
import { PlayerService } from '../../core/services/player.service';
import { PlaylistService } from '../../core/services/playlist.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Album, getAlbumCoverUrl } from '../../core/models/album.model';
import { Track } from '../../core/models/track.model';
import { AddToPlaylistModalComponent } from '../../shared/components/add-to-playlist-modal/add-to-playlist-modal.component';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AddToPlaylistModalComponent],
  templateUrl: './album-detail.component.html'
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  album = signal<Album | null>(null);
  tracks = signal<Track[]>([]);
  showPlaylistModal = signal(false);
  selectedTrack = signal<Track | null>(null);
  
  private readonly destroy$ = new Subject<void>();

  protected readonly getAlbumCoverUrl = getAlbumCoverUrl;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly playerService: PlayerService,
    private readonly playlistService: PlaylistService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const albumId = Number(params['id']);
        return this.albumService.getById(albumId);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (album) => {
        this.album.set(album);
        this.loadTracks(album.id);
      }
    });

    if (this.authService.isAuthenticated()) {
      this.loadUserPlaylists();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTracks(albumId: number): void {
    this.trackService.getTracksByAlbum(albumId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tracks) => this.tracks.set(tracks)
      });
  }

  private loadUserPlaylists(): void {
    const user = this.authService.user();
    if (user) {
      this.playlistService.loadUserPlaylists(user.id);
    }
  }

  formatArtists(artists: { name: string }[]): string {
    return artists.map(a => a.name).join(', ');
  }

  formatGenres(genres: { name: string }[]): string {
    return genres.map(g => g.name).join(' · ');
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  playTrack(track: Track): void {
    this.playerService.playTrack(track, this.tracks());
  }

  openAddToPlaylistModal(track: Track): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.warning('Необходимо войти в систему');
      return;
    }
    this.selectedTrack.set(track);
    this.showPlaylistModal.set(true);
  }

  onAddToPlaylist(playlistId: number): void {
    const track = this.selectedTrack();
    if (!track) return;

    this.playlistService.addTrack(playlistId, track.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Трек добавлен в плейлист');
          this.showPlaylistModal.set(false);
          this.selectedTrack.set(null);
        }
      });
  }

  closePlaylistModal(): void {
    this.showPlaylistModal.set(false);
    this.selectedTrack.set(null);
  }
}