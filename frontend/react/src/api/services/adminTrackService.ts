import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api';
import type { Track } from '@/types/track';

export interface TrackCreateRequest {
  title: string;
  albumId?: number;
  durationSeconds: number;
  lyrics?: string;
  releaseDate?: string;
  artistIds: number[];
  genreIds: number[];
}

export const adminTrackService = {
  getAll: async (): Promise<Track[]> => {
    const response = await apiClient.get<Track[]>(API_CONFIG.ENDPOINTS.TRACKS);
    return response.data;
  },

  getById: async (id: number): Promise<Track> => {
    const response = await apiClient.get<Track>(`${API_CONFIG.ENDPOINTS.TRACKS}/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Track> => {
    const response = await apiClient.post<Track>(API_CONFIG.ENDPOINTS.TRACKS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Track> => {
    const response = await apiClient.put<Track>(`${API_CONFIG.ENDPOINTS.TRACKS}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.TRACKS}/${id}`);
  }
};