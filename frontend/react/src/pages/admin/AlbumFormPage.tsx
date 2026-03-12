import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminAlbumService } from '@/api/adminAlbumService';
import { useNotification } from '@/contexts/NotificationContext';
import { getAlbumCoverUrl } from '@/types/album';
import type { Album } from '@/types/album';

export const AlbumFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError, warning } = useNotification();

  const [album, setAlbum] = useState<Partial<Album>>({ title: '' });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      loadAlbum(Number(id));
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

  const loadAlbum = async (albumId: number) => {
    try {
      const data = await adminAlbumService.getById(albumId);
      setAlbum(data);
      if (data.coverImageUrl) {
        setExistingCoverUrl(getAlbumCoverUrl(data));
      }
    } catch (err) {
      showError('Ошибка при загрузке альбома');
      navigate('/admin/albums');
    }
  };

  const validateForm = (): boolean => {
    if (!album.title?.trim()) {
      setFieldError('Название альбома обязательно');
      return false;
    }
    if (album.title.length < 2) {
      setFieldError('Минимальная длина 2 символа');
      return false;
    }
    if (album.title.length > 200) {
      setFieldError('Максимальная длина 200 символов');
      return false;
    }
    setFieldError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAlbum(prev => ({ ...prev, title: value }));
    if (fieldError) setFieldError('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      warning('Проверьте правильность заполнения формы');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', album.title!.trim());

      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      }

      if (isEditing && id) {
        await adminAlbumService.update(Number(id), formData);
        success('Альбом успешно обновлен');
      } else {
        await adminAlbumService.create(formData);
        success('Альбом успешно создан');
      }
      navigate('/admin/albums');
    } catch (err: any) {
      const message = err.response?.data?.message || 
        (isEditing ? 'Ошибка при обновлении альбома' : 'Ошибка при создании альбома');
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-white py-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/admin/albums" className="text-decoration-none">
                      Альбомы
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
                  <label htmlFor="title" className="form-label fw-semibold">
                    Название альбома <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={album.title}
                    onChange={handleChange}
                    placeholder="Введите название альбома"
                    disabled={submitting}
                  />
                  {fieldError && (
                    <div className="invalid-feedback">{fieldError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="coverImage" className="form-label fw-semibold">Обложка альбома</label>
                  
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
                    onClick={() => navigate('/admin/albums')}
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