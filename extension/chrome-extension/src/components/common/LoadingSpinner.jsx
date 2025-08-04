/**
 * Reusable LoadingSpinner component
 */

import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = '', 
  className = '',
  inline = false 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium', 
    large: 'spinner-large'
  };

  const containerClass = inline ? 'loading-inline' : 'loading-block';

  return (
    <div className={`loading-container ${containerClass} ${className}`.trim()}>
      <div className={`loading-spinner ${sizeClasses[size]}`} />
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
