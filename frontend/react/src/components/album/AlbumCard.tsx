import React from 'react';
import { Link } from 'react-router-dom';
import { type Album, getAlbumCoverUrl } from '@/types/album';
import './AlbumCard.css';

interface AlbumCardProps {
  album: Album;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  return (
    <Link to={`/albums/${album.id}`} className="text-decoration-none">
      <div className="card h-100 shadow-sm album-card">
        <img 
          src={getAlbumCoverUrl(album)} 
          alt={album.title}
          className="card-img-top"
          style={{ aspectRatio: '1/1', objectFit: 'cover' }}
        />
        <div className="card-body">
          <h5 className="card-title text-truncate text-dark">{album.title}</h5>
        </div>
      </div>
    </Link>
  );
};