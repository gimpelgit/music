import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PlaylistService } from '../../core/services/playlist.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-playlist-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './playlist-form.component.html'
})
export class PlaylistFormComponent implements OnInit, OnDestroy {
  playlistName = '';
  isPublic = true;
  coverImageFile: File | null = null;
  existingCoverUrl: string | null = null;
  
  isEditing = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  playlistId: number | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly playlistService: PlaylistService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.playlistId = Number(id);
      this.loadPlaylist(this.playlistId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPlaylist(id: number): void {
    this.loading.set(true);
    this.playlistService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (playlist) => {
          this.playlistName = playlist.name;
          this.isPublic = playlist.isPublic;
          if (playlist.coverImageUrl) {
            this.existingCoverUrl = 'http://localhost:8080' + playlist.coverImageUrl;
          }
          this.loading.set(false);
        },
        error: () => {
          this.notificationService.error('Ошибка при загрузке плейлиста');
          this.loading.set(false);
          this.router.navigate(['/playlists']);
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!this.isValidImageFile(file)) {
        this.notificationService.error('Неверный формат файла. Поддерживаются: JPG, PNG, GIF');
        input.value = '';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.error('Файл слишком большой. Максимальный размер: 5MB');
        input.value = '';
        return;
      }
      
      this.coverImageFile = file;
    }
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type);
  }

  onSubmit(): void {
    if (!this.playlistName.trim()) {
      this.notificationService.warning('Введите название плейлиста');
      return;
    }

    this.submitting.set(true);
    const formData = this.createFormData();
    const request = this.createRequest(formData);

    request.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            this.isEditing() ? 'Плейлист обновлен' : 'Плейлист создан'
          );
          this.router.navigate(['/playlists']);
        },
        error: (error) => {
          const message = error?.error?.message || 
            (this.isEditing() ? 'Ошибка при обновлении плейлиста' : 'Ошибка при создании плейлиста');
          this.notificationService.error(message);
          this.submitting.set(false);
        }
      });
  }

  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.playlistName.trim());
    formData.append('isPublic', String(this.isPublic));

    if (this.coverImageFile) {
      formData.append('coverImage', this.coverImageFile);
    }
    
    return formData;
  }

  private createRequest(formData: FormData) {
    if (this.isEditing()) {
      if (!this.playlistId) {
        throw new Error('ID плейлиста не найден при редактировании');
      }
      return this.playlistService.update(this.playlistId, formData);
    }
    return this.playlistService.create(formData);
  }

  removeCoverImage(): void {
    this.coverImageFile = null;
    this.existingCoverUrl = null;
  }

  onCancel(): void {
    this.router.navigate(['/playlists']);
  }
}