import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminUserService } from '@/api/services/adminUserService';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

interface UserFormData {
  username: string;
  name: string;
  password: string;
  role: string;
}

export const UserFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError, warning } = useNotification();
  const { user: currentUser, logout } = useAuth();

  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    name: '',
    password: '',
    role: 'ROLE_USER'
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    name: '',
    password: ''
  });

  const isEditing = Boolean(id);
  const isEditingCurrentUser = isEditing && Number(id) === currentUser?.id;

  const roleOptions = [
    { value: 'ROLE_USER', label: 'Пользователь' },
    { value: 'ROLE_ADMIN', label: 'Администратор' }
  ];

  useEffect(() => {
    if (id) {
      loadUser(Number(id));
    }
  }, [id]);

  const loadUser = async (userId: number) => {
    setLoading(true);
    try {
      const data = await adminUserService.getById(userId);
      setFormData({
        username: data.username,
        name: data.name,
        password: '',
        role: data.role
      });
    } catch (err) {
      showError('Ошибка при загрузке пользователя');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (!value) return 'Имя обязательно';
        if (value.length < 2) return 'Минимальная длина 2 символа';
        if (value.length > 100) return 'Максимальная длина 100 символов';
        return '';
      case 'username':
        if (!value) return 'Логин обязателен';
        if (value.length < 3) return 'Минимальная длина 3 символа';
        if (value.length > 50) return 'Максимальная длина 50 символов';
        return '';
      case 'password':
        if (!isEditing && !value) return 'Пароль обязателен';
        if (value && value.length < 6) return 'Минимальная длина 6 символов';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const fieldError = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = (): boolean => {
    const errors = {
      username: validateField('username', formData.username),
      name: validateField('name', formData.name),
      password: validateField('password', formData.password)
    };
    
    setFieldErrors(errors);
    
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      warning('Проверьте правильность заполнения формы');
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
      if (isEditing && id) {
        const updateData: any = {
          username: formData.username,
          name: formData.name,
          role: formData.role
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await adminUserService.update(Number(id), updateData);
        
        success('Пользователь успешно обновлен');
        
        if (isEditingCurrentUser) {
          warning('Ваши данные изменены. Пожалуйста, войдите снова.');
          await logout();   // Токен станет невалидным и выбросится исключение 401
          navigate('/login');
        } else {
          navigate('/admin/users');
        }
      } else {
        await adminUserService.create({
          username: formData.username,
          name: formData.name,
          password: formData.password,
          role: formData.role
        });
        success('Пользователь успешно создан');
        navigate('/admin/users');
      }
    } catch (err: any) {
      if (err.response?.status != 401) {
        const message = err.response?.data?.message || 
          (isEditing ? 'Ошибка при обновлении пользователя' : 'Ошибка при создании пользователя');
        showError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-white py-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/admin/users" className="text-decoration-none">
                      Пользователи
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {isEditing ? 'Редактирование' : 'Создание'}
                  </li>
                </ol>
              </nav>
              {isEditingCurrentUser && (
                <div className="alert alert-warning mt-2 mb-0 py-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <small>Вы редактируете свои данные. После сохранения вам потребуется войти снова.</small>
                </div>
              )}
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Имя <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Введите имя пользователя"
                    disabled={submitting}
                  />
                  {fieldErrors.name && (
                    <div className="invalid-feedback">{fieldErrors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-semibold">
                    Логин <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Введите логин"
                    disabled={submitting}
                  />
                  {fieldErrors.username && (
                    <div className="invalid-feedback">{fieldErrors.username}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Пароль
                    {!isEditing && <span className="text-danger">*</span>}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isEditing ? "Оставьте пустым, чтобы не менять" : "Введите пароль"}
                    disabled={submitting}
                  />
                  {fieldErrors.password && (
                    <div className="invalid-feedback">{fieldErrors.password}</div>
                  )}
                  {isEditing && (
                    <div className="form-text text-muted small">
                      Оставьте поле пустым, чтобы сохранить текущий пароль
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label fw-semibold">
                    Роль <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {isEditingCurrentUser && (
                    <div className="form-text text-warning small">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      Изменение роли приведет к немедленному выходу из системы
                    </div>
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
                    onClick={() => navigate('/admin/users')}
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