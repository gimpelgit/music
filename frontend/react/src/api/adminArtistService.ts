import { apiClient } from './client';
import type { Artist } from '@/types/artist';

export const adminArtistService = {
  getAll: async (): Promise<Artist[]> => {
    const response = await apiClient.get<Artist[]>('/artists');
    return response.data;
  },

  getById: async (id: number): Promise<Artist> => {
    const response = await apiClient.get<Artist>(`/artists/${id}`);
    return response.data;
  },

  create: async (artist: Partial<Artist>): Promise<Artist> => {
    const response = await apiClient.post<Artist>('/artists', artist);
    return response.data;
  },

  update: async (id: number, artist: Partial<Artist>): Promise<Artist> => {
    const response = await apiClient.put<Artist>(`/artists/${id}`, artist);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/artists/${id}`);
  }
};