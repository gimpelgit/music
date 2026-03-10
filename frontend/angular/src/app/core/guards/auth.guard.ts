import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (!isAuthenticated) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }

    const requiredRole = route.data['role'];
    
    if (requiredRole) {
      const userRole = this.authService.user()?.role;
      
      if (requiredRole === 'ROLE_ADMIN' && userRole !== 'ROLE_ADMIN') {
        this.router.navigate(['/albums']);
        return false;
      }
    }
    return true;
  }
}