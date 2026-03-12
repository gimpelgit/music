import { apiClient } from './client';
import type { Genre } from '@/types/genre';

export const adminGenreService = {
  getAll: async (): Promise<Genre[]> => {
    const response = await apiClient.get<Genre[]>('/genres');
    return response.data;
  },

  getById: async (id: number): Promise<Genre> => {
    const response = await apiClient.get<Genre>(`/genres/${id}`);
    return response.data;
  },

  create: async (genre: Partial<Genre>): Promise<Genre> => {
    const response = await apiClient.post<Genre>('/genres', genre);
    return response.data;
  },

  update: async (id: number, genre: Partial<Genre>): Promise<Genre> => {
    const response = await apiClient.put<Genre>(`/genres/${id}`, genre);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/genres/${id}`);
  }
};