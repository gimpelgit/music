import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminUserService } from '@/api/services/adminUserService';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { User } from '@/types/user';

export const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { success, error } = useNotification();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminUserService.getAll();
      setUsers(data);
    } catch (err) {
      error('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (id: number) => {
    try {
      await adminUserService.delete(id);
      success('Пользователь успешно удален');
      await loadUsers();
      setDeleteConfirmId(null);
    } catch (err) {
      error('Ошибка при удалении пользователя');
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const getRoleBadgeClass = (role: string) => {
    return role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-secondary';
  };

  const getRoleName = (role: string) => {
    return role === 'ROLE_ADMIN' ? 'Администратор' : 'Пользователь';
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ru-RU');
  };


  const canDelete = (user: User) => {
    if (!currentUser) return false;
    if (currentUser.role === 'ROLE_ADMIN') {
      return currentUser.id !== user.id;
    }
    return false;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h3 className="h6 mb-0">Управление пользователями</h3>
              <Link to="/admin/users/new" className="btn btn-primary btn-sm">
                <i className="bi bi-plus-lg me-1"></i>
                Добавить пользователя
              </Link>
            </div>

            <div className="card-body">
              {users.length === 0 ? (
                <EmptyState
                  icon="bi-people"
                  message="Пользователи не найдены"
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Логин</th>
                        <th>Роль</th>
                        <th>Дата регистрации</th>
                        <th className="text-end">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={`user-${user.id}`}>
                          <td className="fw-medium">{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.username}</td>
                          <td>
                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                              {getRoleName(user.role)}
                            </span>
                          </td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td className="text-end">
                            {deleteConfirmId === user.id ? (
                              <div className="d-flex justify-content-end align-items-center">
                                <span className="me-2 text-muted">Удалить?</span>
                                <button
                                  className="btn btn-sm btn-outline-success me-1"
                                  onClick={() => handleDelete(user.id)}
                                >
                                  <i className="bi bi-check-lg"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={cancelDelete}
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="d-flex justify-content-end">
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                {canDelete(user) && (
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => confirmDelete(user.id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};