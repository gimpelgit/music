import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { playlistService } from '@/api/services/playlistService';
import { PlaylistSidebar } from '@/components/playlist/PlaylistSidebar';
import { TrackPositionModal } from '@/components/playlist/TrackPositionModal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { getPlaylistCoverUrl } from '@/types/playlist';
import type { Playlist } from '@/types/playlist';
import type { Track } from '@/types/track';
import './PlaylistsPage.css';

export const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [selectedTrackForPosition, setSelectedTrackForPosition] = useState<Track | null>(null);

  const { user } = useAuth();
  const { success, error } = useNotification();
  const player = usePlayer();

  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const loadPlaylists = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await playlistService.getUserPlaylists(user.id);
      setPlaylists(data);
      if (data.length > 0) {
        setSelectedPlaylist(data[0]);
      }
    } catch (err) {
      error('Ошибка при загрузке плейлистов');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handlePlayTrack = (track: Track, tracks: Track[]) => {
    player.playTrack(track, tracks);
  };

  const handleRemoveTrack = async (playlistId: number, trackId: number) => {
    try {
      const updatedPlaylist = await playlistService.removeTrack(playlistId, trackId);
      success('Трек удален из плейлиста');
      
      setPlaylists(prev => 
        prev.map(p => p.id === playlistId ? updatedPlaylist : p)
      );
      
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(updatedPlaylist);
      }
    } catch (err) {
      error('Ошибка при удалении трека');
    }
  };

  const handleOpenPositionModal = (track: Track) => {
    setSelectedTrackForPosition(track);
    setShowPositionModal(true);
  };

  const handlePositionChanged = async (newPosition: number) => {
    if (!selectedPlaylist || !selectedTrackForPosition) return;

    try {
      const updatedPlaylist = await playlistService.updateTrackPosition(
        selectedPlaylist.id,
        selectedTrackForPosition.id,
        newPosition
      );
      
      success('Позиция трека изменена');
      
      setPlaylists(prev => 
        prev.map(p => p.id === selectedPlaylist.id ? updatedPlaylist : p)
      );
      
      setSelectedPlaylist(updatedPlaylist);
      setShowPositionModal(false);
      setSelectedTrackForPosition(null);
    } catch (err) {
      error('Ошибка при изменении позиции трека');
    }
  };

  const handleDeleteClick = (playlistId: number) => {
    setDeleteConfirmId(playlistId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleConfirmDelete = async (playlistId: number) => {
    try {
      await playlistService.delete(playlistId);
      success('Плейлист удален');
      
      const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
      setPlaylists(updatedPlaylists);
      
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(updatedPlaylists[0] || null);
      }
      
      setDeleteConfirmId(null);
    } catch (err) {
      error('Ошибка при удалении плейлиста');
    }
  };

  const formatArtists = (artists: { name: string }[]): string => {
    return artists.map(a => a.name).join(', ');
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-md-4 col-lg-3">
          <PlaylistSidebar
            playlists={playlists}
            selectedPlaylist={selectedPlaylist}
            onSelectPlaylist={handleSelectPlaylist}
            onDeleteClick={handleDeleteClick}
            deleteConfirmId={deleteConfirmId}
            onConfirmDelete={handleConfirmDelete}
            onCancelDelete={handleCancelDelete}
          />
        </div>

        <div className="col-md-8 col-lg-9">
          {selectedPlaylist ? (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <img 
                    src={getPlaylistCoverUrl(selectedPlaylist)}
                    alt="Обложка плейлиста" 
                    className="rounded shadow-sm"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h1 className="h3 mb-0">{selectedPlaylist.name}</h1>
                      <span className={`badge ${selectedPlaylist.isPublic ? 'bg-success' : 'bg-secondary'}`}>
                        {selectedPlaylist.isPublic ? 'Публичный' : 'Приватный'}
                      </span>
                    </div>
                    <p className="text-muted mb-0">
                      <i className="bi bi-music-note-beamed me-1"></i>
                      {selectedPlaylist.tracks.length} треков
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <Link 
                      to={`/playlists/${selectedPlaylist.id}/edit`} 
                      className="btn btn-outline-primary"
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Редактировать
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {selectedPlaylist.tracks.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-music-note-beamed" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                      <p className="mt-3 text-muted">В плейлисте нет треков</p>
                      <Link to="/albums" className="btn btn-primary mt-2">
                        <i className="bi bi-plus-circle me-2"></i>
                        Добавить треки
                      </Link>
                    </div>
                  ) : (
                    selectedPlaylist.tracks.map((track, index) => (
                      <div key={track.id} className="list-group-item p-3">
                        <div className="row align-items-center g-3">
                          <div className="col-auto">
                            <span className="text-secondary fw-medium" style={{ width: '30px', display: 'inline-block' }}>
                              {index + 1}
                            </span>
                          </div>
                          
                          <div className="col">
                            <div className="d-flex flex-column">
                              <h3 className="h6 mb-1">{track.title}</h3>
                              <div className="small text-secondary">
                                {formatArtists(track.artists)} · {formatDuration(track.durationSeconds)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-auto">
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-outline-primary rounded-circle"
                                style={{ width: '40px', height: '40px' }}
                                onClick={() => handlePlayTrack(track, selectedPlaylist.tracks)}
                              >
                                <i className={`bi ${
                                  player.currentTrack?.id === track.id && player.isPlaying 
                                    ? 'bi-pause-fill' 
                                    : 'bi-play-fill'
                                }`}></i>
                              </button>
                              
                              {selectedPlaylist.tracks.length > 1 && (
                                <button 
                                  className="btn btn-sm btn-outline-secondary rounded-circle"
                                  style={{ width: '40px', height: '40px' }}
                                  onClick={() => handleOpenPositionModal(track)}
                                >
                                  <i className="bi bi-arrows-move"></i>
                                </button>
                              )}
                              
                              <button 
                                className="btn btn-sm btn-outline-danger rounded-circle"
                                style={{ width: '40px', height: '40px' }}
                                onClick={() => handleRemoveTrack(selectedPlaylist.id, track.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <i className="bi bi-music-note-list" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                <p className="mt-3 text-muted">Выберите плейлист из списка</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPositionModal && selectedTrackForPosition && selectedPlaylist && (
        <TrackPositionModal
          track={selectedTrackForPosition}
          totalTracks={selectedPlaylist.tracks.length}
          currentPosition={selectedPlaylist.tracks.findIndex(t => t.id === selectedTrackForPosition.id)}
          onClose={() => {
            setShowPositionModal(false);
            setSelectedTrackForPosition(null);
          }}
          onSave={handlePositionChanged}
        />
      )}
    </div>
  );
};