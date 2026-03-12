import React from 'react';
import { Link } from 'react-router-dom';
import { type Playlist, getPlaylistCoverUrl } from '@/types/playlist';
import './PlaylistCard.css';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <Link to={`/playlists/${playlist.id}`} className="text-decoration-none">
      <div className="card h-100 shadow-sm playlist-card">
        <img 
          src={getPlaylistCoverUrl(playlist)} 
          alt={playlist.name}
          className="card-img-top"
          style={{ aspectRatio: '1/1', objectFit: 'cover' }}
        />
        <div className="card-body">
          <h5 className="card-title text-truncate text-dark">{playlist.name}</h5>
          <p className="card-text small text-muted">
            <i className="bi bi-person-circle me-1"></i>
            {playlist.userName} · {playlist.tracks.length} треков
          </p>
        </div>
      </div>
    </Link>
  );
};