import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { PublicRoute } from './components/guards/PublicRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AlbumsPage } from './pages/albums/AlbumsPage';
import { AlbumDetailPage } from './pages/albums/AlbumDetailPage';
import { PublicPlaylistsPage } from './pages/playlists/PublicPlaylistsPage';
import { PlaylistsPage } from './pages/playlists/PlaylistsPage';
import { PlaylistDetailPage } from './pages/playlists/PlaylistDetailPage';
import { PlaylistFormPage } from './pages/playlists/PlaylistFormPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { GenreListPage } from './pages/admin/GenreListPage';
import { GenreFormPage } from './pages/admin/GenreFormPage';
import { ArtistListPage } from './pages/admin/ArtistListPage';
import { ArtistFormPage } from './pages/admin/ArtistFormPage';
import { UserListPage } from './pages/admin/UserListPage';
import { UserFormPage } from './pages/admin/UserFormPage';
import { AlbumListPage } from './pages/admin/AlbumListPage';
import { AlbumFormPage } from './pages/admin/AlbumFormPage';
import { TrackListPage } from './pages/admin/TrackListPage';
import { TrackFormPage } from './pages/admin/TrackFormPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import './main.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <PlayerProvider>
            <Layout>
              <Routes>
                <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } />

                <Route path="/albums" element={
                  <ProtectedRoute>
                    <AlbumsPage />
                  </ProtectedRoute>
                } />
                <Route path="/albums/:id" element={
                  <ProtectedRoute>
                    <AlbumDetailPage />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />

                <Route path="/playlists" element={
                  <ProtectedRoute>
                    <PlaylistsPage />
                  </ProtectedRoute>
                } />
                <Route path="/playlists/public" element={
                  <ProtectedRoute>
                    <PublicPlaylistsPage />
                  </ProtectedRoute>
                } />
                <Route path="/playlists/new" element={
                  <ProtectedRoute>
                    <PlaylistFormPage />
                  </ProtectedRoute>
                } />
                <Route path="/playlists/:id" element={
                  <ProtectedRoute>
                    <PlaylistDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/playlists/:id/edit" element={
                  <ProtectedRoute>
                    <PlaylistFormPage />
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="ROLE_ADMIN">
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="users" replace />} />
                  <Route path="users" element={<UserListPage />} />
                  <Route path="users/new" element={<UserFormPage />} />
                  <Route path="users/:id/edit" element={<UserFormPage />} />
                  <Route path="genres" element={<GenreListPage />} />
                  <Route path="genres/new" element={<GenreFormPage />} />
                  <Route path="genres/:id/edit" element={<GenreFormPage />} />
                  <Route path="artists" element={<ArtistListPage />} />
                  <Route path="artists/new" element={<ArtistFormPage />} />
                  <Route path="artists/:id/edit" element={<ArtistFormPage />} />
                  <Route path="albums" element={<AlbumListPage />} />
                  <Route path="albums/new" element={<AlbumFormPage />} />
                  <Route path="albums/:id/edit" element={<AlbumFormPage />} />
                  <Route path="tracks" element={<TrackListPage />} />
                  <Route path="tracks/new" element={<TrackFormPage />} />
                  <Route path="tracks/:id/edit" element={<TrackFormPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/albums" replace />} />
              </Routes>
            </Layout>
          </PlayerProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;