import { apiClient } from './client';
import type { Artist } from '@/types/artist';

const API_URL = 'http://localhost:8080/api/artists';

export const artistService = {
  getAll: async (): Promise<Artist[]> => {
    const response = await apiClient.get<Artist[]>(API_URL);
    return response.data;
  }
};