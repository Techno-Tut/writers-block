import React, { useEffect } from 'react';

const SuccessMessage = ({ message, onClose, autoCloseDelay = 3000 }) => {
  useEffect(() => {
    if (autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [onClose, autoCloseDelay]);

  return (
    <div className="result-display">
      <div className="result-header">
        <span className="result-title">✅ Success</span>
        <button 
          className="result-close"
          onClick={onClose}
          title="Close"
        >
          ×
        </button>
      </div>
      
      <div className="result-content">
        <div className="result-message success">
          {message}
        </div>
        <div className="success-actions">
          <p className="success-hint">
            💡 You can undo this change with Ctrl+Z (Cmd+Z on Mac)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
