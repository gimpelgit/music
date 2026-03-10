import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-header bg-white py-3">
              <h2 class="h5 mb-0">Профиль пользователя</h2>
            </div>
            
            <div class="card-body">
              @if (authService.user(); as user) {
                <div class="text-center mb-4">
                  <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style="width: 100px; height: 100px; font-size: 2.5rem;">
                    {{ user.name.charAt(0) }}
                  </div>
                  <h3 class="mt-3 mb-1">{{ user.name }}</h3>
                  <p class="text-secondary mb-0">&#64;{{ user.username }}</p>
                </div>

                <div class="border-top pt-4">
                  <div class="row">
                    <div class="col-sm-4 fw-semibold">Роль:</div>
                    <div class="col-sm-8">
                      @if (user.role === 'ROLE_ADMIN') {
                        <span class="badge bg-danger">Администратор</span>
                      } @else {
                        <span class="badge bg-secondary">Пользователь</span>
                      }
                    </div>
                  </div>
                  
                  @if (user.createdAt) {
                    <div class="row mt-3">
                      <div class="col-sm-4 fw-semibold">Дата регистрации:</div>
                      <div class="col-sm-8">{{ user.createdAt | date:'dd.MM.yyyy' }}</div>
                    </div>
                  }
                </div>

                <div class="d-flex gap-2 mt-4">
                  <button class="btn btn-outline-primary flex-grow-1">
                    <i class="bi bi-pencil me-2"></i>
                    Редактировать
                  </button>
                  <button class="btn btn-outline-danger flex-grow-1" (click)="onLogout()">
                    <i class="bi bi-box-arrow-right me-2"></i>
                    Выйти
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  constructor(
    public readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}