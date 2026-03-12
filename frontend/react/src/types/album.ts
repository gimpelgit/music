import { getUploadUrl } from '@/config/api';

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

export function getAlbumCoverUrl(album: Album | null): string {
  return getUploadUrl('albums', album?.coverImageUrl);
}