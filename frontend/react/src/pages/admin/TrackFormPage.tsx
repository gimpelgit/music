import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminTrackService } from '@/api/services/adminTrackService';
import { adminArtistService } from '@/api/services/adminArtistService';
import { adminGenreService } from '@/api/services/adminGenreService';
import { adminAlbumService } from '@/api/services/adminAlbumService';
import { useNotification } from '@/contexts/NotificationContext';
import type { Artist } from '@/types/artist';
import type { Genre } from '@/types/genre';
import type { Album } from '@/types/album';
import type { Track } from '@/types/track';

interface TrackFormData {
  title: string;
  albumId: number | null;
  durationMinutes: number;
  durationSeconds: number;
  lyrics: string;
  releaseDate: string;
  artistIds: number[];
  genreIds: number[];
}

export const TrackFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError, warning } = useNotification();

  const [trackData, setTrackData] = useState<TrackFormData>({
    title: '',
    albumId: null,
    durationMinutes: 0,
    durationSeconds: 0,
    lyrics: '',
    releaseDate: '',
    artistIds: [],
    genreIds: []
  });

  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [existingTrack, setExistingTrack] = useState<Track | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: '',
    duration: '',
    artists: '',
    genres: ''
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [artistsData, genresData, albumsData] = await Promise.all([
          adminArtistService.getAll(),
          adminGenreService.getAll(),
          adminAlbumService.getAll()
        ]);

        setArtists(artistsData);
        setGenres(genresData);
        setAlbums(albumsData);

        if (id) {
          await loadTrack(Number(id));
        }
      } catch (err) {
        showError('Ошибка при загрузке данных');
        navigate('/admin/tracks');
      }
    };

    loadInitialData();
  }, [id]);

  const loadTrack = async (trackId: number) => {
    try {
      const data = await adminTrackService.getById(trackId);
      setExistingTrack(data);
      
      const minutes = Math.floor(data.durationSeconds / 60);
      const seconds = data.durationSeconds % 60;
      
      setTrackData({
        title: data.title,
        albumId: data.albumId || null,
        durationMinutes: minutes,
        durationSeconds: seconds,
        lyrics: data.lyrics || '',
        releaseDate: data.releaseDate || '',
        artistIds: data.artists.map(a => a.id),
        genreIds: data.genres.map(g => g.id)
      });
    } catch (err) {
      showError('Ошибка при загрузке трека');
      navigate('/admin/tracks');
    }
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'title':
        if (!value) return 'Название трека обязательно';
        if (value.length < 2) return 'Минимальная длина 2 символа';
        if (value.length > 200) return 'Максимальная длина 200 символов';
        return '';
      case 'duration': { 
        const total = (trackData.durationMinutes || 0) * 60 + (trackData.durationSeconds || 0);
        if (total <= 0) return 'Длительность трека должна быть больше 0';
        if (total > 3600) return 'Длительность трека не может превышать 60 минут';
        return ''; 
      }
      case 'artists':
        if (trackData.artistIds.length === 0) return 'Выберите хотя бы одного исполнителя';
        return '';
      case 'genres':
        if (trackData.genreIds.length === 0) return 'Выберите хотя бы один жанр';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'albumId') {
      setTrackData(prev => ({ ...prev, [name]: value ? Number(value) : null }));
    } else if (name === 'durationMinutes' || name === 'durationSeconds') {
      setTrackData(prev => ({ ...prev, [name]: Number(value) || 0 }));
      const fieldError = validateField('duration', null);
      setFieldErrors(prev => ({ ...prev, duration: fieldError }));
    } else {
      setTrackData(prev => ({ ...prev, [name]: value }));
      const fieldError = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleArtistToggle = (artistId: number) => {
    setTrackData(prev => {
      const newIds = prev.artistIds.includes(artistId)
        ? prev.artistIds.filter(id => id !== artistId)
        : [...prev.artistIds, artistId];
      
      const fieldError = validateField('artists', null);
      setFieldErrors(prev => ({ ...prev, artists: fieldError }));
      
      return { ...prev, artistIds: newIds };
    });
  };

  const handleGenreToggle = (genreId: number) => {
    setTrackData(prev => {
      const newIds = prev.genreIds.includes(genreId)
        ? prev.genreIds.filter(id => id !== genreId)
        : [...prev.genreIds, genreId];
      
      const fieldError = validateField('genres', null);
      setFieldErrors(prev => ({ ...prev, genres: fieldError }));
      
      return { ...prev, genreIds: newIds };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'];
    if (!validTypes.includes(file.type) && !/\.(mp3|wav|ogg|aac)$/i.test(file.name)) {
      warning('Неверный формат файла. Поддерживаются: MP3, WAV, OGG, AAC');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      warning('Файл слишком большой. Максимальный размер: 50MB');
      return;
    }

    setAudioFile(file);
  };

  const isArtistSelected = (artistId: number) => trackData.artistIds.includes(artistId);
  const isGenreSelected = (genreId: number) => trackData.genreIds.includes(genreId);

  const getTotalDuration = () => {
    return (trackData.durationMinutes || 0) * 60 + (trackData.durationSeconds || 0);
  };

  const getDurationHint = () => {
    const total = getTotalDuration();
    if (total === 0) return '';
    
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const validateForm = (): boolean => {
    const errors = {
      title: validateField('title', trackData.title),
      duration: validateField('duration', null),
      artists: validateField('artists', null),
      genres: validateField('genres', null)
    };
    
    setFieldErrors(errors);
    
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      warning('Проверьте правильность заполнения формы');
      return false;
    }

    if (!isEditing && !audioFile) {
      warning('Выберите аудиофайл');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      const formDataToSend = createFormData();
      await sendRequest(formDataToSend);
      handleSuccess();
    } catch (err: any) {
      handleSubmitError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const createFormData = (): FormData => {
    const formData = new FormData();
    const totalDuration = getTotalDuration();

    appendBasicFields(formData, totalDuration);
    appendConditionalFields(formData);
    appendArtistAndGenreIds(formData);
    appendAudioFile(formData);

    return formData;
  };

  const appendBasicFields = (formData: FormData, totalDuration: number): void => {
    formData.append('title', trackData.title.trim());
    formData.append('durationSeconds', totalDuration.toString());
  };

  const appendConditionalFields = (formData: FormData): void => {
    if (isEditing) {
      appendEditingFields(formData);
    } else {
      appendCreationFields(formData);
    }
  };

  const appendEditingFields = (formData: FormData): void => {
    if (trackData.albumId) {
      formData.append('albumId', trackData.albumId.toString());
    } else {
      formData.append('clearAlbumId', 'true');
    }

    if (trackData.lyrics?.trim()) {
      formData.append('lyrics', trackData.lyrics.trim());
    } else {
      formData.append('clearLyrics', 'true');
    }

    if (trackData.releaseDate) {
      formData.append('releaseDate', trackData.releaseDate);
    } else {
      formData.append('clearReleaseDate', 'true');
    }
  };

  const appendCreationFields = (formData: FormData): void => {
    if (trackData.albumId) {
      formData.append('albumId', trackData.albumId.toString());
    }
    if (trackData.lyrics?.trim()) {
      formData.append('lyrics', trackData.lyrics.trim());
    }
    if (trackData.releaseDate) {
      formData.append('releaseDate', trackData.releaseDate);
    }
  };

  const appendArtistAndGenreIds = (formData: FormData): void => {
    trackData.artistIds.forEach(id => {
      formData.append('artistIds', id.toString());
    });
    
    trackData.genreIds.forEach(id => {
      formData.append('genreIds', id.toString());
    });
  };

  const appendAudioFile = (formData: FormData): void => {
    if (audioFile) {
      formData.append('audioFile', audioFile);
    }
  };

  const sendRequest = async (formData: FormData): Promise<void> => {
    if (isEditing && id) {
      await adminTrackService.update(Number(id), formData);
    } else {
      await adminTrackService.create(formData);
    }
  };

  const handleSuccess = (): void => {
    success(isEditing ? 'Трек успешно обновлен' : 'Трек успешно создан');
    navigate('/admin/tracks');
  };

  const handleSubmitError = (err: any): void => {
    const message = err.response?.data?.message || 
      (isEditing ? 'Ошибка при обновлении трека' : 'Ошибка при создании трека');
    showError(message);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-white py-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/admin/tracks" className="text-decoration-none">
                      Треки
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {isEditing ? 'Редактирование' : 'Создание'}
                  </li>
                </ol>
              </nav>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label fw-semibold">
                        Название трека <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${fieldErrors.title ? 'is-invalid' : ''}`}
                        id="title"
                        name="title"
                        value={trackData.title}
                        onChange={handleChange}
                        placeholder="Введите название трека"
                        disabled={submitting}
                      />
                      {fieldErrors.title && (
                        <div className="invalid-feedback">{fieldErrors.title}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="albumId" className="form-label fw-semibold">Альбом</label>
                      <select 
                        className="form-select" 
                        id="albumId"
                        name="albumId"
                        value={trackData.albumId || ''}
                        onChange={handleChange}
                        disabled={submitting}
                      >
                        <option value="">— Без альбома —</option>
                        {albums.map(album => (
                          <option key={album.id} value={album.id}>{album.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="durationMinutes" className="form-label fw-semibold">
                      Длительность <span className="text-danger">*</span>
                    </label>
                    <div className="row g-2">
                      <div className="col">
                        <input 
                          type="number" 
                          className={`form-control ${fieldErrors.duration ? 'is-invalid' : ''}`}
                          placeholder="Минуты"
                          id="durationMinutes"
                          name="durationMinutes"
                          value={trackData.durationMinutes}
                          onChange={handleChange}
                          min="0"
                          max="60"
                          disabled={submitting}
                        />
                      </div>
                      <div className="col">
                        <input 
                          type="number" 
                          className={`form-control ${fieldErrors.duration ? 'is-invalid' : ''}`}
                          placeholder="Секунды"
                          name="durationSeconds"
                          value={trackData.durationSeconds}
                          onChange={handleChange}
                          min="0"
                          max="59"
                          disabled={submitting}
                        />
                      </div>
                    </div>
                    {fieldErrors.duration && (
                      <div className="text-danger small mt-1">{fieldErrors.duration}</div>
                    )}
                    {getDurationHint() && (
                      <div className="text-muted small mt-1">
                        Итого: {getDurationHint()}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="releaseDate" className="form-label fw-semibold">Дата релиза</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        id="releaseDate"
                        name="releaseDate"
                        value={trackData.releaseDate}
                        onChange={handleChange}
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Исполнители <span className="text-danger">*</span>
                  </label>
                  <div className="card bg-light">
                    <div className="card-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <div className="d-flex flex-wrap gap-2">
                        {artists.map(artist => (
                          <button 
                            key={artist.id}
                            type="button"
                            className={`btn btn-sm ${
                              isArtistSelected(artist.id)
                                ? 'btn-primary'
                                : 'btn-outline-secondary'
                            }`}
                            onClick={() => handleArtistToggle(artist.id)}
                            disabled={submitting}
                          >
                            {artist.name}
                          </button>
                        ))}
                        {artists.length === 0 && (
                          <span className="text-muted">Нет доступных исполнителей</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {fieldErrors.artists && (
                    <div className="text-danger small mt-1">{fieldErrors.artists}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Жанры <span className="text-danger">*</span>
                  </label>
                  <div className="card bg-light">
                    <div className="card-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <div className="d-flex flex-wrap gap-2">
                        {genres.map(genre => (
                          <button 
                            key={genre.id}
                            type="button"
                            className={`btn btn-sm ${
                              isGenreSelected(genre.id)
                                ? 'btn-primary'
                                : 'btn-outline-secondary'
                            }`}
                            onClick={() => handleGenreToggle(genre.id)}
                            disabled={submitting}
                          >
                            {genre.name}
                          </button>
                        ))}
                        {genres.length === 0 && (
                          <span className="text-muted">Нет доступных жанров</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {fieldErrors.genres && (
                    <div className="text-danger small mt-1">{fieldErrors.genres}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="audioFile" className="form-label fw-semibold">
                    Аудиофайл
                    {!isEditing && <span className="text-danger">*</span>}
                  </label>
                  
                  {isEditing && !audioFile && existingTrack && (
                    <div className="alert alert-info py-2 mb-2">
                      <small>
                        <i className="bi bi-info-circle me-1"></i>
                        Текущий файл: {existingTrack.fileUrl?.split('/')?.pop() || 'загружен'}
                      </small>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    className="form-control" 
                    id="audioFile"
                    accept=".mp3,.wav,.ogg,.aac,audio/mpeg,audio/wav,audio/ogg,audio/aac"
                    onChange={handleFileChange}
                    disabled={submitting}
                  />
                  
                  <div className="form-text text-muted small">
                    Поддерживаемые форматы: MP3, WAV, OGG, AAC. Максимальный размер: 50MB
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="lyrics" className="form-label fw-semibold">Текст песни</label>
                  <textarea 
                    className="form-control" 
                    id="lyrics"
                    name="lyrics"
                    value={trackData.lyrics}
                    onChange={handleChange}
                    rows={5}
                    maxLength={5000}
                    placeholder="Введите текст песни (необязательно)"
                    disabled={submitting}
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  />
                  <div className="form-text text-muted small">
                    Максимальная длина: 5000 символов
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Сохранить
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin/tracks')}
                    disabled={submitting}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};