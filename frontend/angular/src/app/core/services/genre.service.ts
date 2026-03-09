import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '../models/genre.model';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private readonly apiUrl = 'http://localhost:8080/api/genres';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.apiUrl);
  }
}