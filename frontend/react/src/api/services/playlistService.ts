import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api';
import type { Playlist, UpdatePositionRequest } from '@/types/playlist';


export const playlistService = {
  getAll: async (): Promise<Playlist[]> => {
    const response = await apiClient.get<Playlist[]>(API_CONFIG.ENDPOINTS.PLAYLISTS);
    return response.data;
  },

  getById: async (id: number): Promise<Playlist> => {
    const response = await apiClient.get<Playlist>(`${API_CONFIG.ENDPOINTS.PLAYLISTS}/${id}`);
    return response.data;
  },

  getUserPlaylists: async (userId: number): Promise<Playlist[]> => {
    const response = await apiClient.get<Playlist[]>(`${API_CONFIG.ENDPOINTS.PLAYLISTS}/user/${userId}`);
    return response.data;
  },

  getPublicPlaylists: async (): Promise<Playlist[]> => {
    const response = await apiClient.get<Playlist[]>(`${API_CONFIG.ENDPOINTS.PLAYLISTS}/public`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Playlist> => {
    const response = await apiClient.post<Playlist>(API_CONFIG.ENDPOINTS.PLAYLISTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Playlist> => {
    const response = await apiClient.put<Playlist>(`${API_CONFIG.ENDPOINTS.PLAYLISTS}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.PLAYLISTS}/${id}`);
  },

  addTrack: async (playlistId: number, trackId: number): Promise<Playlist> => {
    const response = await apiClient.post<Playlist>(`${API_CONFIG.ENDPOINTS.PLAYLISTS}/${playlistId}/tracks/${trackId}`, {});
    return response.data;
  },

  removeTrack: async (playlistId: number, trackId: number): Promise<Playlist> => {
    const response = await apiClient.delete<Playlist>(`${API_CONFIG.ENDPOINTS.PLAYLISTS}/${playlistId}/tracks/${trackId}`);
    return response.data;
  },

  updateTrackPosition: async (playlistId: number, trackId: number, position: number): Promise<Playlist> => {
    const request: UpdatePositionRequest = { position };
    const response = await apiClient.put<Playlist>(`${API_CONFIG.ENDPOINTS.PLAYLISTS}/${playlistId}/tracks/${trackId}`, request);
    return response.data;
  }
};