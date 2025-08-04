/**
 * Custom hook for managing style form state and validation
 */

import { useState, useCallback } from 'react';
import { validateStyleForm, isFormValid } from '../utils/formValidation';

const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  prompt: ''
};

export const useStyleForm = (initialData = INITIAL_FORM_DATA) => {
  const [formData, setFormData] = useState(initialData);
  const [validationErrors, setValidationErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  /**
   * Update form field value
   */
  const updateField = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    setIsDirty(true);
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  }, [validationErrors]);

  /**
   * Validate entire form
   */
  const validateForm = useCallback(() => {
    const errors = validateStyleForm(formData);
    setValidationErrors(errors);
    return isFormValid(errors);
  }, [formData]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback((newInitialData = INITIAL_FORM_DATA) => {
    setFormData(newInitialData);
    setValidationErrors({});
    setIsDirty(false);
  }, []);

  /**
   * Get field error message
   */
  const getFieldError = useCallback((fieldName) => {
    return validationErrors[fieldName] || null;
  }, [validationErrors]);

  /**
   * Check if field has error
   */
  const hasFieldError = useCallback((fieldName) => {
    return Boolean(validationErrors[fieldName]);
  }, [validationErrors]);

  return {
    // Form data
    formData,
    
    // Validation
    validationErrors,
    isValid: isFormValid(validationErrors),
    isDirty,
    
    // Actions
    updateField,
    validateForm,
    resetForm,
    
    // Helpers
    getFieldError,
    hasFieldError
  };
};
