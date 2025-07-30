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
    } else {
      setIsVisible(false);
    }
  }, [hasSelection]);

  // Handle clicks outside window
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (isVisible && isClickOutsideWindow(event, windowRef.current)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isVisible]);

  const closeWindow = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    position,
    windowRef,
    closeWindow
  };
};
