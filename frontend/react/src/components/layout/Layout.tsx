import React from 'react';
import { Navbar } from './Navbar';
import { Notifications } from './Notifications';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <Navbar />
      <Notifications />
      <main className="flex-grow-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};