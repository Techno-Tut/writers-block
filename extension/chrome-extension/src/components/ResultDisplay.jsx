import React from 'react';
import '../styles/result-display.css';

const ResultDisplay = ({ original, processed, message, onClose }) => {
  const hasChanges = original !== processed;

  return (
    <div className="result-display">
      <div className="result-header">
        <span className="result-title">✨ Result</span>
        <button 
          className="result-close"
          onClick={onClose}
          title="Close Result"
        >
          ×
        </button>
      </div>
      
      <div className="result-content">
        {hasChanges ? (
          <>
            <div className="text-comparison">
              <div className="original-text">
                <strong>Original:</strong>
                <div className="text-content">{original}</div>
              </div>
              
              <div className="processed-text">
                <strong>Processed:</strong>
                <div className="text-content">{processed}</div>
              </div>
            </div>
            
            <div className="result-message success">
              {message}
            </div>
            
            <div className="result-actions">
              <p className="action-hint">
                🚧 Text replacement coming in Iteration 4!
              </p>
            </div>
          </>
        ) : (
          <div className="no-changes">
            <div className="text-content">{processed}</div>
            <div className="result-message info">
              No changes needed - your text looks good! ✅
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
