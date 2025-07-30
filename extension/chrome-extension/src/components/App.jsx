import React, { useState } from 'react';
import FloatingWindow from './FloatingWindow';
import DebugPanel from './DebugPanel';
import { useTextSelection, useFloatingWindow, useDebugPanel, useAPI } from '../hooks';
import { replaceSelectedText, canReplaceText } from '../utils/textReplacement';
import '../styles/app.css';

const App = () => {
  // Custom hooks for clean state management
  const { selectedText, selectionCount, hasSelection, clearSelection, restoreSelection } = useTextSelection();
  const { isVisible: isFloatingWindowVisible, position: windowPosition, windowRef, closeWindow } = useFloatingWindow(hasSelection);
  const { isVisible: isDebugVisible, showDebug, hideDebug } = useDebugPanel();
  const { processText, loading, error, clearError } = useAPI();
  
  // Local state for API results and success messages
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCloseFloatingWindow = () => {
    closeWindow();
    clearSelection();
    setResult(null);
    setSuccessMessage('');
    clearError();
  };

  const handleResult = async (selectedText, action, parameters) => {
    try {
      clearError();
      setResult(null);
      setSuccessMessage('');
      
      const apiResult = await processText(selectedText, action, parameters, sessionId);
      
      setResult(apiResult);
      setSessionId(apiResult.session_id);
      
      console.log('API Result:', apiResult);
    } catch (error) {
      console.error('Failed to process text:', error);
      // Error is handled by useAPI hook
    }
  };

  const handleApplyText = async (processedText) => {
    try {
      console.log('Attempting to apply text:', processedText);
      
      // First, try to restore the original selection
      const selectionRestored = restoreSelection();
      
      if (!selectionRestored) {
        console.warn('Could not restore selection, checking current selection...');
      }
      
      // Check if text replacement is possible
      const { canReplace, reason } = canReplaceText();
      
      if (!canReplace) {
        console.error('Cannot replace text:', reason);
        clearError();
        setTimeout(() => {
          setResult({
            ...result,
            error: `Cannot apply changes: ${reason}`
          });
        }, 100);
        return;
      }

      // Perform text replacement
      replaceSelectedText(processedText);
      
      // Show success message
      setSuccessMessage('✅ Text updated successfully!');
      setResult(null);
      
      console.log('Text replacement successful');
      
    } catch (error) {
      console.error('Text replacement failed:', error);
      clearError();
      setTimeout(() => {
        setResult({
          ...result,
          error: `Failed to apply changes: ${error.message}`
        });
      }, 100);
    }
  };

  const handleClearResult = () => {
    setResult(null);
  };

  const handleClearSuccess = () => {
    setSuccessMessage('');
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
          successMessage={successMessage}
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
          onApplyText={handleApplyText}
          successMessage={successMessage}
          onClearSuccess={handleClearSuccess}
        />
      </div>
    </div>
  );
};

export default App;
