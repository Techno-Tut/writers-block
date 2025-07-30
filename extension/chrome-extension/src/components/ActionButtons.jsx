import React, { useState } from 'react';
import '../styles/action-buttons.css';

const ActionButtons = ({ selectedText, onResult, loading, onError }) => {
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [selectedTone, setSelectedTone] = useState('professional');

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'academic', label: 'Academic' },
    { value: 'creative', label: 'Creative' },
    { value: 'technical', label: 'Technical' }
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
      await onResult(selectedText, 'rephrase', { tone: selectedTone });
      setShowToneSelector(false);
    } catch (error) {
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
          <h4>Select tone for rephrasing:</h4>
          <select 
            value={selectedTone} 
            onChange={(e) => setSelectedTone(e.target.value)}
            className="tone-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            {toneOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
                'Rephrase'
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
