import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminGenreService } from '@/api/services/adminGenreService';
import { useNotification } from '@/contexts/NotificationContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { Genre } from '@/types/genre';

export const GenreListPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const loadGenres = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGenreService.getAll();
      setGenres(data);
    } catch (err) {
      error('Ошибка при загрузке жанров');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadGenres();
  }, [loadGenres]);

  const handleDelete = async (id: number) => {
    try {
      await adminGenreService.delete(id);
      success('Жанр успешно удален');
      await loadGenres();
      setDeleteConfirmId(null);
    } catch (err) {
      error('Ошибка при удалении жанра');
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
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
              <h3 className="h6 mb-0">Управление жанрами</h3>
              <Link to="/admin/genres/new" className="btn btn-primary btn-sm">
                <i className="bi bi-plus-lg me-1"></i>
                Добавить жанр
              </Link>
            </div>

            <div className="card-body">
              {genres.length === 0 ? (
                <EmptyState
                  icon="bi-tags"
                  message="Жанры не найдены"
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th className="text-end">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {genres.map(genre => (
                        <tr key={`genre-${genre.id}`}>
                          <td className="fw-medium">{genre.id}</td>
                          <td>{genre.name}</td>
                          <td className="text-end">
                            {deleteConfirmId === genre.id ? (
                              <div className="d-flex justify-content-end align-items-center">
                                <span className="me-2 text-muted">Удалить?</span>
                                <button
                                  className="btn btn-sm btn-outline-success me-1"
                                  onClick={() => handleDelete(genre.id)}
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
                                  onClick={() => navigate(`/admin/genres/${genre.id}/edit`)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => confirmDelete(genre.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
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