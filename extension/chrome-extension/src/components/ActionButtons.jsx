/**
 * Refactored ActionButtons Component
 * Clean, maintainable version with separated concerns
 */

import React from 'react';
import { useStyleSelection } from '../hooks/useStyleSelection';
import { API_CONFIG, ERROR_MESSAGES } from '../config';
import { logError, AppError, ERROR_TYPES } from '../utils/errorHandling';
import LoadingSpinner from './common/LoadingSpinner';
import StylePreview from './common/StylePreview';
import '../styles/action-buttons.css';

const ActionButtons = ({ selectedText, onResult, loading, onError }) => {
  const {
    showToneSelector,
    selectedTone,
    selectedOption,
    selectedCustomStyle,
    allToneOptions,
    stylesLoading,
    stylesError,
    showSelector,
    hideSelector,
    selectTone,
    isCustomStyleSelected
  } = useStyleSelection();

  /**
   * Handle grammar fix action
   */
  const handleGrammarFix = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.blur();
    
    try {
      await onResult(selectedText, API_CONFIG.ENDPOINTS.GRAMMAR_FIX, {});
    } catch (error) {
      const appError = new AppError(
        'Grammar fix failed',
        ERROR_TYPES.API,
        error
      );
      logError(appError, { selectedText: selectedText.substring(0, 50) });
      onError?.(appError.message);
    }
  };

  /**
   * Handle rephrase button click
   */
  const handleRephraseClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.blur();
    showSelector();
  };

  /**
   * Handle rephrase confirmation
   */
  const handleRephraseConfirm = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.blur();
    
    try {
      if (isCustomStyleSelected) {
        // Send custom prompt to rephrase endpoint
        await onResult(selectedText, API_CONFIG.ENDPOINTS.REPHRASE, { 
          custom_prompt: selectedOption.prompt,  // Template with {selected_text} placeholder
          style_name: selectedOption.label 
        });
      } else {
        // Handle built-in style normally
        await onResult(selectedText, API_CONFIG.ENDPOINTS.REPHRASE, { 
          tone: selectedTone 
        });
      }
      
      hideSelector();
    } catch (error) {
      const appError = new AppError(
        'Rephrase failed',
        ERROR_TYPES.API,
        error
      );
      logError(appError, { 
        selectedText: selectedText.substring(0, 50),
        selectedTone,
        isCustomStyle: isCustomStyleSelected,
        styleName: selectedOption?.label
      });
      onError?.(appError.message);
      hideSelector();
    }
  };

  /**
   * Handle rephrase cancellation
   */
  const handleRephraseCancel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.blur();
    hideSelector();
  };

  /**
   * Handle tone selection change
   */
  const handleToneChange = (event) => {
    selectTone(event.target.value);
  };

  // Render tone selector
  if (showToneSelector) {
    return (
      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
        <div className="tone-selector">
          <h4>Select style for rephrasing:</h4>
          
          {/* Loading state */}
          {stylesLoading && (
            <LoadingSpinner 
              size="small" 
              text="Loading custom styles..." 
              inline 
            />
          )}
          
          {/* Error state */}
          {stylesError && (
            <div className="styles-error">
              ⚠️ {ERROR_MESSAGES.CUSTOM_STYLES_LOAD_ERROR}
            </div>
          )}
          
          {/* Dropdown container */}
          <div className="tone-dropdown-container">
            <select 
              value={selectedTone} 
              onChange={handleToneChange}
              className="tone-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              {allToneOptions.map((option, index) => {
                if (option.type === 'separator') {
                  return (
                    <option key={`separator-${index}`} disabled className="dropdown-separator">
                      ──────────────
                    </option>
                  );
                }
                
                return (
                  <option key={option.value} value={option.value}>
                    {option.icon ? `${option.icon} ${option.label}` : option.label}
                  </option>
                );
              })}
            </select>
            
            {/* Style preview for custom styles */}
            {selectedCustomStyle && (
              <StylePreview style={selectedCustomStyle} />
            )}
          </div>
          
          {/* Action buttons */}
          <div className="tone-actions">
            <button 
              onClick={handleRephraseConfirm}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                'Apply Style'
              )}
            </button>
            <button 
              onClick={handleRephraseCancel}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render main action buttons
  return (
    <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={handleGrammarFix}
        disabled={loading}
        className="btn btn-primary"
        aria-label="Fix grammar and spelling"
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Fixing...
          </>
        ) : (
          <>
            ✏️ Grammar Fix
          </>
        )}
      </button>
      
      <button 
        onClick={handleRephraseClick}
        disabled={loading}
        className="btn btn-primary"
        aria-label="Rephrase text with different styles"
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Processing...
          </>
        ) : (
          <>
            🔄 Rephrase
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
