import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminArtistService } from '../../../../core/services/admin-artist.service';
import { Artist } from '../../../../core/models/artist.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artist-list.component.html',
})
export class ArtistListComponent implements OnInit, OnDestroy {
  artists = signal<Artist[]>([]);
  loading = signal(false);
  deleteConfirmId = signal<number | null>(null);

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly artistService: AdminArtistService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadArtists(): void {
    this.loading.set(true);
    this.artistService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (artists) => {
          this.artists.set(artists);
          this.loading.set(false);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при загрузке исполнителей');
          this.loading.set(false);
        }
      });
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId.set(id);
  }

  cancelDelete(): void {
    this.deleteConfirmId.set(null);
  }

  deleteArtist(id: number): void {
    this.loading.set(true);
    this.artistService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Исполнитель успешно удален');
          this.loadArtists();
          this.deleteConfirmId.set(null);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при удалении исполнителя');
          this.loading.set(false);
        }
      });
  }
}