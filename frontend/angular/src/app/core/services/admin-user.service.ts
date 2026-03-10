import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private readonly apiUrl = 'http://localhost:8080/api/users';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(user: Partial<User & { password: string }>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id: number, user: Partial<User & { password?: string }>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}