import { apiClient } from './client';
import type { Album } from '@/types/album';

export const adminAlbumService = {
  getAll: async (): Promise<Album[]> => {
    const response = await apiClient.get<Album[]>('/albums');
    return response.data;
  },

  getById: async (id: number): Promise<Album> => {
    const response = await apiClient.get<Album>(`/albums/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Album> => {
    const response = await apiClient.post<Album>('/albums', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Album> => {
    const response = await apiClient.put<Album>(`/albums/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/albums/${id}`);
  }
};