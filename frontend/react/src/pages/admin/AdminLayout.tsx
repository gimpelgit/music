import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { path: '/admin/users', icon: 'bi-people', label: 'Пользователи' },
    { path: '/admin/genres', icon: 'bi-tags', label: 'Жанры' },
    { path: '/admin/artists', icon: 'bi-mic', label: 'Исполнители' },
    { path: '/admin/albums', icon: 'bi-disc', label: 'Альбомы' },
    { path: '/admin/tracks', icon: 'bi-music-note-beamed', label: 'Треки' },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card shadow">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Панель администратора</h2>
              <span className="text-muted">
                Добро пожаловать, {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 col-lg-2 mb-4">
          <div className="card shadow">
            <div className="list-group list-group-flush">
              {menuItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                      isActive ? 'active' : ''
                    }`
                  }
                >
                  <i className={`bi ${item.icon}`}></i>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-9 col-lg-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};