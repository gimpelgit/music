import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api';
import type { Album, AlbumFilterRequest, PageResponse } from '@/types/album';


export const albumService = {
  getAll: async (): Promise<Album[]> => {
    const response = await apiClient.get<Album[]>(API_CONFIG.ENDPOINTS.ALBUMS);
    return response.data;
  },

  getById: async (id: number): Promise<Album> => {
    const response = await apiClient.get<Album>(`${API_CONFIG.ENDPOINTS.ALBUMS}/${id}`);
    return response.data;
  },

  filterAlbums: async (filter: AlbumFilterRequest): Promise<PageResponse<Album>> => {
    const response = await apiClient.post<PageResponse<Album>>(`${API_CONFIG.ENDPOINTS.ALBUMS}/filter`, filter);
    return response.data;
  }
};