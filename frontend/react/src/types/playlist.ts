import type { Track } from './track';
import { getUploadUrl } from '@/config/api';

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

export interface UpdatePositionRequest {
  position: number;
}

export function getPlaylistCoverUrl(playlist: Playlist | null): string {
  return getUploadUrl('playlists', playlist?.coverImageUrl);
}