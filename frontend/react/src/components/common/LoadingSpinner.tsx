import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>
  );
};