import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Регистрация</h2>
              
              @if (authService.error()) {
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                  {{ authService.error() }}
                  <button type="button" class="btn-close" (click)="clearError()"></button>
                </div>
              }

              <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
                <div class="mb-3">
                  <label for="name" class="form-label">Имя</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name"
                    name="name"
                    [(ngModel)]="registerData.name"
                    required
                    minlength="2"
                    #name="ngModel">
                  @if (name.invalid && (name.dirty || name.touched)) {
                    <div class="text-danger small mt-1">
                      @if (name.errors?.['required']) {
                        <span>Имя обязательно</span>
                      }
                      @if (name.errors?.['minlength']) {
                        <span>Минимальная длина 2 символа</span>
                      }
                    </div>
                  }
                </div>

                <div class="mb-3">
                  <label for="username" class="form-label">Логин</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username"
                    name="username"
                    [(ngModel)]="registerData.username"
                    required
                    minlength="3"
                    #username="ngModel"
                    autocomplete="username">
                  @if (username.invalid && (username.dirty || username.touched)) {
                    <div class="text-danger small mt-1">
                      @if (username.errors?.['required']) {
                        <span>Логин обязателен</span>
                      }
                      @if (username.errors?.['minlength']) {
                        <span>Минимальная длина 3 символа</span>
                      }
                    </div>
                  }
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label">Пароль</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                    name="password"
                    [(ngModel)]="registerData.password"
                    required
                    minlength="6"
                    #password="ngModel"
                    autocomplete="new-password">
                  @if (password.invalid && (password.dirty || password.touched)) {
                    <div class="text-danger small mt-1">
                      @if (password.errors?.['required']) {
                        <span>Пароль обязателен</span>
                      }
                      @if (password.errors?.['minlength']) {
                        <span>Минимальная длина 6 символов</span>
                      }
                    </div>
                  }
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 py-2 mb-3"
                  [disabled]="!registerForm.form.valid || authService.loading()">
                  @if (authService.loading()) {
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Регистрация...
                  } @else {
                    Зарегистрироваться
                  }
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    Уже есть аккаунт? 
                    <a routerLink="/login" class="text-decoration-none">Войти</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnDestroy {
  registerData = {
    name: '',
    username: '',
    password: ''
  };

  private readonly destroy$ = new Subject<void>();

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.authService.register(this.registerData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/albums']);
        },
        error: () => {}
      });
  }

  clearError(): void {}
}