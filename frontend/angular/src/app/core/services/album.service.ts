import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album, AlbumFilterRequest, PageResponse } from '../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private readonly apiUrl = 'http://localhost:8080/api/albums';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Album[]> {
    return this.http.get<Album[]>(this.apiUrl);
  }

  getById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/${id}`);
  }

  filterAlbums(filter: AlbumFilterRequest): Observable<PageResponse<Album>> {
    return this.http.post<PageResponse<Album>>(`${this.apiUrl}/filter`, filter);
  }
}