import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track } from '../models/track.model';

export interface TrackCreateRequest {
  title: string;
  albumId?: number;
  durationSeconds: number;
  lyrics?: string;
  releaseDate?: string;
  artistIds: number[];
  genreIds: number[];
}

export interface TrackUpdateRequest {
  title?: string;
  albumId?: number;
  durationSeconds?: number;
  lyrics?: string;
  releaseDate?: string;
  artistIds?: number[];
  genreIds?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminTrackService {
  private readonly apiUrl = 'http://localhost:8080/api/tracks';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl);
  }

  getById(id: number): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/${id}`);
  }

  create(formData: FormData): Observable<Track> {
    return this.http.post<Track>(this.apiUrl, formData);
  }

  update(id: number, formData: FormData): Observable<Track> {
    return this.http.put<Track>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}