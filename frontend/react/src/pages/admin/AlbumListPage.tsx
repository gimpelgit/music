import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAlbumService } from '@/api/services/adminAlbumService';
import { useNotification } from '@/contexts/NotificationContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { getAlbumCoverUrl } from '@/types/album';
import type { Album } from '@/types/album';

export const AlbumListPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const loadAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminAlbumService.getAll();
      setAlbums(data);
    } catch (err) {
      error('Ошибка при загрузке альбомов');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  const handleDelete = async (id: number) => {
    try {
      await adminAlbumService.delete(id);
      success('Альбом успешно удален');
      await loadAlbums();
      setDeleteConfirmId(null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Ошибка при удалении альбома';
      error(message);
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
              <h3 className="h6 mb-0">Управление альбомами</h3>
              <Link to="/admin/albums/new" className="btn btn-primary btn-sm">
                <i className="bi bi-plus-lg me-1"></i>
                Добавить альбом
              </Link>
            </div>

            <div className="card-body">
              {albums.length === 0 ? (
                <EmptyState
                  icon="bi-disc"
                  message="Альбомы не найдены"
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Обложка</th>
                        <th>Название</th>
                        <th className="text-end">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {albums.map(album => (
                        <tr key={`album-${album.id}`}>
                          <td className="fw-medium">{album.id}</td>
                          <td>
                            <img 
                              src={getAlbumCoverUrl(album)} 
                              alt={album.title}
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          </td>
                          <td>{album.title}</td>
                          <td className="text-end">
                            {deleteConfirmId === album.id ? (
                              <div className="d-flex justify-content-end align-items-center">
                                <span className="me-2 text-muted">Удалить?</span>
                                <button
                                  className="btn btn-sm btn-outline-success me-1"
                                  onClick={() => handleDelete(album.id)}
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
                                  onClick={() => navigate(`/admin/albums/${album.id}/edit`)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => confirmDelete(album.id)}
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