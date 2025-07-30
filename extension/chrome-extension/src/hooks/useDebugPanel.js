import { useState, useCallback } from 'react';

/**
 * Custom hook for managing debug panel state
 */
export const useDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showDebug = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideDebug = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggleDebug = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return {
    isVisible,
    showDebug,
    hideDebug,
    toggleDebug
  };
};
