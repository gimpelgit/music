import { Routes } from '@angular/router';
import { AlbumsPageComponent } from './features/albums/albums-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/albums', pathMatch: 'full' },
  { path: 'albums', component: AlbumsPageComponent }
];