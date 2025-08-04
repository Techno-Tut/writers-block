import React from 'react';
import ActionButtons from './ActionButtons';
import ResultDisplay from './ResultDisplay';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
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
  onClearResult,
  onApplyText,
  successMessage,
  onClearSuccess,
  onOpenSettings
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

  const handleApply = (processedText) => {
    onApplyText(processedText);
  };

  const handleCancel = () => {
    onClearResult();
  };

  return (
    <div 
      className="floating-window" 
      style={windowStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="floating-window-header">
        <span className="floating-window-title">✨ Writers Block</span>
        <div className="floating-window-controls">
          <button 
            className="settings-button"
            onClick={(e) => {
              console.log('Settings button clicked!');
              e.preventDefault();
              e.stopPropagation();
              onOpenSettings();
            }}
            title="Settings - Manage custom rewrite styles"
          >
            ⚙️
          </button>
          <button 
            className="floating-window-close"
            onClick={onClose}
            title="Close window"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="floating-window-content">
        <div className="selected-text-preview">
          <strong>Selected:</strong> "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"
        </div>
        
        {/* Show success message if text was applied */}
        {successMessage && (
          <SuccessMessage 
            message={successMessage}
            onClose={onClearSuccess}
            autoCloseDelay={3000}
          />
        )}
        
        {/* Show error message if API failed */}
        {error && !successMessage && (
          <ErrorMessage 
            error={error} 
            onClose={onClearError}
          />
        )}
        
        {/* Show result with apply/cancel buttons */}
        {result && !error && !successMessage && (
          <ResultDisplay
            original={selectedText}
            processed={result.processed_text}
            message={result.message}
            onClose={onClearResult}
            onApply={handleApply}
            onCancel={handleCancel}
          />
        )}
        
        {/* Show action buttons if no result/error/success */}
        {!result && !error && !successMessage && (
          <ActionButtons
            selectedText={selectedText}
            onResult={onResult}
            loading={loading}
            onError={onClearError}
          />
        )}
      </div>
    </div>
  );
};

export default FloatingWindow;
