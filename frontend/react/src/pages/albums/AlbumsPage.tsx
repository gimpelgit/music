import React, { useState, useEffect, useCallback } from 'react';
import { AlbumCard } from '@/components/album/AlbumCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { albumService } from '@/api/services/albumService';
import { artistService } from '@/api/services/artistService';
import { genreService } from '@/api/services/genreService';
import { type Album } from '@/types/album';
import { type Artist } from '@/types/artist';
import { type Genre } from '@/types/genre';

const PAGE_SIZE = 12;

export const AlbumsPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [selectedArtistIds, setSelectedArtistIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const hasSelectedFilters = selectedGenreIds.length > 0 || selectedArtistIds.length > 0;

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [artistsData, genresData] = await Promise.all([
          artistService.getAll(),
          genreService.getAll(),
        ]);
        setArtists(artistsData);
        setGenres(genresData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const loadAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const filterRequest = {
        page: currentPage,
        size: PAGE_SIZE,
        ...(selectedGenreIds.length > 0 && { genreIds: selectedGenreIds }),
        ...(selectedArtistIds.length > 0 && { artistIds: selectedArtistIds }),
      };

      const response = await albumService.filterAlbums(filterRequest);
      setAlbums(response.content || []);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading albums:', error);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedGenreIds, selectedArtistIds]);

  useEffect(() => {
    if (!initialLoading) {
      loadAlbums();
    }
  }, [loadAlbums, initialLoading]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenreIds(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
    setCurrentPage(1);
  };

  const handleArtistToggle = (artistId: number) => {
    setSelectedArtistIds(prev =>
      prev.includes(artistId)
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId]
    );
    setCurrentPage(1); 
  };

  const applyFilters = () => {
    loadAlbums();
  };

  const clearFilters = () => {
    setSelectedGenreIds([]);
    setSelectedArtistIds([]);
    setCurrentPage(1);
  };

  const isGenreSelected = (genreId: number) => selectedGenreIds.includes(genreId);
  const isArtistSelected = (artistId: number) => selectedArtistIds.includes(artistId);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (albums.length === 0) {
      return (
        <EmptyState
          icon="bi-music-note-beamed"
          message="Альбомы не найдены"
        />
      );
    }
    
    return (
      <>
        <div className="row g-4">
          {albums.map(album => (
            <div key={album.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <AlbumCard album={album} />
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </>
    );
  };

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Альбомы</h1>
        {hasSelectedFilters && (
          <button
            className="btn btn-outline-primary"
            onClick={clearFilters}
          >
            <i className="bi bi-x-circle me-2"></i>
            Сбросить фильтры
          </button>
        )}
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <div className="fw-semibold mb-2">Жанры</div>
              <div className="d-flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    className={`btn btn-sm ${
                      isGenreSelected(genre.id)
                        ? 'btn-primary'
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => handleGenreToggle(genre.id)}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-5">
              <div className="fw-semibold mb-2">Исполнители</div>
              <div className="d-flex flex-wrap gap-2">
                {artists.map(artist => (
                  <button
                    key={artist.id}
                    className={`btn btn-sm ${
                      isArtistSelected(artist.id)
                        ? 'btn-primary'
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => handleArtistToggle(artist.id)}
                  >
                    {artist.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-primary w-100"
                onClick={applyFilters}
              >
                <i className="bi bi-search me-2"></i>
                Найти
              </button>
            </div>
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};