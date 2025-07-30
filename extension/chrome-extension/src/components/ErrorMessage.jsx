import React from 'react';

const ErrorMessage = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="result-display">
      <div className="result-header">
        <span className="result-title">⚠️ Error</span>
        <button 
          className="result-close"
          onClick={onClose}
          title="Close Error"
        >
          ×
        </button>
      </div>
      
      <div className="result-content">
        <div className="result-message error">
          {error}
        </div>
        <div className="error-help">
          <p>💡 <strong>Troubleshooting:</strong></p>
          <ul>
            <li>Make sure the backend is running: <code>uv run dev</code></li>
            <li>Check if the API is accessible at <code>localhost:8000</code></li>
            <li>Verify your internet connection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
