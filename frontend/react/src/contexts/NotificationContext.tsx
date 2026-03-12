import React, { createContext, useState, useCallback } from 'react';
import type { Notification, NotificationType } from '@/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  success: (message: string, timeout?: number) => void;
  error: (message: string, timeout?: number) => void;
  warning: (message: string, timeout?: number) => void;
  info: (message: string, timeout?: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextId, setNextId] = useState(0);

  const show = useCallback((type: NotificationType, message: string, timeout: number = 5000) => {
    const id = nextId;
    setNextId(prev => prev + 1);
    
    const notification: Notification = { type, message, id };
    setNotifications(prev => [...prev, notification]);

    if (timeout > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, timeout);
    }
  }, [nextId]);

  const success = useCallback((message: string, timeout?: number) => {
    show('success', message, timeout);
  }, [show]);

  const error = useCallback((message: string, timeout?: number) => {
    show('error', message, timeout);
  }, [show]);

  const warning = useCallback((message: string, timeout?: number) => {
    show('warning', message, timeout);
  }, [show]);

  const info = useCallback((message: string, timeout?: number) => {
    show('info', message, timeout);
  }, [show]);

  const remove = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      success,
      error,
      warning,
      info,
      remove,
      clear,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};