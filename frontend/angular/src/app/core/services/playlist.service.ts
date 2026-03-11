import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Playlist } from '../models/playlist.model';

export interface UpdatePositionRequest {
  position: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private readonly apiUrl = 'http://localhost:8080/api/playlists';
  private readonly userPlaylists = signal<Playlist[]>([]);
  
  readonly userPlaylists$ = this.userPlaylists.asReadonly();

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(this.apiUrl);
  }

  getById(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.apiUrl}/${id}`);
  }

  getUserPlaylists(userId: number): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap(playlists => this.userPlaylists.set(playlists))
    );
  }

  getPublicPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/public`);
  }

  create(formData: FormData): Observable<Playlist> {
    return this.http.post<Playlist>(this.apiUrl, formData).pipe(
      tap(newPlaylist => {
        this.userPlaylists.update(playlists => [...playlists, newPlaylist]);
      })
    );
  }

  update(id: number, formData: FormData): Observable<Playlist> {
    return this.http.put<Playlist>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(updatedPlaylist => {
        this.userPlaylists.update(playlists => 
          playlists.map(p => p.id === id ? updatedPlaylist : p)
        );
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.userPlaylists.update(playlists => 
          playlists.filter(p => p.id !== id)
        );
      })
    );
  }

  addTrack(playlistId: number, trackId: number): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/${playlistId}/tracks/${trackId}`, {}).pipe(
      tap(updatedPlaylist => {
        this.userPlaylists.update(playlists => 
          playlists.map(p => p.id === playlistId ? updatedPlaylist : p)
        );
      })
    );
  }

  removeTrack(playlistId: number, trackId: number): Observable<Playlist> {
    return this.http.delete<Playlist>(`${this.apiUrl}/${playlistId}/tracks/${trackId}`).pipe(
      tap(updatedPlaylist => {
        this.userPlaylists.update(playlists => 
          playlists.map(p => p.id === playlistId ? updatedPlaylist : p)
        );
      })
    );
  }

  updateTrackPosition(playlistId: number, trackId: number, position: number): Observable<Playlist> {
    const request: UpdatePositionRequest = { position };
    return this.http.put<Playlist>(`${this.apiUrl}/${playlistId}/tracks/${trackId}`, request).pipe(
      tap(updatedPlaylist => {
        this.userPlaylists.update(playlists => 
          playlists.map(p => p.id === playlistId ? updatedPlaylist : p)
        );
      })
    );
  }

  loadUserPlaylists(userId: number): void {
    this.getUserPlaylists(userId).subscribe();
  }
}