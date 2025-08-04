import React, { useState } from 'react';
import { useCustomRewriteStyles } from '../hooks/useCustomRewriteStyles';
import '../styles/action-buttons.css';

const ActionButtons = ({ selectedText, onResult, loading, onError }) => {
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [selectedTone, setSelectedTone] = useState('professional');
  
  // Load custom styles
  const { styles: customStyles, loading: stylesLoading, error: stylesError } = useCustomRewriteStyles();
  
  // Debug logging
  console.log('ActionButtons - Custom styles state:', {
    customStyles,
    stylesLoading,
    stylesError
  });

  const builtInToneOptions = [
    { value: 'professional', label: 'Professional', type: 'builtin' },
    { value: 'casual', label: 'Casual', type: 'builtin' },
    { value: 'academic', label: 'Academic', type: 'builtin' },
    { value: 'creative', label: 'Creative', type: 'builtin' },
    { value: 'technical', label: 'Technical', type: 'builtin' }
  ];

  // Combine built-in and custom styles with error handling
  const allToneOptions = [
    ...builtInToneOptions,
    ...((customStyles && customStyles.length > 0) ? [{ type: 'separator' }] : []),
    ...(customStyles || []).map(style => ({
      value: style.id,
      label: style.name,
      type: 'custom',
      prompt: style.prompt,
      icon: '📝'
    }))
  ];

  const handleGrammarFix = async (event) => {
    console.log('Grammar Fix button clicked!');
    event.preventDefault();
    event.stopPropagation();
    
    // Prevent the button click from clearing text selection
    event.target.blur();
    
    try {
      console.log('Calling onResult...');
      await onResult(selectedText, 'grammar_fix', {});
      console.log('onResult completed');
    } catch (error) {
      console.error('Grammar fix error:', error);
      onError?.(error.message);
    }
  };

  const handleRephraseClick = (event) => {
    console.log('Rephrase button clicked!');
    event.preventDefault();
    event.stopPropagation();
    event.target.blur();
    setShowToneSelector(true);
  };

  const handleRephraseConfirm = async (event) => {
    console.log('Rephrase confirm clicked!');
    event.preventDefault();
    event.stopPropagation();
    event.target.blur();
    
    try {
      // Find the selected option to determine if it's custom or built-in
      const selectedOption = allToneOptions.find(option => option.value === selectedTone);
      
      if (selectedOption && selectedOption.type === 'custom') {
        // Handle custom style
        console.log('Using custom style:', selectedOption);
        await onResult(selectedText, 'custom_prompt', { 
          prompt: selectedOption.prompt,
          style_name: selectedOption.label 
        });
      } else {
        // Handle built-in style
        console.log('Using built-in style:', selectedTone);
        await onResult(selectedText, 'rephrase', { tone: selectedTone });
      }
      
      setShowToneSelector(false);
    } catch (error) {
      console.error('Rephrase error:', error);
      onError?.(error.message);
      setShowToneSelector(false);
    }
  };

  const handleRephraseCancel = (event) => {
    console.log('Rephrase cancel clicked!');
    event.preventDefault();
    event.stopPropagation();
    event.target.blur();
    setShowToneSelector(false);
  };

  if (showToneSelector) {
    return (
      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
        <div className="tone-selector">
          <h4>Select style for rephrasing:</h4>
          
          {stylesLoading && (
            <div className="styles-loading">
              <span className="loading-spinner"></span>
              Loading custom styles...
            </div>
          )}
          
          {stylesError && (
            <div className="styles-error">
              ⚠️ Error loading custom styles
            </div>
          )}
          
          <div className="tone-dropdown-container">
            <select 
              value={selectedTone} 
              onChange={(e) => setSelectedTone(e.target.value)}
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
            
            {/* Show description for selected custom style */}
            {(() => {
              const selectedOption = allToneOptions.find(opt => opt.value === selectedTone);
              if (selectedOption && selectedOption.type === 'custom' && customStyles) {
                const customStyle = customStyles.find(s => s.id === selectedTone);
                if (customStyle) {
                  return (
                    <div className="style-preview">
                      <small>📝 Custom Style</small>
                      <p>{customStyle.description}</p>
                    </div>
                  );
                }
              }
              return null;
            })()}
          </div>
          
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

  return (
    <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={handleGrammarFix}
        disabled={loading}
        className="btn btn-primary"
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
