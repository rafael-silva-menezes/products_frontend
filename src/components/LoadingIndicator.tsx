import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="loading-indicator">
      <p>Carregando...</p>
      {/* Pode ser substituído por um spinner mais elaborado */}
    </div>
  );
};

export default LoadingIndicator;