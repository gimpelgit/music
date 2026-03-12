import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Музыка
        </Link>
        
        <div className="navbar-nav me-auto">
          {isAuthenticated && (
            <>
              <Link className="nav-link" to="/albums">
                <i className="bi bi-disc me-1"></i>
                Альбомы
              </Link>
              <Link className="nav-link" to="/playlists/public">
                <i className="bi bi-globe me-1"></i>
                Публичные плейлисты
              </Link>
              <Link className="nav-link" to="/playlists">
                <i className="bi bi-music-note-list me-1"></i>
                Мои плейлисты
              </Link>
            </>
          )}
        </div>
        
        <div className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <>
              {user?.role === 'ROLE_ADMIN' && (
                <Link className="nav-link" to="/admin">
                  <i className="bi bi-shield-lock me-1"></i>
                  Админка
                </Link>
              )}
              <Link className="nav-link" to="/profile">
                <i className="bi bi-person-circle me-1"></i>
                {user?.name}
              </Link>
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Войти
              </Link>
              <Link className="nav-link" to="/register">
                <i className="bi bi-person-plus me-1"></i>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};