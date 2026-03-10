import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../../core/models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class AdminArtistService {
  private readonly apiUrl = 'http://localhost:8080/api/artists';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.apiUrl);
  }

  getById(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/${id}`);
  }

  create(artist: Partial<Artist>): Observable<Artist> {
    return this.http.post<Artist>(this.apiUrl, artist);
  }

  update(id: number, artist: Partial<Artist>): Observable<Artist> {
    return this.http.put<Artist>(`${this.apiUrl}/${id}`, artist);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}