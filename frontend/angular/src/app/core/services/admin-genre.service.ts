import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '../../core/models/genre.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGenreService {
  private readonly apiUrl = 'http://localhost:8080/api/genres';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.apiUrl);
  }

  getById(id: number): Observable<Genre> {
    return this.http.get<Genre>(`${this.apiUrl}/${id}`);
  }

  create(genre: Partial<Genre>): Observable<Genre> {
    return this.http.post<Genre>(this.apiUrl, genre);
  }

  update(id: number, genre: Partial<Genre>): Observable<Genre> {
    return this.http.put<Genre>(`${this.apiUrl}/${id}`, genre);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}