import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { GenreListComponent } from './components/genre-list/genre-list.component';
import { GenreFormComponent } from './components/genre-form/genre-form.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { ArtistFormComponent } from './components/artist-form/artist-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { TrackListComponent } from './components/track-list/track-list.component';
import { TrackFormComponent } from './components/track-form/track-form.component';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { AlbumFormComponent } from './components/album-form/album-form.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UserListComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/:id/edit', component: UserFormComponent },
      { path: 'genres', component: GenreListComponent },
      { path: 'genres/new', component: GenreFormComponent },
      { path: 'genres/:id/edit', component: GenreFormComponent },
      { path: 'artists', component: ArtistListComponent },
      { path: 'artists/new', component: ArtistFormComponent },
      { path: 'artists/:id/edit', component: ArtistFormComponent },
      { path: 'tracks', component: TrackListComponent },
      { path: 'tracks/new', component: TrackFormComponent },
      { path: 'tracks/:id/edit', component: TrackFormComponent },
      { path: 'albums', component: AlbumListComponent },
      { path: 'albums/new', component: AlbumFormComponent },
      { path: 'albums/:id/edit', component: AlbumFormComponent }
    ]
  }
];