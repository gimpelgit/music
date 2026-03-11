import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/auth.models';
import { Playlist } from '../models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private readonly apiUrl = 'http://localhost:8080/api/users';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserPlaylists(id: number): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/${id}/playlists`);
  }

  create(user: Partial<User & { password: string }>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id: number, user: Partial<User & { password?: string }>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}