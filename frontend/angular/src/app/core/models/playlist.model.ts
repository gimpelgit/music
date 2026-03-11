import { Track } from './track.model';

export interface Playlist {
  id: number;
  name: string;
  userId: number;
  userName: string;
  isPublic: boolean;
  coverImageUrl: string | null;
  tracks: Track[];
}

export interface PlaylistCreateRequest {
  name: string;
  isPublic?: boolean;
  trackIds?: number[];
}

export interface PlaylistUpdateRequest {
  name?: string;
  isPublic?: boolean;
  trackIds?: number[];
}

export function getPlaylistCoverUrl(playlist: Playlist | null): string {
  if (!playlist) {
    return 'http://localhost:8080/uploads/playlists/default.jpeg';
  }
  
  if (playlist.coverImageUrl) {
    if (playlist.coverImageUrl.startsWith('http')) {
      return playlist.coverImageUrl;
    }
    return 'http://localhost:8080' + playlist.coverImageUrl;
  }
  
  return 'http://localhost:8080/uploads/playlists/default.jpeg';
}