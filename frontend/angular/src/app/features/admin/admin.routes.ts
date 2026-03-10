import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { GenreListComponent } from './components/genre-list/genre-list.component';
import { GenreFormComponent } from './components/genre-form/genre-form.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { ArtistFormComponent } from './components/artist-form/artist-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'genres', pathMatch: 'full' },
      { path: 'users', component: UserListComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/:id/edit', component: UserFormComponent },
      { path: 'genres', component: GenreListComponent },
      { path: 'genres/new', component: GenreFormComponent },
      { path: 'genres/:id/edit', component: GenreFormComponent },
      { path: 'artists', component: ArtistListComponent },
      { path: 'artists/new', component: ArtistFormComponent },
      { path: 'artists/:id/edit', component: ArtistFormComponent }
    ]
  }
];