import React from 'react';

interface EmptyStateProps {
  icon: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icon}`} style={{ fontSize: '3rem', color: '#ccc' }}></i>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
};