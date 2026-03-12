import React, { useState, useEffect } from 'react';
import { playlistService } from '@/api/services/playlistService';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import type { Track } from '@/types/track';
import type { Playlist } from '@/types/playlist';
import { getPlaylistCoverUrl } from '@/types/playlist';
import { getUploadUrl } from '@/config/api';

interface AddToPlaylistModalProps {
  track: Track;
  onClose: () => void;
  onAddToPlaylist: (playlistId: number) => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  track,
  onClose,
  onAddToPlaylist
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPlaylistForm, setShowNewPlaylistForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);

  const { user } = useAuth();
  const { success, warning, error } = useNotification();

  useEffect(() => {
    if (user) {
      loadUserPlaylists();
    }
  }, [user]);

  const loadUserPlaylists = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await playlistService.getUserPlaylists(user.id);
      setPlaylists(data);
    } catch (err) {
      error('Ошибка при загрузке плейлистов');
    } finally {
      setLoading(false);
    }
  };

  const formatArtists = (artists: { name: string }[]): string => {
    return artists.map(a => a.name).join(', ');
  };

  const trackInPlaylist = (playlist: Playlist): boolean => {
    return playlist.tracks.some(t => t.id === track.id);
  };

  const handleAddToPlaylist = (playlistId: number) => {
    onAddToPlaylist(playlistId);
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      warning('Введите название плейлиста');
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('name', newPlaylistName.trim());
      formData.append('isPublic', 'true');
      formData.append('trackIds', track.id.toString());

      const newPlaylist = await playlistService.create(formData);
      success('Плейлист создан');
      onAddToPlaylist(newPlaylist.id);
    } catch (err) {
      error('Ошибка при создании плейлиста');
    } finally {
      setCreating(false);
    }
  };

  // Выносим логику рендеринга содержимого плейлистов в отдельную функцию
  const renderPlaylistsContent = () => {
    if (loading) {
      return (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary" />
        </div>
      );
    }
    
    if (playlists.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-muted mb-0">У вас нет плейлистов</p>
        </div>
      );
    }
    
    return playlists.map(playlist => (
      <div key={playlist.id} className="d-flex align-items-center justify-content-between p-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <img 
            src={getPlaylistCoverUrl(playlist)}
            alt="Обложка плейлиста"
            className="rounded"
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
          <div>
            <div className="fw-semibold">{playlist.name}</div>
            <div className="small text-muted">{playlist.tracks.length} треков</div>
          </div>
        </div>
        
        {trackInPlaylist(playlist) ? (
          <span className="badge bg-success">Добавлен</span>
        ) : (
          <button 
            className="btn btn-sm btn-primary" 
            onClick={() => handleAddToPlaylist(playlist.id)}
          >
            Добавить
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Добавить в плейлист</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="mb-3">
              <div className="d-flex gap-2 align-items-center mb-3">
                <img 
                  src={getUploadUrl('albums')}
                  alt="Обложка трека" 
                  className="rounded"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                <div>
                  <div className="fw-semibold">{track.title}</div>
                  <div className="small text-muted">{formatArtists(track.artists)}</div>
                </div>
              </div>
            </div>

            {!showNewPlaylistForm && (
              <button 
                className="btn btn-outline-primary w-100 mb-3" 
                onClick={() => setShowNewPlaylistForm(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Новый плейлист
              </button>
            )}

            {showNewPlaylistForm && (
              <div className="mb-3 p-3 bg-light rounded">
                <div className="mb-2">
                  <label htmlFor="newPlaylistName" className="form-label fw-semibold">
                    Название плейлиста
                  </label>
                  <input
                    id="newPlaylistName"
                    type="text"
                    className="form-control"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Введите название"
                    disabled={creating}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary flex-grow-1" 
                    onClick={handleCreatePlaylist}
                    disabled={creating}
                  >
                    {creating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Создание...
                      </>
                    ) : (
                      'Создать и добавить'
                    )}
                  </button>
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={() => setShowNewPlaylistForm(false)}
                    disabled={creating}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="playlists-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {renderPlaylistsContent()}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};