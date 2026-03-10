import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminUserService } from '../../../../core/services/admin-user.service';
import { User } from '../../../../core/models/auth.models';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit, OnDestroy {
  users = signal<User[]>([]);
  loading = signal(false);
  deleteConfirmId = signal<number | null>(null);

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userService: AdminUserService,
    private readonly notificationService: NotificationService,
    public readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.userService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users.set(users);
          this.loading.set(false);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при загрузке пользователей');
          this.loading.set(false);
        }
      });
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId.set(id);
  }

  cancelDelete(): void {
    this.deleteConfirmId.set(null);
  }

  deleteUser(id: number): void {
    this.loading.set(true);
    this.userService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Пользователь успешно удален');
          this.loadUsers();
          this.deleteConfirmId.set(null);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при удалении пользователя');
          this.loading.set(false);
        }
      });
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ru-RU');
  }

  getRoleName(role: string): string {
    return role === 'ROLE_ADMIN' ? 'Администратор' : 'Пользователь';
  }

  getRoleBadgeClass(role: string): string {
    return role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-secondary';
  }

  canEdit(user: User): boolean {
    const currentUser = this.authService.user();
    if (!currentUser) return false;
    
    if (currentUser.role === 'ROLE_ADMIN') {
      return true;
    }
    return false;
  }

  canDelete(user: User): boolean {
    const currentUser = this.authService.user();
    if (!currentUser) return false;
    
    if (currentUser.role === 'ROLE_ADMIN') {
      return currentUser.id !== user.id;
    }
    return false;
  }
}