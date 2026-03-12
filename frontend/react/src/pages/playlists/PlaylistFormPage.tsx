import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { playlistService } from '@/api/services/playlistService';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { getPlaylistCoverUrl } from '@/types/playlist';

export const PlaylistFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError, warning } = useNotification();
  const { user } = useAuth();

  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      loadPlaylist(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (coverImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(coverImageFile);
    } else {
      setCoverImagePreview(null);
    }
  }, [coverImageFile]);

  const loadPlaylist = async (playlistId: number) => {
    try {
      const data = await playlistService.getById(playlistId);
      
      if (user && data.userId !== user.id) {
        showError('У вас нет прав для редактирования этого плейлиста');
        navigate('/playlists');
        return;
      }

      setPlaylistName(data.name);
      setIsPublic(data.isPublic);
      
      if (data.coverImageUrl) {
        setExistingCoverUrl(getPlaylistCoverUrl(data));
      }
    } catch (err) {
      showError('Ошибка при загрузке плейлиста');
      navigate('/playlists');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      warning('Неверный формат файла. Поддерживаются: JPG, PNG, GIF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      warning('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }

    setCoverImageFile(file);
    setExistingCoverUrl(null);
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setExistingCoverUrl(null);
  };

  const validateForm = (): boolean => {
    if (!playlistName.trim()) {
      warning('Введите название плейлиста');
      return false;
    }
    if (playlistName.length < 2) {
      warning('Название должно содержать минимум 2 символа');
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
      const formData = new FormData();
      formData.append('name', playlistName.trim());
      formData.append('isPublic', String(isPublic));

      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      }

      if (isEditing && id) {
        await playlistService.update(Number(id), formData);
        success('Плейлист обновлен');
      } else {
        await playlistService.create(formData);
        success('Плейлист создан');
      }

      navigate('/playlists');
    } catch (err: any) {
      const message = err.response?.data?.message || 
        (isEditing ? 'Ошибка при обновлении плейлиста' : 'Ошибка при создании плейлиста');
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white py-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/playlists" className="text-decoration-none">
                      Плейлисты
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
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Название плейлиста <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    placeholder="Введите название плейлиста"
                    required
                    minLength={2}
                    disabled={submitting}
                  />
                </div>

                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      disabled={submitting}
                    />
                    <label className="form-check-label" htmlFor="isPublic">
                      Публичный плейлист
                    </label>
                  </div>
                  <div className="form-text text-muted small">
                    Публичные плейлисты видны всем пользователям
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="coverImage" className="form-label fw-semibold">Обложка плейлиста</label>
                  
                  {(existingCoverUrl || coverImagePreview) && (
                    <div className="mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={coverImagePreview || existingCoverUrl || ''} 
                          alt="Обложка"
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        {coverImageFile && (
                          <div>
                            <span className="text-muted small d-block">{coverImageFile.name}</span>
                            <span className="text-muted small">{(coverImageFile.size / 1024).toFixed(2)} KB</span>
                          </div>
                        )}
                        {!coverImageFile && existingCoverUrl && (
                          <span className="text-muted small">Текущая обложка</span>
                        )}
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-danger"
                          onClick={removeCoverImage}
                          disabled={submitting}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    className="form-control" 
                    id="coverImage"
                    accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    disabled={submitting}
                  />
                  
                  <div className="form-text text-muted small">
                    Поддерживаемые форматы: JPG, PNG, GIF. Максимальный размер: 5MB
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
                    onClick={() => navigate('/playlists')}
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