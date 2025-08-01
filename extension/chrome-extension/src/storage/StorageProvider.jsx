import React, { createContext, useContext } from 'react';
import StyleStorage from './StyleStorage';

/**
 * React context for storage operations
 */
const StorageContext = createContext();

/**
 * Hook to access storage context
 * @returns {Object} - Storage utilities
 */
export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

/**
 * Storage provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const StorageProvider = ({ children }) => {
  const storageUtils = {
    // Style storage operations
    saveStyles: StyleStorage.saveStyles,
    loadStyles: StyleStorage.loadStyles,
    addStyle: StyleStorage.addStyle,
    updateStyle: StyleStorage.updateStyle,
    deleteStyle: StyleStorage.deleteStyle,
    getStyleById: StyleStorage.getStyleById,
    clearAllStyles: StyleStorage.clearAllStyles,
    getStorageInfo: StyleStorage.getStorageInfo
  };

  return (
    <StorageContext.Provider value={storageUtils}>
      {children}
    </StorageContext.Provider>
  );
};

export default StorageProvider;
