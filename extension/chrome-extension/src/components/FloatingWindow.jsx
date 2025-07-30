import React from 'react';
import '../styles/floating-window.css';

const FloatingWindow = ({ 
  isVisible, 
  position, 
  selectedText, 
  onClose 
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
        
        <div className="action-placeholder">
          <p>🚧 Action buttons coming in Iteration 3!</p>
          <p>For now, this window appears near your text selection.</p>
        </div>
      </div>
    </div>
  );
};

export default FloatingWindow;
