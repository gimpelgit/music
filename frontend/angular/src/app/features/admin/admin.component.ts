import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  menuItems = [
    { path: 'users', icon: 'bi-people', label: 'Пользователи' },
    { path: 'genres', icon: 'bi-tags', label: 'Жанры' },
    { path: 'artists', icon: 'bi-mic', label: 'Исполнители' },
    { path: 'albums', icon: 'bi-disc', label: 'Альбомы' },
    { path: 'tracks', icon: 'bi-music-note-beamed', label: 'Треки' }
  ];

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router
  ) {}

  isActive(path: string): boolean {
    return this.router.url.includes(`/admin/${path}`);
  }
}