import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from 'axios';

export const API_BASE_URL = 'http://localhost:8080/api';

class ApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();