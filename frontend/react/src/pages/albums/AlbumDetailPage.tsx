import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { albumService } from '@/api/albumService';
import { trackService } from '@/api/trackService';
import { type Album, getAlbumCoverUrl } from '@/types/album';
import { type Track } from '@/types/track';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

export const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { warning } = useNotification();

  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlbumData = async () => {
      if (!id) return;

      try {
        const albumId = Number.parseInt(id, 10);
        const [albumData, tracksData] = await Promise.all([
          albumService.getById(albumId),
          trackService.getTracksByAlbum(albumId),
        ]);

        setAlbum(albumData);
        setTracks(tracksData);
      } catch (error) {
        console.error('Error loading album:', error);
        navigate('/albums');
      } finally {
        setLoading(false);
      }
    };

    loadAlbumData();
  }, [id, navigate]);

  const formatArtists = (artists: { name: string }[]): string => {
    return artists.map(a => a.name).join(', ');
  };

  const formatGenres = (genres: { name: string }[]): string => {
    return genres.map(g => g.name).join(' · ');
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: Track) => {
    if (!isAuthenticated) {
      warning('Необходимо войти в систему');
      return;
    }
    console.log('Play track:', track);
  };

  const handlePlayAll = () => {
    if (!isAuthenticated) {
      warning('Необходимо войти в систему');
      return;
    }
    if (tracks.length > 0) {
      handlePlayTrack(tracks[0]);
    }
  };

  const handleAddToPlaylist = (track: Track) => {
    if (!isAuthenticated) {
      warning('Необходимо войти в систему');
      return;
    }
    console.log('Add to playlist:', track);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!album) {
    return (
      <EmptyState
        icon="bi-exclamation-triangle"
        message="Альбом не найден"
      />
    );
  }

  return (
    <div className="container py-4">
      {/* Хлебные крошки */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/albums" className="text-decoration-none">
              Альбомы
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {album.title}
          </li>
        </ol>
      </nav>

      {/* Информация об альбоме */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <img
              src={getAlbumCoverUrl(album)}
              alt={album.title}
              className="card-img-top"
              style={{ aspectRatio: '1/1', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className="col-md-9">
          <div className="h-100 d-flex flex-column justify-content-end">
            <h1 className="display-5 fw-bold mb-3">{album.title}</h1>

            <div className="d-flex gap-3 mb-4">
              <button
                className="btn btn-primary btn-lg"
                onClick={handlePlayAll}
                disabled={tracks.length === 0}
              >
                <i className="bi bi-play-fill me-2"></i>
                Слушать альбом
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Список треков */}
      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <h2 className="h5 mb-0">Треки альбома</h2>
        </div>

        <div className="list-group list-group-flush">
          {tracks.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-music-note-beamed" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p className="mt-3 text-muted">В альбоме нет треков</p>
            </div>
          ) : (
            tracks.map((track, index) => (
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
                            <span>{formatGenres(track.genres)}</span>
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
                    <button
                      className="btn btn-sm btn-outline-primary rounded-circle me-2"
                      style={{ width: '40px', height: '40px' }}
                      onClick={() => handlePlayTrack(track)}
                    >
                      <i className="bi bi-play-fill"></i>
                    </button>

                    {isAuthenticated && (
                      <button
                        className="btn btn-sm btn-outline-success rounded-circle"
                        style={{ width: '40px', height: '40px' }}
                        onClick={() => handleAddToPlaylist(track)}
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};