import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api';
import type { User, UserCreateRequest, UserUpdateRequest } from '@/types/user';

export const adminUserService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>(API_CONFIG.ENDPOINTS.USERS);
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
    return response.data;
  },

  create: async (user: UserCreateRequest): Promise<User> => {
    const response = await apiClient.post<User>(API_CONFIG.ENDPOINTS.USERS, user);
    return response.data;
  },

  update: async (id: number, user: UserUpdateRequest): Promise<User> => {
    const response = await apiClient.put<User>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, user);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
  }
};