import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track } from '../models/track.model';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private readonly apiUrl = 'http://localhost:8080/api/tracks';

  constructor(private readonly http: HttpClient) {}

  getTracksByAlbum(albumId: number): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiUrl}/album/${albumId}`);
  }
}