import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { AlbumService } from '../../core/services/album.service';
import { TrackService } from '../../core/services/track.service';
import { Album } from '../../core/models/album.model';
import { Track } from '../../core/models/track.model';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './album-detail.component.html'
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  album = signal<Album | null>(null);
  tracks = signal<Track[]>([]);
  
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService
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
      },
      error: (error) => console.error('Error loading album:', error)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTracks(albumId: number): void {
    this.trackService.getTracksByAlbum(albumId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tracks) => this.tracks.set(tracks),
        error: (error) => console.error('Error loading tracks:', error)
      });
  }

  getCoverImage(album: Album): string {
    if (album.coverImageUrl) {
      if (album.coverImageUrl.startsWith('http')) {
        return album.coverImageUrl;
      }
      return 'http://localhost:8080' + album.coverImageUrl;
    }
    return 'https://via.placeholder.com/300x300?text=No+Cover';
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
    // Здесь будет логика воспроизведения трека
    console.log('Playing track:', track.title);
  }
}