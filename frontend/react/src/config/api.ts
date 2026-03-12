export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  API_URL: 'http://localhost:8080/api',
  
  UPLOADS: {
    ALBUMS: '/uploads/albums/',
    PLAYLISTS: '/uploads/playlists/',
    DEFAULT_ALBUMS: '/uploads/albums/default.jpeg',
    DEFAULT_PLAYLISTS: '/uploads/playlists/default.jpeg',
  },
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
    },
    USERS: '/users',
    GENRES: '/genres',
    ARTISTS: '/artists',
    ALBUMS: '/albums',
    TRACKS: '/tracks',
    PLAYLISTS: '/playlists',
  }
} as const;

export const getFullUrl = (path: string): string => {
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.BASE_URL}${path}`;
};

export const getUploadUrl = (type: 'albums' | 'playlists', path?: string | null): string => {
  if (!path) {
    return getFullUrl(API_CONFIG.UPLOADS[`DEFAULT_${type.toUpperCase()}` as keyof typeof API_CONFIG.UPLOADS]);
  }
  
  if (path.startsWith('http')) return path;
  
  return getFullUrl(path.startsWith('/') ? path : `${API_CONFIG.UPLOADS[type.toUpperCase() as keyof typeof API_CONFIG.UPLOADS]}${path}`);
};