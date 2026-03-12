import { AxiosError, type AxiosResponse } from 'axios';
import { apiClient } from './client';

export const setupResponseInterceptor = (
  onUnauthorized: () => void,
  onForbidden: () => void
) => {
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        onUnauthorized();
      } else if (error.response?.status === 403) {
        onForbidden();
      }
      return Promise.reject(error);
    }
  );
};