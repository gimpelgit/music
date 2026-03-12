import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminArtistService } from '@/api/adminArtistService';
import { useNotification } from '@/contexts/NotificationContext';
import type { Artist } from '@/types/artist';

export const ArtistFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError, warning } = useNotification();

  const [artist, setArtist] = useState<Partial<Artist>>({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      loadArtist(Number(id));
    }
  }, [id]);

  const loadArtist = async (artistId: number) => {
    try {
      const data = await adminArtistService.getById(artistId);
      setArtist(data);
    } catch (err) {
      showError('Ошибка при загрузке исполнителя');
      navigate('/admin/artists');
    }
  };

  const validateForm = (): boolean => {
    if (!artist.name?.trim()) {
      setFieldError('Имя исполнителя обязательно');
      return false;
    }
    if (artist.name.length < 2) {
      setFieldError('Минимальная длина 2 символа');
      return false;
    }
    if (artist.name.length > 100) {
      setFieldError('Максимальная длина 100 символов');
      return false;
    }
    setFieldError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      warning('Проверьте правильность заполнения формы');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && id) {
        await adminArtistService.update(Number(id), { name: artist.name });
        success('Исполнитель успешно обновлен');
      } else {
        await adminArtistService.create({ name: artist.name });
        success('Исполнитель успешно создан');
      }
      navigate('/admin/artists');
    } catch (err: any) {
      const message = err.response?.data?.message || 
        (isEditing ? 'Ошибка при обновлении исполнителя' : 'Ошибка при создании исполнителя');
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setArtist(prev => ({ ...prev, name: value }));
    if (fieldError) setFieldError('');
  };

  // Убрал LoadingSpinner
  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-white py-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/admin/artists" className="text-decoration-none">
                      Исполнители
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
                    Имя исполнителя <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={artist.name}
                    onChange={handleChange}
                    placeholder="Введите имя исполнителя"
                    disabled={submitting}
                  />
                  {fieldError && (
                    <div className="invalid-feedback">{fieldError}</div>
                  )}
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
                    onClick={() => navigate('/admin/artists')}
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