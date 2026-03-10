import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminGenreService } from '../../../../core/services/admin-genre.service';
import { Genre } from '../../../../core/models/genre.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-genre-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './genre-list.component.html',
})
export class GenreListComponent implements OnInit, OnDestroy {
  genres = signal<Genre[]>([]);
  loading = signal(false);
  deleteConfirmId = signal<number | null>(null);

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly genreService: AdminGenreService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadGenres();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadGenres(): void {
    this.loading.set(true);
    this.genreService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (genres) => {
          this.genres.set(genres);
          this.loading.set(false);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при загрузке жанров');
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

  deleteGenre(id: number): void {
    this.loading.set(true);
    this.genreService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Жанр успешно удален');
          this.loadGenres();
          this.deleteConfirmId.set(null);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при удалении жанра');
          this.loading.set(false);
        }
      });
  }
}