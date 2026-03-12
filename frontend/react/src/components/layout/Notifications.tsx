import React from 'react';
import { useNotification } from '@/contexts/NotificationContext';

export const Notifications: React.FC = () => {
  const { notifications, remove } = useNotification();

  const getHeaderClass = (type: string) => {
    const baseClass = 'toast-header';
    switch (type) {
      case 'success':
        return `${baseClass} bg-success text-white`;
      case 'error':
        return `${baseClass} bg-danger text-white`;
      case 'warning':
        return `${baseClass} bg-warning`;
      case 'info':
        return `${baseClass} bg-info text-white`;
      default:
        return baseClass;
    }
  };

  const getCloseButtonClass = (type: string) => {
    return type === 'warning' ? '' : 'btn-close-white';
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'success':
        return 'Успех';
      case 'error':
        return 'Ошибка';
      case 'warning':
        return 'Предупреждение';
      case 'info':
        return 'Информация';
      default:
        return '';
    }
  };

  return (
    <div className="notification-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
      {notifications.map(notification => (
        <div key={notification.id} className="toast show mb-2" role="alert">
          <div className={getHeaderClass(notification.type)}>
            <strong className="me-auto">{getTitle(notification.type)}</strong>
            <button
              type="button"
              className={`btn-close ${getCloseButtonClass(notification.type)}`}
              onClick={() => remove(notification.id)}
            />
          </div>
          <div className="toast-body">
            {notification.message}
          </div>
        </div>
      ))}
    </div>
  );
};