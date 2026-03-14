import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (!isAuthenticated) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return of(false);
    }

    const requiredRole = route.data['role'];
    
    if (!requiredRole) {
      return of(true);
    }

    return this.authService.checkAdminRole().pipe(
      map(isAdmin => {
        if (requiredRole === 'ROLE_ADMIN' && !isAdmin) {
          this.router.navigate(['/albums']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/albums']);
        return of(false);
      })
    );
  }
}