import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminArtistService } from '@/api/services/adminArtistService';
import { useNotification } from '@/contexts/NotificationContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { Artist } from '@/types/artist';

export const ArtistListPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const loadArtists = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminArtistService.getAll();
      setArtists(data);
    } catch (err) {
      error('Ошибка при загрузке исполнителей');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  const handleDelete = async (id: number) => {
    try {
      await adminArtistService.delete(id);
      success('Исполнитель успешно удален');
      await loadArtists();
      setDeleteConfirmId(null);
    } catch (err) {
      error('Ошибка при удалении исполнителя');
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
              <h3 className="h6 mb-0">Управление исполнителями</h3>
              <Link to="/admin/artists/new" className="btn btn-primary btn-sm">
                <i className="bi bi-plus-lg me-1"></i>
                Добавить исполнителя
              </Link>
            </div>

            <div className="card-body">
              {artists.length === 0 ? (
                <EmptyState
                  icon="bi-people"
                  message="Исполнители не найдены"
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Имя исполнителя</th>
                        <th className="text-end">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {artists.map(artist => (
                      <tr key={`artist-${artist.id}`}>
                        <td className="fw-medium">{artist.id}</td>
                        <td>{artist.name}</td>
                        <td className="text-end">
                          {deleteConfirmId === artist.id ? (
                            <div className="d-flex justify-content-end align-items-center">
                              <span className="me-2 text-muted">Удалить?</span>
                              <button
                                className="btn btn-sm btn-outline-success me-1"
                                onClick={() => handleDelete(artist.id)}
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
                                onClick={() => navigate(`/admin/artists/${artist.id}/edit`)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => confirmDelete(artist.id)}
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