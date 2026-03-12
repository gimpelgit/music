import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api';
import type { Artist } from '@/types/artist';

export const artistService = {
  getAll: async (): Promise<Artist[]> => {
    const response = await apiClient.get<Artist[]>(API_CONFIG.ENDPOINTS.ARTISTS);
    return response.data;
  }
};