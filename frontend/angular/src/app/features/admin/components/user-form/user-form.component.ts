import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminUserService } from '../../../../core/services/admin-user.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface UserForm {
  username: string;
  name: string;
  password: string;
  role: string;
  createdAt?: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit, OnDestroy {
  user: UserForm = {
    username: '',
    name: '',
    password: '',
    role: 'ROLE_USER',
    createdAt: '',
  };
  
  isEditing = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  userId: number | null = null;

  roleOptions = [
    { value: 'ROLE_USER', label: 'Пользователь' },
    { value: 'ROLE_ADMIN', label: 'Администратор' }
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userService: AdminUserService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.userId = Number(id);
      this.loadUser(this.userId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUser(id: number): void {
    this.loading.set(true);
    this.userService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = {
            username: user.username,
            name: user.name,
            password: '',
            role: user.role,
            createdAt: user.createdAt
          };
          this.loading.set(false);
        },
        error: (error) => {
          this.notificationService.error('Ошибка при загрузке пользователя');
          this.loading.set(false);
          this.router.navigate(['/admin/users']);
        }
      });
  }

  onSubmit(): void {
    if (!this.user.name?.trim()) {
      this.notificationService.warning('Имя не может быть пустым');
      return;
    }

    if (!this.user.username?.trim()) {
      this.notificationService.warning('Username не может быть пустым');
      return;
    }

    if (!this.isEditing() && !this.user.password?.trim()) {
      this.notificationService.warning('Пароль не может быть пустым при создании');
      return;
    }

    this.submitting.set(true);

    const userData: any = {
      username: this.user.username,
      name: this.user.name,
      role: this.user.role
    };

    if (this.user.password?.trim()) {
      userData.password = this.user.password;
    }

    const request = this.isEditing()
      ? this.userService.update(this.userId!, userData)
      : this.userService.create(userData);

    request.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            this.isEditing() ? 'Пользователь успешно обновлен' : 'Пользователь успешно создан'
          );
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          let message = error?.error?.message;
          if (!message) {
            message = this.isEditing() ? 'Ошибка при обновлении пользователя' : 'Ошибка при создании пользователя';
          }
          this.notificationService.error(message);
          this.submitting.set(false);
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }
}