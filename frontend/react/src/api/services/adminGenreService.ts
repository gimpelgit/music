import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api';
import type { Genre } from '@/types/genre';

export const adminGenreService = {
  getAll: async (): Promise<Genre[]> => {
    const response = await apiClient.get<Genre[]>(API_CONFIG.ENDPOINTS.GENRES);
    return response.data;
  },

  getById: async (id: number): Promise<Genre> => {
    const response = await apiClient.get<Genre>(`${API_CONFIG.ENDPOINTS.GENRES}/${id}`);
    return response.data;
  },

  create: async (genre: Partial<Genre>): Promise<Genre> => {
    const response = await apiClient.post<Genre>(API_CONFIG.ENDPOINTS.GENRES, genre);
    return response.data;
  },

  update: async (id: number, genre: Partial<Genre>): Promise<Genre> => {
    const response = await apiClient.put<Genre>(`${API_CONFIG.ENDPOINTS.GENRES}/${id}`, genre);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.GENRES}/${id}`);
  }
};