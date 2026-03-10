import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminGenreService } from '../../../../core/services/admin-genre.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Genre } from '../../../../core/models/genre.model';

@Component({
  selector: 'app-genre-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './genre-form.component.html',
})
export class GenreFormComponent implements OnInit, OnDestroy {
  genre: Partial<Genre> = { name: '' };
  isEditing = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly genreService: AdminGenreService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.loadGenre(Number(id));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadGenre(id: number): void {
    this.loading.set(true);
    this.genreService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (genre) => {
          this.genre = genre;
          this.loading.set(false);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при загрузке жанра');
          this.loading.set(false);
          this.router.navigate(['/admin/genres']);
        }
      });
  }

  onSubmit(): void {
    if (!this.genre.name?.trim()) {
      this.notificationService.warning('Название жанра не может быть пустым');
      return;
    }

    this.submitting.set(true);

    const request = this.isEditing()
      ? this.genreService.update(this.genre.id!, { name: this.genre.name })
      : this.genreService.create({ name: this.genre.name });

    request.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            this.isEditing() ? 'Жанр успешно обновлен' : 'Жанр успешно создан'
          );
          this.router.navigate(['/admin/genres']);
        },
        error: (error) => {
          let message = error?.error?.message;
          if (!message) {
            message = this.isEditing() ? 'Ошибка при обновлении жанра' : 'Ошибка при создании жанра';
          }
          this.notificationService.error(message);
          this.submitting.set(false);
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/admin/genres']);
  }
}