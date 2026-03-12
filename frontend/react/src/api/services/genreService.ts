import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api';
import type { Genre } from '@/types/genre';


export const genreService = {
  getAll: async (): Promise<Genre[]> => {
    const response = await apiClient.get<Genre[]>(API_CONFIG.ENDPOINTS.GENRES);
    return response.data;
  }
};