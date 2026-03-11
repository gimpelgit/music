import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class UserPlaylistService {
  private readonly apiUrl = 'http://localhost:8080/api/playlists';

  constructor(private readonly http: HttpClient) {}

  getMyPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/my`);
  }

  create(formData: FormData): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}`, formData);
  }

  update(id: number, formData: FormData): Observable<Playlist> {
    return this.http.put<Playlist>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addTrack(playlistId: number, trackId: number): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/${playlistId}/tracks/${trackId}`, {});
  }

  removeTrack(playlistId: number, trackId: number): Observable<Playlist> {
    return this.http.delete<Playlist>(`${this.apiUrl}/${playlistId}/tracks/${trackId}`);
  }
}