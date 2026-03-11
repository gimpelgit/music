import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminAlbumService } from '../../../../core/services/admin-album.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Album, getAlbumCoverUrl } from '../../../../core/models/album.model';

@Component({
  selector: 'app-album-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './album-form.component.html'
})
export class AlbumFormComponent implements OnInit, OnDestroy {
  album: Partial<Album> = { title: '', coverImageUrl: null };
  isEditing = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  coverImageFile: File | null = null;
  existingCoverUrl: string | null = null;
  albumId: number | null = null;

  private readonly destroy$ = new Subject<void>();

  protected readonly getAlbumCoverUrl = getAlbumCoverUrl;

  constructor(
    private readonly albumService: AdminAlbumService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.albumId = Number(id);
      this.loadAlbum(this.albumId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAlbum(id: number): void {
    this.loading.set(true);
    this.albumService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (album) => {
          this.album = album;
          if (album.coverImageUrl) {
            this.existingCoverUrl = getAlbumCoverUrl(album);
          }
          this.loading.set(false);
        },
        error: () => {
          this.notificationService.error('Ошибка при загрузке альбома');
          this.loading.set(false);
          this.router.navigate(['/admin/albums']);
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

  validateForm(): boolean {
    if (!this.album.title?.trim()) {
      this.notificationService.warning('Название альбома обязательно');
      return false;
    }

    if (this.album.title.length < 2) {
      this.notificationService.warning('Название должно содержать минимум 2 символа');
      return false;
    }

    if (this.album.title.length > 200) {
      this.notificationService.warning('Название не может превышать 200 символов');
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.submitting.set(true);
    const formData = this.createFormData();
    const request = this.createRequest(formData);

    request.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            this.isEditing() ? 'Альбом успешно обновлен' : 'Альбом успешно создан'
          );
          this.router.navigate(['/admin/albums']);
        },
        error: (error) => {
          const message = error?.error?.message || 
            (this.isEditing() ? 'Ошибка при обновлении альбома' : 'Ошибка при создании альбома');
          this.notificationService.error(message);
          this.submitting.set(false);
        }
      });
  }

  private createFormData(): FormData {
    const formData = new FormData();
    if (this.album.title?.trim()) {
      formData.append('title', this.album.title.trim());
    }

    if (this.coverImageFile) {
      formData.append('coverImage', this.coverImageFile);
    }
    
    return formData;
  }

  private createRequest(formData: FormData) {
    if (this.isEditing()) {
      if (!this.albumId) {
        throw new Error('ID альбома не найден при редактировании');
      }
      return this.albumService.update(this.albumId, formData);
    }
    return this.albumService.create(formData);
  }

  removeCoverImage(): void {
    this.coverImageFile = null;
    this.existingCoverUrl = null;
    this.album.coverImageUrl = null;
  }

  onCancel(): void {
    this.router.navigate(['/admin/albums']);
  }
}