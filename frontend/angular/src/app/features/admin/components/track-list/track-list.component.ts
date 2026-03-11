import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminTrackService } from '../../../../core/services/admin-track.service';
import { Track } from '../../../../core/models/track.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent implements OnInit, OnDestroy {
  tracks = signal<Track[]>([]);
  filteredTracks = signal<Track[]>([]);
  loading = signal(false);
  deleteConfirmId = signal<number | null>(null);
  searchQuery = signal('');

  private readonly sortedTracks = computed(() => {
    const tracks = this.tracks();
    return [...tracks].sort((a, b) => {
      const aHasNoAlbum = !a.albumId;
      const bHasNoAlbum = !b.albumId;
      
      if (aHasNoAlbum && !bHasNoAlbum) return -1;
      if (!aHasNoAlbum && bHasNoAlbum) return 1;
      
      if (!aHasNoAlbum && !bHasNoAlbum) {
        const albumA = (a.albumTitle || '').toLowerCase();
        const albumB = (b.albumTitle || '').toLowerCase();
        
        if (albumA < albumB) return -1;
        if (albumA > albumB) return 1;
      }

      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      return titleA.localeCompare(titleB);
    });
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly trackService: AdminTrackService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTracks(): void {
    this.loading.set(true);
    this.trackService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tracks) => {
          this.tracks.set(tracks);
          this.applyFilter();
          this.loading.set(false);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при загрузке треков');
          this.loading.set(false);
        }
      });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.applyFilter();
  }

  private applyFilter(): void {
    const query = this.searchQuery().toLowerCase();
    const sortedTracks = this.sortedTracks();
    
    if (!query) {
      this.filteredTracks.set(sortedTracks);
      return;
    }

    const filtered = sortedTracks.filter(track => 
      track.title.toLowerCase().includes(query) ||
      track.artists.some(a => a.name.toLowerCase().includes(query)) ||
      (track.albumTitle?.toLowerCase().includes(query))
    );
    this.filteredTracks.set(filtered);
  }

  formatArtists(artists: { name: string }[]): string {
    return artists.map(a => a.name).join(', ');
  }

  formatGenres(genres: { name: string }[]): string {
    return genres.map(g => g.name).join(', ');
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ru-RU');
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId.set(id);
  }

  cancelDelete(): void {
    this.deleteConfirmId.set(null);
  }

  deleteTrack(id: number): void {
    this.loading.set(true);
    this.trackService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Трек успешно удален');
          this.loadTracks();
          this.deleteConfirmId.set(null);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при удалении трека');
          this.loading.set(false);
        }
      });
  }

  getAlbumDisplay(track: Track): string {
    return track.albumTitle || '— Без альбома —';
  }

  getRowClass(track: Track): string {
    return track.albumId ? '' : 'table-secondary';
  }
}