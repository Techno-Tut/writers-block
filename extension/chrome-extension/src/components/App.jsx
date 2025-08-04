import React, { useState } from 'react';
import FloatingWindow from './FloatingWindow';
import DebugPanel from './DebugPanel';
import CustomStylesTester from './CustomStylesTester';
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
  
  // Phase 1 testing state
  const [showStylesTester, setShowStylesTester] = useState(false);

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

  const handleOpenSettings = () => {
    try {
      // Send message to background script to open settings page
      chrome.runtime.sendMessage(
        { action: 'openSettings' },
        (response) => {
          if (response && response.success) {
            console.log('Settings page opened successfully');
          } else {
            console.error('Failed to open settings page:', response?.error || 'Unknown error');
          }
        }
      );
    } catch (error) {
      console.error('Failed to send settings message:', error);
    }
  };

  return (
    <div className="writers-block-app">
      {/* Phase 1 Testing Component */}
      {showStylesTester && (
        <CustomStylesTester />
      )}
      
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
      
      {/* Phase 1 Testing Toggle */}
      {!showStylesTester && (
        <button 
          className="debug-toggle"
          onClick={() => setShowStylesTester(true)}
          title="Show Custom Styles Tester (Phase 1)"
          style={{ right: '60px' }}
        >
          🧪
        </button>
      )}
      
      {showStylesTester && (
        <button 
          className="debug-toggle"
          onClick={() => setShowStylesTester(false)}
          title="Hide Custom Styles Tester"
          style={{ right: '60px' }}
        >
          ❌
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
          onOpenSettings={handleOpenSettings}
        />
      </div>
    </div>
  );
};

export default App;
