/**
 * Custom hook for managing style selection in ActionButtons
 */

import { useState, useMemo } from 'react';
import { useCustomRewriteStyles } from './useCustomRewriteStyles';
import { BUILTIN_STYLES } from '../config';

export const useStyleSelection = () => {
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [selectedTone, setSelectedTone] = useState('professional');
  
  // Load custom styles
  const { 
    styles: customStyles, 
    loading: stylesLoading, 
    error: stylesError 
  } = useCustomRewriteStyles();

  /**
   * Combine built-in and custom styles
   */
  const allToneOptions = useMemo(() => {
    const options = [...BUILTIN_STYLES];
    
    // Add separator if we have custom styles
    if (customStyles && customStyles.length > 0) {
      options.push({ type: 'separator' });
      
      // Add custom styles
      customStyles.forEach(style => {
        options.push({
          value: style.id,
          label: style.name,
          type: 'custom',
          prompt: style.prompt,
          icon: '📝'
        });
      });
    }
    
    return options;
  }, [customStyles]);

  /**
   * Get currently selected style option
   */
  const selectedOption = useMemo(() => {
    return allToneOptions.find(option => option.value === selectedTone);
  }, [allToneOptions, selectedTone]);

  /**
   * Get custom style details for preview
   */
  const selectedCustomStyle = useMemo(() => {
    if (selectedOption?.type === 'custom' && customStyles) {
      return customStyles.find(style => style.id === selectedTone);
    }
    return null;
  }, [selectedOption, customStyles, selectedTone]);

  /**
   * Show tone selector
   */
  const showSelector = () => {
    setShowToneSelector(true);
  };

  /**
   * Hide tone selector
   */
  const hideSelector = () => {
    setShowToneSelector(false);
  };

  /**
   * Select a tone/style
   */
  const selectTone = (toneValue) => {
    setSelectedTone(toneValue);
  };

  /**
   * Check if selected style is custom
   */
  const isCustomStyleSelected = selectedOption?.type === 'custom';

  return {
    // State
    showToneSelector,
    selectedTone,
    selectedOption,
    selectedCustomStyle,
    allToneOptions,
    
    // Custom styles state
    customStyles,
    stylesLoading,
    stylesError,
    
    // Actions
    showSelector,
    hideSelector,
    selectTone,
    
    // Computed
    isCustomStyleSelected
  };
};
