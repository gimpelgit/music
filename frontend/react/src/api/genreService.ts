import { apiClient } from './client';
import type { Genre } from '@/types/genre';

const API_URL = 'http://localhost:8080/api/genres';

export const genreService = {
  getAll: async (): Promise<Genre[]> => {
    const response = await apiClient.get<Genre[]>(API_URL);
    return response.data;
  }
};