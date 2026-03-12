import React from 'react';
import { Link } from 'react-router-dom';
import { type Playlist, getPlaylistCoverUrl } from '@/types/playlist';
import './PlaylistSidebar.css';

interface PlaylistSidebarProps {
  playlists: Playlist[];
  selectedPlaylist: Playlist | null;
  onSelectPlaylist: (playlist: Playlist) => void;
  onDeleteClick: (playlistId: number) => void;
  deleteConfirmId: number | null;
  onConfirmDelete: (playlistId: number) => void;
  onCancelDelete: () => void;
}

export const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({
  playlists,
  selectedPlaylist,
  onSelectPlaylist,
  onDeleteClick,
  deleteConfirmId,
  onConfirmDelete,
  onCancelDelete
}) => {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Мои плейлисты</h2>
        <Link to="/playlists/new" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg"></i>
        </Link>
      </div>
      
      <div className="list-group list-group-flush">
        {playlists.map(playlist => (
          <div key={playlist.id} className="list-group-item p-0">
            <div className="d-flex align-items-center p-3">
              <button 
                type="button"
                className={`btn btn-link p-0 border-0 rounded me-3 playlist-cover-btn ${selectedPlaylist?.id === playlist.id ? 'selected' : ''}`}
                style={{ width: '48px', height: '48px', overflow: 'hidden', flexShrink: 0 }}
                onClick={() => onSelectPlaylist(playlist)}
              >
                <img 
                  src={getPlaylistCoverUrl(playlist)}
                  alt="Обложка плейлиста" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
              
              <div className="flex-grow-1">
                <div className="fw-semibold">{playlist.name}</div>
                <div className="small">
                  <span className="text-secondary">{playlist.tracks.length} треков</span>
                  {!playlist.isPublic && (
                    <span className="badge bg-secondary ms-2">Приватный</span>
                  )}
                </div>
              </div>
              
              {deleteConfirmId === playlist.id ? (
                <div className="ms-2">
                  <button 
                    className="btn btn-sm btn-outline-success me-1" 
                    onClick={() => onConfirmDelete(playlist.id)}
                  >
                    <i className="bi bi-check-lg"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={onCancelDelete}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              ) : (
                <button 
                  className="btn btn-sm btn-outline-danger ms-2" 
                  onClick={() => onDeleteClick(playlist.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          </div>
        ))}
        
        {playlists.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted mb-0">Нет плейлистов</p>
            <Link to="/playlists/new" className="btn btn-link">Создать первый плейлист</Link>
          </div>
        )}
      </div>
    </div>
  );
};