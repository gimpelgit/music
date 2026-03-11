import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PlaylistService } from '../../core/services/playlist.service';
import { Playlist, getPlaylistCoverUrl } from '../../core/models/playlist.model';

@Component({
  selector: 'app-public-playlists',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './public-playlists.component.html'
})
export class PublicPlaylistsComponent implements OnInit, OnDestroy {
  playlists = signal<Playlist[]>([]);
  loading = signal(true);
  
  private readonly destroy$ = new Subject<void>();

  protected readonly getPlaylistCoverUrl = getPlaylistCoverUrl;

  constructor(private readonly playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.playlistService.getPublicPlaylists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (playlists) => {
          this.playlists.set(playlists);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}