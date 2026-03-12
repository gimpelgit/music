import { apiClient } from './client';
import type { Album, AlbumFilterRequest, PageResponse } from '@/types/album';

const API_URL = 'http://localhost:8080/api/albums';

export const albumService = {
  getAll: async (): Promise<Album[]> => {
    const response = await apiClient.get<Album[]>(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<Album> => {
    const response = await apiClient.get<Album>(`${API_URL}/${id}`);
    return response.data;
  },

  filterAlbums: async (filter: AlbumFilterRequest): Promise<PageResponse<Album>> => {
    const response = await apiClient.post<PageResponse<Album>>(`${API_URL}/filter`, filter);
    return response.data;
  }
};