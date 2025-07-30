import React from 'react';
import FloatingWindow from './FloatingWindow';
import DebugPanel from './DebugPanel';
import { useTextSelection } from '../hooks/useTextSelection';
import { useFloatingWindow } from '../hooks/useFloatingWindow';
import { useDebugPanel } from '../hooks/useDebugPanel';
import '../styles/app.css';

const App = () => {
  // Custom hooks for clean state management
  const { selectedText, selectionCount, hasSelection, clearSelection } = useTextSelection();
  const { isVisible: isFloatingWindowVisible, position: windowPosition, windowRef, closeWindow } = useFloatingWindow(hasSelection);
  const { isVisible: isDebugVisible, showDebug, hideDebug } = useDebugPanel();

  const handleCloseFloatingWindow = () => {
    closeWindow();
    clearSelection();
  };

  return (
    <div className="writers-block-app">
      {/* Debug Panel - Toggle visibility */}
      {isDebugVisible && (
        <DebugPanel
          selectedText={selectedText}
          selectionCount={selectionCount}
          isFloatingWindowVisible={isFloatingWindowVisible}
          windowPosition={windowPosition}
          onClose={hideDebug}
        />
      )}
      
      {/* Debug Toggle Button */}
      {!isDebugVisible && (
        <button 
          className="debug-toggle"
          onClick={showDebug}
          title="Show Debug Panel"
        >
          🐛
        </button>
      )}
      
      {/* Floating Window */}
      <div ref={windowRef}>
        <FloatingWindow
          isVisible={isFloatingWindowVisible}
          position={windowPosition}
          selectedText={selectedText}
          onClose={handleCloseFloatingWindow}
        />
      </div>
    </div>
  );
};

export default App;
