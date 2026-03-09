import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private readonly apiUrl = 'http://localhost:8080/api/artists';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.apiUrl);
  }
}