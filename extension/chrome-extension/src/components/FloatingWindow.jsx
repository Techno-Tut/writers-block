import React from 'react';
import ActionButtons from './ActionButtons';
import ResultDisplay from './ResultDisplay';
import ErrorMessage from './ErrorMessage';
import '../styles/floating-window.css';

const FloatingWindow = ({ 
  isVisible, 
  position, 
  selectedText, 
  onClose,
  onResult,
  result,
  loading,
  error,
  onClearError,
  onClearResult
}) => {
  if (!isVisible || !selectedText) {
    return null;
  }

  const windowStyle = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 10001
  };

  return (
    <div 
      className="floating-window" 
      style={windowStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="floating-window-header">
        <span className="floating-window-title">✨ Writers Block</span>
        <button 
          className="floating-window-close"
          onClick={onClose}
          title="Close"
        >
          ×
        </button>
      </div>
      
      <div className="floating-window-content">
        <div className="selected-text-preview">
          <strong>Selected:</strong> "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"
        </div>
        
        <ActionButtons
          selectedText={selectedText}
          onResult={onResult}
          loading={loading}
          onError={onClearError}
        />
        
        {error && (
          <ErrorMessage 
            error={error} 
            onClose={onClearError}
          />
        )}
        
        {result && !error && (
          <ResultDisplay
            original={selectedText}
            processed={result.processed_text}
            message={result.message}
            onClose={onClearResult}
          />
        )}
      </div>
    </div>
  );
};

export default FloatingWindow;
