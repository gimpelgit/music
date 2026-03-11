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
  if (!album) {
    return 'http://localhost:8080/uploads/albums/default.jpeg';
  }
  
  if (album.coverImageUrl) {
    if (album.coverImageUrl.startsWith('http')) {
      return album.coverImageUrl;
    }
    return 'http://localhost:8080' + album.coverImageUrl;
  }
  
  return 'http://localhost:8080/uploads/albums/default.jpeg';
}