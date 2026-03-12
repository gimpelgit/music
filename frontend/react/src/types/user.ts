export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  createdAt?: string;
}

export interface UserCreateRequest {
  username: string;
  password: string;
  name: string;
  role: string;
}

export interface UserUpdateRequest {
  username?: string;
  password?: string;
  name?: string;
  role?: string;
}