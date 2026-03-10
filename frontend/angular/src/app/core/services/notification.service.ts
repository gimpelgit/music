import { Injectable, signal } from '@angular/core';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private nextId = 0;

  readonly notifications$ = this.notifications.asReadonly();

  success(message: string, timeout = 5000): void {
    this.show('success', message, timeout);
  }

  error(message: string, timeout = 5000): void {
    this.show('error', message, timeout);
  }

  warning(message: string, timeout = 5000): void {
    this.show('warning', message, timeout);
  }

  info(message: string, timeout = 5000): void {
    this.show('info', message, timeout);
  }

  private show(type: Notification['type'], message: string, timeout: number): void {
    const id = this.nextId++;
    const notification: Notification = { type, message, id };
    
    this.notifications.update(list => [...list, notification]);

    if (timeout > 0) {
      setTimeout(() => this.remove(id), timeout);
    }
  }

  remove(id: number): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  clear(): void {
    this.notifications.set([]);
  }
}