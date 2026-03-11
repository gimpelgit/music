import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album } from '../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class AdminAlbumService {
  private readonly apiUrl = 'http://localhost:8080/api/albums';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Album[]> {
    return this.http.get<Album[]>(this.apiUrl);
  }

  getById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/${id}`);
  }

  create(formData: FormData): Observable<Album> {
    return this.http.post<Album>(this.apiUrl, formData);
  }

  update(id: number, formData: FormData): Observable<Album> {
    return this.http.put<Album>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}