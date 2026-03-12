import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { PublicRoute } from './components/guards/PublicRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import './styles/main.css';

const AlbumsPage = () => <div>Albums Page</div>;
const AlbumDetailPage = () => <div>Album Detail Page</div>;
const ProfilePage = () => <div>Profile Page</div>;
const PlaylistsPage = () => <div>Playlists Page</div>;
const PlaylistDetailPage = () => <div>Playlist Detail Page</div>;
const PlaylistFormPage = () => <div>Playlist Form Page</div>;
const PublicPlaylistsPage = () => <div>Public Playlists Page</div>;
const AdminPage = () => <div>Admin Page</div>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Layout>
            <Routes>
              {/* Public routes */}
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

              {/* Protected routes */}
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

              <Route path="/admin/*" element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <AdminPage />
                </ProtectedRoute>
              } />

              <Route path="/" element={<Navigate to="/albums" replace />} />
              <Route path="*" element={<Navigate to="/albums" replace />} />
            </Routes>
          </Layout>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;