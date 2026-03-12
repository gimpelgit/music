import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api';
import type { Album } from '@/types/album';

export const adminAlbumService = {
  getAll: async (): Promise<Album[]> => {
    const response = await apiClient.get<Album[]>(API_CONFIG.ENDPOINTS.ALBUMS);
    return response.data;
  },

  getById: async (id: number): Promise<Album> => {
    const response = await apiClient.get<Album>(`${API_CONFIG.ENDPOINTS.ALBUMS}/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Album> => {
    const response = await apiClient.post<Album>(API_CONFIG.ENDPOINTS.ALBUMS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Album> => {
    const response = await apiClient.put<Album>(`${API_CONFIG.ENDPOINTS.ALBUMS}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.ALBUMS}/${id}`);
  }
};