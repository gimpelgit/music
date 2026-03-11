import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminAlbumService } from '../../../../core/services/admin-album.service';
import { Album, getAlbumCoverUrl } from '../../../../core/models/album.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './album-list.component.html'
})
export class AlbumListComponent implements OnInit, OnDestroy {
  albums = signal<Album[]>([]);
  loading = signal(false);
  deleteConfirmId = signal<number | null>(null);

  private readonly destroy$ = new Subject<void>();

  protected readonly getAlbumCoverUrl = getAlbumCoverUrl;

  constructor(
    private readonly albumService: AdminAlbumService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAlbums(): void {
    this.loading.set(true);
    this.albumService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (albums) => {
          this.albums.set(albums);
          this.loading.set(false);
        },
        error: () => {
          this.notificationService.error('Ошибка при загрузке альбомов');
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

  deleteAlbum(id: number): void {
    this.loading.set(true);
    this.albumService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Альбом успешно удален');
          this.loadAlbums();
          this.deleteConfirmId.set(null);
        },
        error: (error) => {
          let message = error?.error?.message;
          if (!message) {
            message = 'Ошибка при удалении альбома';
          }
          this.notificationService.error(message);
          this.loading.set(false);
        }
      });
  }
}