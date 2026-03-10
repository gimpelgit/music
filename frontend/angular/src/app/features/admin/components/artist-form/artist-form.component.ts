import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminArtistService } from '../../../../core/services/admin-artist.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Artist } from '../../../../core/models/artist.model';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './artist-form.component.html',
})
export class ArtistFormComponent implements OnInit, OnDestroy {
  artist: Partial<Artist> = { name: '' };
  isEditing = signal<boolean>(false);;
  loading = signal<boolean>(false);;
  submitting = signal<boolean>(false);;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly artistService: AdminArtistService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.loadArtist(Number(id));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadArtist(id: number): void {
    this.loading.set(true);
    this.artistService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (artist) => {
          this.artist = artist;
          this.loading.set(false);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при загрузке исполнителя');
          this.loading.set(false);
          this.router.navigate(['/admin/artists']);
        }
      });
  }

  onSubmit(): void {
    if (!this.artist.name?.trim()) {
      this.notificationService.warning('Имя исполнителя не может быть пустым');
      return;
    }

    this.submitting.set(true);

    const request = this.isEditing()
      ? this.artistService.update(this.artist.id!, { name: this.artist.name })
      : this.artistService.create({ name: this.artist.name });

    request.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            this.isEditing() ? 'Исполнитель успешно обновлен' : 'Исполнитель успешно создан'
          );
          this.router.navigate(['/admin/artists']);
        },
        error: (error) => {
          let message = error?.error?.message;
          if (!message) {
            message = this.isEditing() ? 'Ошибка при обновлении исполнителя' : 'Ошибка при создании исполнителя';
          }
          this.notificationService.error(message);
          this.submitting.set(false);
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/admin/artists']);
  }
}