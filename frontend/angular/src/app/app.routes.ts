import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicGuard } from './core/guards/public.guard';
import { AlbumsPageComponent } from './features/albums/albums-page.component';
import { AlbumDetailComponent } from './features/albums/album-detail.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { PlaylistsPageComponent } from './features/playlists/playlists-page.component';
import { PlaylistDetailComponent } from './features/playlists/playlist-detail.component';
import { PlaylistFormComponent } from './features/playlists/playlist-form.component';
import { PublicPlaylistsComponent } from './features/playlists/public-playlists.component';

export const routes: Routes = [
  { path: '', redirectTo: '/albums', pathMatch: 'full' },
  
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [PublicGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [PublicGuard]
  },
  
  { 
    path: 'albums', 
    component: AlbumsPageComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'albums/:id', 
    component: AlbumDetailComponent,
    canActivate: [AuthGuard]
  },

  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'playlists',
    component: PlaylistsPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'playlists/public',
    component: PublicPlaylistsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'playlists/new',
    component: PlaylistFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'playlists/:id',
    component: PlaylistDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'playlists/:id/edit',
    component: PlaylistFormComponent,
    canActivate: [AuthGuard]
  },
  
  { 
    path: 'admin', 
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [AuthGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  
  { path: '**', redirectTo: '/albums' }
];