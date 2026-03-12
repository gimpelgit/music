import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { success } = useNotification();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      success('Вы успешно вышли из системы');
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getUserInitial = (): string => {
    return user?.name?.charAt(0).toUpperCase() || '?';
  };

  const getRoleBadgeClass = (role: string): string => {
    return role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-secondary';
  };

  const getRoleName = (role: string): string => {
    return role === 'ROLE_ADMIN' ? 'Администратор' : 'Пользователь';
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-white py-3">
              <h2 className="h5 mb-0">Профиль пользователя</h2>
            </div>
            
            <div className="card-body">
              <div className="text-center mb-4">
                <div 
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                  style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
                >
                  {getUserInitial()}
                </div>
                <h3 className="mt-3 mb-1">{user.name}</h3>
                <p className="text-secondary mb-0">@{user.username}</p>
              </div>

              <div className="border-top pt-4">
                <div className="row">
                  <div className="col-sm-4 fw-semibold">Роль:</div>
                  <div className="col-sm-8">
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                  </div>
                </div>
                
                {user.createdAt && (
                  <div className="row mt-3">
                    <div className="col-sm-4 fw-semibold">Дата регистрации:</div>
                    <div className="col-sm-8">{formatDate(user.createdAt)}</div>
                  </div>
                )}
              </div>

              <div className="d-flex gap-2 mt-4">
                <button 
                  className="btn btn-outline-danger flex-grow-1" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};