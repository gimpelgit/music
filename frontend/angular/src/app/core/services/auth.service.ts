import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of, map } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User, AuthState } from '../models/auth.models';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  private readonly state = signal<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  });

  readonly user = computed(() => this.state().user);
  readonly token = computed(() => this.state().token);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  
  readonly isAdmin = computed(() => this.state().user?.role === 'ROLE_ADMIN');

  constructor(
    private readonly http: HttpClient,
    private readonly playerService: PlayerService
  ) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        this.state.update(state => ({
          ...state,
          user,
          token,
          isAuthenticated: true,
          error: null
        }));
      } catch (e) {
        this.clearStorage();
      }
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => {
          this.state.update(state => ({ 
            ...state, 
            loading: false, 
            error: error.error?.message || 'Ошибка регистрации' 
          }));
          return throwError(() => error);
        })
      );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => {
          this.state.update(state => ({ 
            ...state, 
            loading: false, 
            error: error.error?.message || 'Ошибка входа' 
          }));
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<any> {
    this.state.update(state => ({ ...state, loading: true }));

    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuth()
          this.playerService.stopAndClear();
        }),
        catchError(error => {
          this.clearAuth();
          this.playerService.stopAndClear();
          return throwError(() => error);
        })
      );
  }

  checkAdminRole(): Observable<boolean> {
    if (!this.isAuthenticated()) {
      return of(false);
    }

    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.updateUserInfo(user);
      }),
      map(user => user.role === 'ROLE_ADMIN'),
      catchError(() => of(false))
    );
  }


  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    
    const user = this.decodeToken(response.token);
    
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      this.state.update(state => ({
        ...state,
        user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
        error: null
      }));
    }
  }


  private decodeToken(token: string): User | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      return {
        id: decoded.userId || decoded.id,
        username: decoded.sub || decoded.username,
        name: decoded.name || decoded.sub,
        role: decoded.role || decoded.authorities?.[0] || 'ROLE_USER'
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  private clearAuth(): void {
    this.clearStorage();
    
    this.state.update(state => ({
      ...state,
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    }));
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  updateUserInfo(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    this.state.update(state => ({
      ...state,
      user
    }));
  }
}