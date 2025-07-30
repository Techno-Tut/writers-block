import { useState, useEffect, useCallback } from 'react';
import { SELECTION_DELAY } from '../utils/constants';

/**
 * Custom hook for handling text selection with delay
 */
export const useTextSelection = () => {
  const [selectedText, setSelectedText] = useState('');
  const [selectionCount, setSelectionCount] = useState(0);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectionRange, setSelectionRange] = useState(null);

  const clearSelection = useCallback(() => {
    console.log('Manually clearing selection');
    setSelectedText('');
    setHasSelection(false);
    setSelectionRange(null);
    window.getSelection().removeAllRanges();
  }, []);

  const restoreSelection = useCallback(() => {
    if (selectionRange) {
      try {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(selectionRange.cloneRange());
        console.log('Selection restored for text replacement');
        return true;
      } catch (error) {
        console.error('Failed to restore selection:', error);
        return false;
      }
    }
    return false;
  }, [selectionRange]);

  useEffect(() => {
    let selectionTimer = null;
    
    const handleTextSelection = (event) => {
      // Don't process selection changes if the click was on our extension UI
      if (event.target.closest('.writers-block-app')) {
        console.log('Ignoring selection change from extension UI');
        return;
      }
      
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
          
          // Store the selection range for later use
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            setSelectionRange(range.cloneRange());
            console.log('Selection range stored');
          }
          
          setSelectedText(text);
          setSelectionCount(prev => prev + 1);
          setHasSelection(true);
        } else {
          // Only clear if we don't already have a selection (to prevent clearing during API calls)
          if (hasSelection) {
            console.log('Text deselected');
            setSelectedText('');
            setHasSelection(false);
            setSelectionRange(null);
          }
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
  }, [hasSelection]);

  return {
    selectedText,
    selectionCount,
    hasSelection,
    selectionRange,
    clearSelection,
    restoreSelection
  };
};
