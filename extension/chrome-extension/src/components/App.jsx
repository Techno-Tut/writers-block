import React, { useState } from 'react';
import FloatingWindow from './FloatingWindow';
import DebugPanel from './DebugPanel';
import { useTextSelection, useFloatingWindow, useDebugPanel, useAPI } from '../hooks';
import '../styles/app.css';

const App = () => {
  // Custom hooks for clean state management
  const { selectedText, selectionCount, hasSelection, clearSelection } = useTextSelection();
  const { isVisible: isFloatingWindowVisible, position: windowPosition, windowRef, closeWindow } = useFloatingWindow(hasSelection);
  const { isVisible: isDebugVisible, showDebug, hideDebug } = useDebugPanel();
  const { processText, loading, error, clearError } = useAPI();
  
  // Local state for API results
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const handleCloseFloatingWindow = () => {
    closeWindow();
    clearSelection();
    setResult(null);
    clearError();
  };

  const handleResult = async (selectedText, action, parameters) => {
    try {
      clearError();
      setResult(null);
      
      const apiResult = await processText(selectedText, action, parameters, sessionId);
      
      setResult(apiResult);
      setSessionId(apiResult.session_id);
      
      console.log('API Result:', apiResult);
    } catch (error) {
      console.error('Failed to process text:', error);
      // Error is handled by useAPI hook
    }
  };

  const handleClearResult = () => {
    setResult(null);
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
          sessionId={sessionId}
          result={result}
          loading={loading}
          error={error}
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
          onResult={handleResult}
          result={result}
          loading={loading}
          error={error}
          onClearError={clearError}
          onClearResult={handleClearResult}
        />
      </div>
    </div>
  );
};

export default App;
