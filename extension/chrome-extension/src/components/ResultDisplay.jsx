import React from 'react';
import '../styles/result-display.css';

const ResultDisplay = ({ original, processed, message, onClose, onApply, onCancel }) => {
  const hasChanges = original !== processed;

  const handleApply = () => {
    onApply(processed);
  };

  const handleCancel = () => {
    onCancel();
  };

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
              <button 
                onClick={handleApply}
                className="btn btn-apply"
                title="Replace selected text with processed version"
              >
                ✅ Apply Changes
              </button>
              <button 
                onClick={handleCancel}
                className="btn btn-cancel"
                title="Keep original text unchanged"
              >
                ❌ Keep Original
              </button>
            </div>
          </>
        ) : (
          <div className="no-changes">
            <div className="text-content">{processed}</div>
            <div className="result-message info">
              No changes needed - your text looks good! ✅
            </div>
            <div className="result-actions">
              <button 
                onClick={handleCancel}
                className="btn btn-cancel"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
