import { useState, useEffect, useCallback } from 'react';
import StyleStorage from '../storage/StyleStorage';

/**
 * Custom hook for managing custom rewrite styles
 * Provides a React-friendly interface for CRUD operations on custom styles
 */
export const useCustomRewriteStyles = () => {
  // State management
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  /**
   * Load styles from storage
   */
  const loadStylesFromStorage = useCallback(async () => {
    if (loading) return; // Prevent concurrent loads
    
    setLoading(true);
    setError(null);
    
    try {
      const loadedStyles = await StyleStorage.loadStyles();
      setStyles(loadedStyles);
      console.log('Custom rewrite styles loaded:', loadedStyles.length);
    } catch (err) {
      console.error('Failed to load custom rewrite styles:', err);
      setError(err.message);
      setStyles([]); // Fallback to empty array
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [loading]);

  /**
   * Initialize hook by loading styles
   */
  useEffect(() => {
    if (!initialized) {
      loadStylesFromStorage();
    }
  }, [initialized, loadStylesFromStorage]);

  /**
   * Create a new custom style
   * @param {Object} styleData - Style data to create
   * @returns {Promise<Object>} - The created style
   */
  const createStyle = useCallback(async (styleData) => {
    setLoading(true);
    setError(null);

    try {
      const newStyle = await StyleStorage.addStyle(styleData);
      
      // Update local state
      setStyles(prevStyles => [...prevStyles, newStyle]);
      
      console.log('Custom rewrite style created:', newStyle.name);
      return newStyle;
    } catch (err) {
      console.error('Failed to create custom rewrite style:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing custom style
   * @param {string} styleId - ID of the style to update
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} - The updated style
   */
  const updateStyle = useCallback(async (styleId, updates) => {
    setLoading(true);
    setError(null);

    try {
      const updatedStyle = await StyleStorage.updateStyle(styleId, updates);
      
      // Update local state
      setStyles(prevStyles => 
        prevStyles.map(style => 
          style.id === styleId ? updatedStyle : style
        )
      );
      
      console.log('Custom rewrite style updated:', updatedStyle.name);
      return updatedStyle;
    } catch (err) {
      console.error('Failed to update custom rewrite style:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a custom style
   * @param {string} styleId - ID of the style to delete
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  const deleteStyle = useCallback(async (styleId) => {
    setLoading(true);
    setError(null);

    try {
      await StyleStorage.deleteStyle(styleId);
      
      // Update local state
      setStyles(prevStyles => 
        prevStyles.filter(style => style.id !== styleId)
      );
      
      console.log('Custom rewrite style deleted:', styleId);
      return true;
    } catch (err) {
      console.error('Failed to delete custom rewrite style:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a style by ID
   * @param {string} styleId - ID of the style to retrieve
   * @returns {Object|null} - The style object or null if not found
   */
  const getStyleById = useCallback((styleId) => {
    return styles.find(style => style.id === styleId) || null;
  }, [styles]);

  /**
   * Refresh styles from storage (useful for debugging)
   * @returns {Promise<void>}
   */
  const refreshStyles = useCallback(async () => {
    await loadStylesFromStorage();
  }, [loadStylesFromStorage]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear all styles (for testing/reset)
   * @returns {Promise<void>}
   */
  const clearAllStyles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await StyleStorage.clearAllStyles();
      setStyles([]);
      console.log('All custom rewrite styles cleared');
    } catch (err) {
      console.error('Failed to clear all custom rewrite styles:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get storage information
   * @returns {Promise<Object>} - Storage usage stats
   */
  const getStorageInfo = useCallback(async () => {
    try {
      return await StyleStorage.getStorageInfo();
    } catch (err) {
      console.error('Failed to get storage info:', err);
      throw err;
    }
  }, []);

  // Return hook interface
  return {
    // State
    styles,              // Array of all custom styles
    loading,             // Boolean: is any operation in progress?
    error,               // String: current error message (if any)
    initialized,         // Boolean: has initial load completed?

    // Operations
    createStyle,         // Function: create new style
    updateStyle,         // Function: update existing style
    deleteStyle,         // Function: delete style
    getStyleById,        // Function: get style by ID
    refreshStyles,       // Function: reload styles from storage
    clearError,          // Function: clear error state
    clearAllStyles,      // Function: clear all styles (testing)
    getStorageInfo,      // Function: get storage usage info

    // Computed values
    styleCount: styles.length,  // Number of styles
    hasStyles: styles.length > 0  // Boolean: has any styles
  };
};

export default useCustomRewriteStyles;
