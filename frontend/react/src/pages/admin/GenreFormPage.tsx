import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminGenreService } from '@/api/adminGenreService';
import { useNotification } from '@/contexts/NotificationContext';
import type { Genre } from '@/types/genre';

export const GenreFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError, warning } = useNotification();

  const [genre, setGenre] = useState<Partial<Genre>>({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      loadGenre(Number(id));
    }
  }, [id]);

  const loadGenre = async (genreId: number) => {
    try {
      const data = await adminGenreService.getById(genreId);
      setGenre(data);
    } catch (err) {
      showError('Ошибка при загрузке жанра');
      navigate('/admin/genres');
    }
  };

  const validateForm = (): boolean => {
    if (!genre.name?.trim()) {
      setFieldError('Название жанра обязательно');
      return false;
    }
    if (genre.name.length < 2) {
      setFieldError('Минимальная длина 2 символа');
      return false;
    }
    if (genre.name.length > 50) {
      setFieldError('Максимальная длина 50 символов');
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
        await adminGenreService.update(Number(id), { name: genre.name });
        success('Жанр успешно обновлен');
      } else {
        await adminGenreService.create({ name: genre.name });
        success('Жанр успешно создан');
      }
      navigate('/admin/genres');
    } catch (err: any) {
      const message = err.response?.data?.message || 
        (isEditing ? 'Ошибка при обновлении жанра' : 'Ошибка при создании жанра');
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setGenre(prev => ({ ...prev, name: value }));
    if (fieldError) setFieldError('');
  };

  // Убрал LoadingSpinner - теперь просто показываем форму сразу
  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-white py-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/admin/genres" className="text-decoration-none">
                      Жанры
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
                    Название жанра <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={genre.name}
                    onChange={handleChange}
                    placeholder="Введите название жанра"
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
                    onClick={() => navigate('/admin/genres')}
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