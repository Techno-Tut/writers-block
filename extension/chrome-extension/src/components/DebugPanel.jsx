import React from 'react';

const DebugPanel = ({ 
  selectedText, 
  selectionCount, 
  isFloatingWindowVisible, 
  windowPosition, 
  onClose 
}) => {
  return (
    <div className="debug-info">
      <div className="debug-header">
        <h3>🤖 Writers Block Extension (Debug)</h3>
        <button 
          className="debug-close"
          onClick={onClose}
          title="Hide Debug Panel"
        >
          ×
        </button>
      </div>
      <p><strong>Status:</strong> React App Running</p>
      <p><strong>Selections Made:</strong> {selectionCount}</p>
      <p><strong>Floating Window:</strong> {isFloatingWindowVisible ? 'Visible' : 'Hidden'}</p>
      <p><strong>Position:</strong> x:{windowPosition.x}, y:{windowPosition.y}</p>
      <p><strong>Current Selection:</strong></p>
      <div className="selected-text">
        {selectedText || 'No text selected'}
      </div>
    </div>
  );
};

export default DebugPanel;
