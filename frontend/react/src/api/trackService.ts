import { apiClient } from './client';
import type { Track } from '@/types/track';

const API_URL = 'http://localhost:8080/api/tracks';

export const trackService = {
  getTracksByAlbum: async (albumId: number): Promise<Track[]> => {
    const response = await apiClient.get<Track[]>(`${API_URL}/album/${albumId}`);
    return response.data;
  }
};