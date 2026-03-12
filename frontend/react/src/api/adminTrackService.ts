import { apiClient } from './client';
import type { Track } from '@/types/track';

export interface TrackCreateRequest {
  title: string;
  albumId?: number;
  durationSeconds: number;
  lyrics?: string;
  releaseDate?: string;
  artistIds: number[];
  genreIds: number[];
}

export const adminTrackService = {
  getAll: async (): Promise<Track[]> => {
    const response = await apiClient.get<Track[]>('/tracks');
    return response.data;
  },

  getById: async (id: number): Promise<Track> => {
    const response = await apiClient.get<Track>(`/tracks/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Track> => {
    const response = await apiClient.post<Track>('/tracks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Track> => {
    const response = await apiClient.put<Track>(`/tracks/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tracks/${id}`);
  }
};