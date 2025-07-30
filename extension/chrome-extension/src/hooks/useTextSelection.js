import { useState, useEffect, useCallback } from 'react';
import { SELECTION_DELAY } from '../utils/constants';

/**
 * Custom hook for handling text selection with delay
 */
export const useTextSelection = () => {
  const [selectedText, setSelectedText] = useState('');
  const [selectionCount, setSelectionCount] = useState(0);
  const [hasSelection, setHasSelection] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectedText('');
    setHasSelection(false);
    window.getSelection().removeAllRanges();
  }, []);

  useEffect(() => {
    let selectionTimer = null;
    
    const handleTextSelection = () => {
      // Clear existing timer
      if (selectionTimer) {
        clearTimeout(selectionTimer);
      }
      
      // Set new timer for delay
      selectionTimer = setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        
        if (text.length > 0) {
          console.log('Text selected:', text);
          setSelectedText(text);
          setSelectionCount(prev => prev + 1);
          setHasSelection(true);
        } else {
          console.log('Text deselected');
          setSelectedText('');
          setHasSelection(false);
        }
      }, SELECTION_DELAY);
    };
    
    // Add event listeners
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);
    
    // Cleanup
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
      if (selectionTimer) {
        clearTimeout(selectionTimer);
      }
    };
  }, []);

  return {
    selectedText,
    selectionCount,
    hasSelection,
    clearSelection
  };
};
