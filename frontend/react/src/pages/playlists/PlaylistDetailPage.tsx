import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { playlistService } from '@/api/services/playlistService';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { TrackPositionModal } from '@/components/playlist/TrackPositionModal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { getPlaylistCoverUrl } from '@/types/playlist';
import type { Playlist } from '@/types/playlist';
import type { Track } from '@/types/track';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const player = usePlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [selectedTrackForPosition, setSelectedTrackForPosition] = useState<Track | null>(null);

  useEffect(() => {
    if (id) {
      loadPlaylist(Number(id));
    }
  }, [id]);

  const loadPlaylist = async (playlistId: number) => {
    setLoading(true);
    try {
      const data = await playlistService.getById(playlistId);
      setPlaylist(data);
    } catch (err) {
      error('Плейлист не найден');
      navigate('/playlists/public');
    } finally {
      setLoading(false);
    }
  };

  const isOwner = (): boolean => {
    return !!user && !!playlist && user.id === playlist.userId;
  };

  const handlePlayTrack = (track: Track, tracks: Track[]) => {
    player.playTrack(track, tracks);
  };

  const handlePlayAll = () => {
    if (playlist && playlist.tracks.length > 0) {
      player.playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const handleRemoveTrack = async (trackId: number) => {
    if (!playlist) return;

    try {
      const updatedPlaylist = await playlistService.removeTrack(playlist.id, trackId);
      success('Трек удален из плейлиста');
      setPlaylist(updatedPlaylist);
      setShowDeleteConfirm(null);
    } catch (err) {
      error('Ошибка при удалении трека');
    }
  };

  const handleOpenPositionModal = (track: Track) => {
    setSelectedTrackForPosition(track);
    setShowPositionModal(true);
  };

  const handlePositionChanged = async (newPosition: number) => {
    if (!playlist || !selectedTrackForPosition) return;

    try {
      const updatedPlaylist = await playlistService.updateTrackPosition(
        playlist.id,
        selectedTrackForPosition.id,
        newPosition
      );
      
      success('Позиция трека изменена');
      setPlaylist(updatedPlaylist);
      setShowPositionModal(false);
      setSelectedTrackForPosition(null);
    } catch (err) {
      error('Ошибка при изменении позиции трека');
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlist) return;

    try {
      await playlistService.delete(playlist.id);
      success('Плейлист удален');
      navigate('/playlists/public');
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

  if (!playlist) {
    return (
      <EmptyState
        icon="bi-exclamation-triangle"
        message="Плейлист не найден"
      />
    );
  }

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/playlists/public" className="text-decoration-none">
              Публичные плейлисты
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {playlist.name}
          </li>
        </ol>
      </nav>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <img 
              src={getPlaylistCoverUrl(playlist)} 
              alt={playlist.name}
              className="card-img-top"
              style={{ aspectRatio: '1/1', objectFit: 'cover' }}
            />
          </div>
        </div>
        
        <div className="col-md-9">
          <div className="h-100 d-flex flex-column justify-content-end">
            <div className="d-flex align-items-center gap-2 mb-2">
              <h1 className="display-5 fw-bold mb-0">{playlist.name}</h1>
              <span className={`badge fs-6 ${playlist.isPublic ? 'bg-success' : 'bg-secondary'}`}>
                {playlist.isPublic ? 'Публичный' : 'Приватный'}
              </span>
            </div>
            
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="text-muted">
                <i className="bi bi-person-circle me-1"></i>
                {playlist.userName}
              </span>
              <span className="text-muted">
                <i className="bi bi-music-note-beamed me-1"></i>
                {playlist.tracks.length} треков
              </span>
            </div>
            
            <div className="d-flex gap-3">
              <button 
                className="btn btn-primary btn-lg" 
                onClick={handlePlayAll}
                disabled={playlist.tracks.length === 0}
              >
                <i className="bi bi-play-fill me-2"></i>
                Слушать все
              </button>
              
              {isOwner() && (
                <>
                  <Link to={`/playlists/${playlist.id}/edit`} className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-pencil me-2"></i>
                    Редактировать
                  </Link>
                  
                  <button className="btn btn-outline-danger btn-lg" onClick={handleDeletePlaylist}>
                    <i className="bi bi-trash me-2"></i>
                    Удалить
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <h2 className="h5 mb-0">Треки плейлиста</h2>
        </div>
        
        <div className="list-group list-group-flush">
          {playlist.tracks.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-music-note-beamed" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p className="mt-3 text-muted">В плейлисте нет треков</p>
              {isOwner() && (
                <Link to="/albums" className="btn btn-primary mt-2">
                  <i className="bi bi-plus-circle me-2"></i>
                  Добавить треки
                </Link>
              )}
            </div>
          ) : (
            playlist.tracks.map((track, index) => (
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
                      <div className="d-flex flex-wrap gap-2 small text-secondary">
                        <span>{formatArtists(track.artists)}</span>
                        
                        {track.genres.length > 0 && (
                          <>
                            <span className="text-secondary">·</span>
                            <span>{track.genres.map(g => g.name).join(' · ')}</span>
                          </>
                        )}
                        
                        {track.durationSeconds > 0 && (
                          <>
                            <span className="text-secondary">·</span>
                            <span>{formatDuration(track.durationSeconds)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-auto">
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary rounded-circle"
                        style={{ width: '40px', height: '40px' }}
                        onClick={() => handlePlayTrack(track, playlist.tracks)}
                      >
                        <i className={`bi ${
                          player.currentTrack?.id === track.id && player.isPlaying 
                            ? 'bi-pause-fill' 
                            : 'bi-play-fill'
                        }`}></i>
                      </button>
                      
                      {isOwner() && (
                        <>
                          {playlist.tracks.length > 1 && (
                            <button 
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              style={{ width: '40px', height: '40px' }}
                              onClick={() => handleOpenPositionModal(track)}
                            >
                              <i className="bi bi-arrows-move"></i>
                            </button>
                          )}
                          
                          {showDeleteConfirm === track.id ? (
                            <>
                              <span className="me-2 text-muted">Удалить?</span>
                              <button 
                                className="btn btn-sm btn-outline-success me-1" 
                                onClick={() => handleRemoveTrack(track.id)}
                              >
                                <i className="bi bi-check-lg"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-secondary" 
                                onClick={() => setShowDeleteConfirm(null)}
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                            </>
                          ) : (
                            <button 
                              className="btn btn-sm btn-outline-danger rounded-circle"
                              style={{ width: '40px', height: '40px' }}
                              onClick={() => setShowDeleteConfirm(track.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showPositionModal && selectedTrackForPosition && playlist && (
        <TrackPositionModal
          track={selectedTrackForPosition}
          totalTracks={playlist.tracks.length}
          currentPosition={playlist.tracks.findIndex(t => t.id === selectedTrackForPosition.id)}
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