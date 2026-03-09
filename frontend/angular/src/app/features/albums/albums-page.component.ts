import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlbumService } from '../../core/services/album.service';
import { ArtistService } from '../../core/services/artist.service';
import { GenreService } from '../../core/services/genre.service';
import { Album, PageResponse } from '../../core/models/album.model';
import { Artist } from '../../core/models/artist.model';
import { Genre } from '../../core/models/genre.model';
import { AlbumCardComponent } from '../../shared/components/album-card/album-card.component';
import { Subject, takeUntil, forkJoin } from 'rxjs';

@Component({
  selector: 'app-albums-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AlbumCardComponent
  ],
  templateUrl: './albums-page.component.html',
})
export class AlbumsPageComponent implements OnInit, OnDestroy {
  albums = signal<Album[]>([]);
  artists = signal<Artist[]>([]);
  genres = signal<Genre[]>([]);

  selectedGenreIds = signal<number[]>([]);
  selectedArtistIds = signal<number[]>([]);

  readonly pageSize = 12;
  currentPage = signal<number>(1);
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);

  hasSelectedFilters = computed(() => 
    this.selectedGenreIds().length > 0 || this.selectedArtistIds().length > 0
  );

  pagesArray = computed(() => 
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    private readonly genreService: GenreService
  ) {}

  ngOnInit(): void {
    forkJoin({
      artists: this.artistService.getAll(),
      genres: this.genreService.getAll()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ artists, genres }) => {
          this.artists.set(artists);
          this.genres.set(genres);
          this.loadFilteredAlbums();
        },
        error: (error) => {
          console.error('Error loading initial data:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFilteredAlbums(): void {
    const filterRequest: any = {
      page: this.currentPage(),
      size: this.pageSize
    };

    const genreIds = this.selectedGenreIds();
    const artistIds = this.selectedArtistIds();

    if (genreIds.length > 0) {
      filterRequest.genreIds = genreIds;
    }

    if (artistIds.length > 0) {
      filterRequest.artistIds = artistIds;
    }

    this.albumService.filterAlbums(filterRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PageResponse<Album>) => {
          this.albums.set(response.content || []);
          this.currentPage.set(response.page);
          this.totalElements.set(response.totalElements);
          this.totalPages.set(response.totalPages);
        },
        error: (error) => {
          console.error('Error loading albums:', error);
          this.albums.set([]);
        }
      });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadFilteredAlbums();
  }

  onPageChange(page: number): void {
    if (page === this.currentPage()) {
      return;
    }
    
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadFilteredAlbums();
    }
  }

  clearFilters(): void {
    this.selectedGenreIds.set([]);
    this.selectedArtistIds.set([]);
    this.applyFilters();
  }

  toggleGenre(genreId: number): void {
    this.selectedGenreIds.update(ids => {
      const index = ids.indexOf(genreId);
      if (index === -1) {
        return [...ids, genreId];
      } else {
        return ids.filter(id => id !== genreId);
      }
    });
  }

  toggleArtist(artistId: number): void {
    this.selectedArtistIds.update(ids => {
      const index = ids.indexOf(artistId);
      if (index === -1) {
        return [...ids, artistId];
      } else {
        return ids.filter(id => id !== artistId);
      }
    });
  }

  isGenreSelected(genreId: number): boolean {
    return this.selectedGenreIds().includes(genreId);
  }

  isArtistSelected(artistId: number): boolean {
    return this.selectedArtistIds().includes(artistId);
  }
}