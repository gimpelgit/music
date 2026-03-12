import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api';
import type { Artist } from '@/types/artist';

export const adminArtistService = {
  getAll: async (): Promise<Artist[]> => {
    const response = await apiClient.get<Artist[]>(API_CONFIG.ENDPOINTS.ARTISTS);
    return response.data;
  },

  getById: async (id: number): Promise<Artist> => {
    const response = await apiClient.get<Artist>(`${API_CONFIG.ENDPOINTS.ARTISTS}/${id}`);
    return response.data;
  },

  create: async (artist: Partial<Artist>): Promise<Artist> => {
    const response = await apiClient.post<Artist>(API_CONFIG.ENDPOINTS.ARTISTS, artist);
    return response.data;
  },

  update: async (id: number, artist: Partial<Artist>): Promise<Artist> => {
    const response = await apiClient.put<Artist>(`${API_CONFIG.ENDPOINTS.ARTISTS}/${id}`, artist);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.ARTISTS}/${id}`);
  }
};