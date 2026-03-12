import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api';
import type { Track } from '@/types/track';


export const trackService = {
  getTracksByAlbum: async (albumId: number): Promise<Track[]> => {
    const response = await apiClient.get<Track[]>(`${API_CONFIG.ENDPOINTS.TRACKS}/album/${albumId}`);
    return response.data;
  }
};