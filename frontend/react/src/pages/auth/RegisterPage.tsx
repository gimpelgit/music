import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    username: '',
    password: '',
  });

  const { register, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/albums');
    }
  }, [isAuthenticated, navigate]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (!value) return 'Имя обязательно';
        if (value.length < 2) return 'Минимальная длина 2 символа';
        return '';
      case 'username':
        if (!value) return 'Логин обязателен';
        if (value.length < 3) return 'Минимальная длина 3 символа';
        return '';
      case 'password':
        if (!value) return 'Пароль обязателен';
        if (value.length < 6) return 'Минимальная длина 6 символов';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const fieldError = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
    
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = {
      name: validateField('name', formData.name),
      username: validateField('username', formData.username),
      password: validateField('password', formData.password),
    };
    
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      return;
    }

    try {
      await register(formData);
    } catch {}
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Регистрация</h2>
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={clearError} />
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Имя
                  </label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.name && (
                    <div className="invalid-feedback">
                      {fieldErrors.name}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Логин
                  </label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                  />
                  {fieldErrors.username && (
                    <div className="invalid-feedback">
                      {fieldErrors.username}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Пароль
                  </label>
                  <input
                    type="password"
                    className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                  {fieldErrors.password && (
                    <div className="invalid-feedback">
                      {fieldErrors.password}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Регистрация...
                    </>
                  ) : (
                    'Зарегистрироваться'
                  )}
                </button>

                <div className="text-center">
                  <p className="mb-0">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Войти
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};