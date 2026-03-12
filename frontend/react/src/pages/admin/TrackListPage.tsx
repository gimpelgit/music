import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminTrackService } from '@/api/adminTrackService';
import { useNotification } from '@/contexts/NotificationContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { Track } from '@/types/track';

export const TrackListPage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const sortedTracks = useMemo(() => {
    return [...tracks].sort((a, b) => {
      const aHasNoAlbum = !a.albumId;
      const bHasNoAlbum = !b.albumId;
      
      if (aHasNoAlbum && !bHasNoAlbum) return -1;
      if (!aHasNoAlbum && bHasNoAlbum) return 1;
      
      if (!aHasNoAlbum && !bHasNoAlbum) {
        const albumA = (a.albumTitle || '').toLowerCase();
        const albumB = (b.albumTitle || '').toLowerCase();
        
        if (albumA < albumB) return -1;
        if (albumA > albumB) return 1;
      }

      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      return titleA.localeCompare(titleB);
    });
  }, [tracks]);

  const loadTracks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminTrackService.getAll();
      setTracks(data);
      setFilteredTracks(data);
    } catch (err) {
      error('Ошибка при загрузке треков');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      setFilteredTracks(sortedTracks);
      return;
    }

    const filtered = sortedTracks.filter(track => 
      track.title.toLowerCase().includes(query) ||
      track.artists.some(a => a.name.toLowerCase().includes(query)) ||
      (track.albumTitle?.toLowerCase().includes(query))
    );
    setFilteredTracks(filtered);
  }, [searchQuery, sortedTracks]);

  const handleDelete = async (id: number) => {
    try {
      await adminTrackService.delete(id);
      success('Трек успешно удален');
      await loadTracks();
      setDeleteConfirmId(null);
    } catch (err) {
      error('Ошибка при удалении трека');
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const formatArtists = (artists: { name: string }[]) => {
    return artists.map(a => a.name).join(', ');
  };


  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ru-RU');
  };

  const getAlbumDisplay = (track: Track) => {
    return track.albumTitle || '— Без альбома —';
  };

  const getRowClass = (track: Track) => {
    return track.albumId ? '' : 'table-secondary';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-white py-3 d-flex flex-wrap gap-3 justify-content-between align-items-center">
              <h3 className="h6 mb-0">Управление треками</h3>
              
              <div className="d-flex gap-2">
                <div style={{ minWidth: '250px' }}>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Поиск треков..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Link to="/admin/tracks/new" className="btn btn-primary btn-sm">
                  <i className="bi bi-plus-lg me-1"></i>
                  Добавить трек
                </Link>
              </div>
            </div>

            <div className="card-body">
              {filteredTracks.length === 0 ? (
                <EmptyState
                  icon="bi-music-note-beamed"
                  message={tracks.length === 0 ? "Треки не найдены" : "Ничего не найдено по вашему запросу"}
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Альбом</th>
                        <th>Исполнители</th>
                        <th>Жанры</th>
                        <th>Длительность</th>
                        <th>Дата релиза</th>
                        <th className="text-end">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTracks.map(track => (
                        <tr key={`track-${track.id}`} className={getRowClass(track)}>
                          <td className="fw-medium">{track.id}</td>
                          <td>{track.title}</td>
                          <td>
                            <span className={track.albumId ? '' : 'fst-italic text-muted'}>
                              {getAlbumDisplay(track)}
                            </span>
                          </td>
                          <td>
                            <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {formatArtists(track.artists)}
                            </div>
                          </td>
                          <td>
                            <div style={{ maxWidth: '200px' }}>
                              {track.genres.map((genre) => (
                                <span key={genre.id} className="badge bg-secondary me-1" style={{ fontWeight: 'normal' }}>
                                  {genre.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>{formatDuration(track.durationSeconds)}</td>
                          <td>{formatDate(track.releaseDate)}</td>
                          <td className="text-end">
                            {deleteConfirmId === track.id ? (
                              <div className="d-flex justify-content-end align-items-center">
                                <span className="me-2 text-muted">Удалить?</span>
                                <button
                                  className="btn btn-sm btn-outline-success me-1"
                                  onClick={() => handleDelete(track.id)}
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
                                  onClick={() => navigate(`/admin/tracks/${track.id}/edit`)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => confirmDelete(track.id)}
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
                  
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="text-muted small">
                      Всего записей: {filteredTracks.length}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};