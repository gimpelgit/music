export interface Album {
  id: number;
  title: string;
  coverImageUrl: string | null;
}

export interface AlbumFilterRequest {
  genreIds?: number[];
  artistIds?: number[];
  page: number;
  size: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}