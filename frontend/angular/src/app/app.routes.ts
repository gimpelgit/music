import { Routes } from '@angular/router';
import { AlbumsPageComponent } from './features/albums/albums-page.component';
import { AlbumDetailComponent } from './features/albums/album-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/albums', pathMatch: 'full' },
  { path: 'albums', component: AlbumsPageComponent },
  { path: 'albums/:id', component: AlbumDetailComponent }
];