import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { AdminTrackService } from '../../../../core/services/admin-track.service';
import { AdminArtistService } from '../../../../core/services/admin-artist.service';
import { AdminGenreService } from '../../../../core/services/admin-genre.service';
import { AlbumService } from '../../../../core/services/album.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Artist } from '../../../../core/models/artist.model';
import { Genre } from '../../../../core/models/genre.model';
import { Album } from '../../../../core/models/album.model';
import { Track } from '../../../../core/models/track.model';

@Component({
  selector: 'app-track-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './track-form.component.html',
  styleUrls: ['./track-form.component.scss']
})
export class TrackFormComponent implements OnInit, OnDestroy {
  trackData = {
    title: '',
    albumId: null as number | null,
    durationMinutes: 0,
    durationSeconds: 0,
    lyrics: '',
    releaseDate: '',
    artistIds: [] as number[],
    genreIds: [] as number[]
  };
  
  artists = signal<Artist[]>([]);
  genres = signal<Genre[]>([]);
  albums = signal<Album[]>([]);
  
  isEditing = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  audioFile: File | null = null;
  existingTrack: Track | null = null;
  trackId: number | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly trackService: AdminTrackService,
    private readonly artistService: AdminArtistService,
    private readonly genreService: AdminGenreService,
    private readonly albumService: AlbumService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    forkJoin({
      artists: this.artistService.getAll(),
      genres: this.genreService.getAll(),
      albums: this.albumService.getAll()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ artists, genres, albums }) => {
          this.artists.set(artists);
          this.genres.set(genres);
          this.albums.set(albums);
          
          if (id) {
            this.isEditing.set(true);
            this.trackId = Number(id);
            this.loadTrack(this.trackId);
          }
        },
        error: (error) => {
          this.notificationService.error('Ошибка при загрузке данных');
          this.router.navigate(['/admin/tracks']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTrack(id: number): void {
    this.loading.set(true);
    this.trackService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (track) => {
          this.existingTrack = track;
          
          const minutes = Math.floor(track.durationSeconds / 60);
          const seconds = track.durationSeconds % 60;
          
          this.trackData = {
            title: track.title,
            albumId: track.albumId || null,
            durationMinutes: minutes,
            durationSeconds: seconds,
            lyrics: track.lyrics || '',
            releaseDate: track.releaseDate || '',
            artistIds: track.artists.map(a => a.id),
            genreIds: track.genres.map(g => g.id)
          };
          
          this.loading.set(false);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при загрузке трека');
          this.loading.set(false);
          this.router.navigate(['/admin/tracks']);
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!this.isValidAudioFile(file)) {
        this.notificationService.error('Неверный формат файла. Поддерживаются: MP3, WAV, OGG, AAC');
        input.value = '';
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) {
        this.notificationService.error('Файл слишком большой. Максимальный размер: 50MB');
        input.value = '';
        return;
      }
      
      this.audioFile = file;
    }
  }

  private isValidAudioFile(file: File): boolean {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'];
    return validTypes.includes(file.type) || /\.(mp3|wav|ogg|aac)$/i.test(file.name);
  }

  onArtistToggle(artistId: number): void {
    this.toggleArrayItem(this.trackData.artistIds, artistId);
  }

  onGenreToggle(genreId: number): void {
    this.toggleArrayItem(this.trackData.genreIds, genreId);
  }

  private toggleArrayItem(array: number[], item: number): void {
    const index = array.indexOf(item);
    if (index === -1) {
      array.push(item);
    } else {
      array.splice(index, 1);
    }
  }

  isArtistSelected(artistId: number): boolean {
    return this.trackData.artistIds.includes(artistId);
  }

  isGenreSelected(genreId: number): boolean {
    return this.trackData.genreIds.includes(genreId);
  }

  validateForm(): boolean {
    if (!this.trackData.title?.trim()) {
      this.notificationService.warning('Название трека обязательно');
      return false;
    }

    if (this.trackData.artistIds.length === 0) {
      this.notificationService.warning('Выберите хотя бы одного исполнителя');
      return false;
    }

    if (this.trackData.genreIds.length === 0) {
      this.notificationService.warning('Выберите хотя бы один жанр');
      return false;
    }

    const totalDuration = this.getTotalDuration();
    if (totalDuration <= 0) {
      this.notificationService.warning('Длительность трека должна быть больше 0');
      return false;
    }

    if (totalDuration > 3600) {
      this.notificationService.warning('Длительность трека не может превышать 60 минут');
      return false;
    }

    if (!this.isEditing() && !this.audioFile) {
      this.notificationService.warning('Выберите аудиофайл');
      return false;
    }

    return true;
  }

  private getTotalDuration(): number {
    return (this.trackData.durationMinutes || 0) * 60 + (this.trackData.durationSeconds || 0);
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
        next: () => this.handleSuccess(),
        error: (error) => this.handleError(error)
      });
  }

  private createFormData(): FormData {
    const formData = new FormData();
    const totalDuration = this.getTotalDuration();

    this.appendBasicFields(formData, totalDuration);
    this.appendConditionalFields(formData);
    this.appendArtistAndGenreIds(formData);
    this.appendAudioFile(formData);

    return formData;
  }

  private appendBasicFields(formData: FormData, totalDuration: number): void {
    formData.append('title', this.trackData.title.trim());
    formData.append('durationSeconds', totalDuration.toString());
  }

  private appendConditionalFields(formData: FormData): void {
    if (this.isEditing()) {
      this.appendEditingFields(formData);
    } else {
      this.appendCreationFields(formData);
    }
  }

  private appendEditingFields(formData: FormData): void {
    if (this.trackData.albumId) {
      formData.append('albumId', this.trackData.albumId.toString());
    } else {
      formData.append('clearAlbumId', 'true');
    }

    if (this.trackData.lyrics?.trim()) {
      formData.append('lyrics', this.trackData.lyrics.trim());
    } else {
      formData.append('clearLyrics', 'true');
    }

    if (this.trackData.releaseDate) {
      formData.append('releaseDate', this.trackData.releaseDate);
    } else {
      formData.append('clearReleaseDate', 'true');
    }
  }

  private appendCreationFields(formData: FormData): void {
    if (this.trackData.albumId) {
      formData.append('albumId', this.trackData.albumId.toString());
    }
    if (this.trackData.lyrics?.trim()) {
      formData.append('lyrics', this.trackData.lyrics.trim());
    }
    if (this.trackData.releaseDate) {
      formData.append('releaseDate', this.trackData.releaseDate);
    }
  }

  private appendArtistAndGenreIds(formData: FormData): void {
    this.trackData.artistIds.forEach(id => {
      formData.append('artistIds', id.toString());
    });
    this.trackData.genreIds.forEach(id => {
      formData.append('genreIds', id.toString());
    });
  }

  private appendAudioFile(formData: FormData): void {
    if (this.audioFile) {
      formData.append('audioFile', this.audioFile);
    }
  }

  private createRequest(formData: FormData) {
    if (this.isEditing()) {
      if (!this.trackId) {
        throw new Error('ID трека не найден при редактировании');
      }
      return this.trackService.update(this.trackId, formData);
    }
    return this.trackService.create(formData);
  }

  private handleSuccess(): void {
    this.notificationService.success(
      this.isEditing() ? 'Трек успешно обновлен' : 'Трек успешно создан'
    );
    this.router.navigate(['/admin/tracks']);
  }

  private handleError(error: any): void {
    const message = error?.error?.message || 
      (this.isEditing() ? 'Ошибка при обновлении трека' : 'Ошибка при создании трека');
    this.notificationService.error(message);
    this.submitting.set(false);
  }

  onCancel(): void {
    this.router.navigate(['/admin/tracks']);
  }

  getDurationHint(): string {
    const total = this.getTotalDuration();
    if (total === 0) return '';
    
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}