import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateFloatingWindowPosition, isClickOutsideWindow } from '../utils/positioning';

/**
 * Custom hook for managing floating window state and positioning
 */
export const useFloatingWindow = (hasSelection) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const windowRef = useRef(null);

  // Show window when text is selected
  useEffect(() => {
    if (hasSelection) {
      const newPosition = calculateFloatingWindowPosition();
      setPosition(newPosition);
      setIsVisible(true);
      console.log('Floating window shown');
    } else {
      setIsVisible(false);
      console.log('Floating window hidden (no selection)');
    }
  }, [hasSelection]);

  // Handle clicks outside window - use setTimeout to let button clicks complete first
  useEffect(() => {
    const handleDocumentClick = (event) => {
      console.log('Document click detected, target:', event.target);
      
      // Use setTimeout to let button clicks complete first
      setTimeout(() => {
        if (isVisible && windowRef.current) {
          const isOutside = isClickOutsideWindow(event, windowRef.current);
          console.log('Click outside window?', isOutside);
          
          if (isOutside) {
            console.log('Closing window due to outside click');
            setIsVisible(false);
          }
        }
      }, 0);
    };

    if (isVisible) {
      console.log('Adding document click listener');
      document.addEventListener('click', handleDocumentClick, true); // Use capture phase
    }

    return () => {
      if (isVisible) {
        console.log('Removing document click listener');
      }
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [isVisible]);

  const closeWindow = useCallback(() => {
    console.log('Closing window manually');
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    position,
    windowRef,
    closeWindow
  };
};
