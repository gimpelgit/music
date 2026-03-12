import React, { useState, useEffect } from 'react';
import { playlistService } from '@/api/services/playlistService';
import { PlaylistCard } from '@/components/playlist/PlaylistCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { Playlist } from '@/types/playlist';

export const PublicPlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const data = await playlistService.getPublicPlaylists();
        setPlaylists(data);
      } catch (error) {
        console.error('Error loading public playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (playlists.length === 0) {
    return (
      <div className="container py-4">
        <EmptyState
          icon="bi-music-note-list"
          message="Публичные плейлисты не найдены"
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Публичные плейлисты</h1>
      
      <div className="row g-4">
        {playlists.map(playlist => (
          <div key={playlist.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <PlaylistCard playlist={playlist} />
          </div>
        ))}
      </div>
    </div>
  );
};