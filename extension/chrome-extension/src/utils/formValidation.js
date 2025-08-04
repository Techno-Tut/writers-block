/**
 * Form Validation Utilities
 * Reusable validation functions for consistent error handling
 */

import { VALIDATION_LIMITS, ERROR_MESSAGES } from '../config';

/**
 * Validate style name
 * @param {string} name - Style name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateStyleName = (name) => {
  if (!name || !name.trim()) {
    return ERROR_MESSAGES.STYLE_NAME_REQUIRED;
  }
  
  if (name.length > VALIDATION_LIMITS.STYLE_NAME_MAX_LENGTH) {
    return ERROR_MESSAGES.STYLE_NAME_TOO_LONG;
  }
  
  return null;
};

/**
 * Validate style description
 * @param {string} description - Description to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateStyleDescription = (description) => {
  if (!description || !description.trim()) {
    return ERROR_MESSAGES.DESCRIPTION_REQUIRED;
  }
  
  if (description.length > VALIDATION_LIMITS.STYLE_DESCRIPTION_MAX_LENGTH) {
    return ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
  }
  
  return null;
};

/**
 * Validate style prompt
 * @param {string} prompt - Prompt to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateStylePrompt = (prompt) => {
  if (!prompt || !prompt.trim()) {
    return ERROR_MESSAGES.PROMPT_REQUIRED;
  }
  
  if (!prompt.includes(VALIDATION_LIMITS.REQUIRED_PLACEHOLDER)) {
    return ERROR_MESSAGES.PROMPT_MISSING_PLACEHOLDER;
  }
  
  if (prompt.length > VALIDATION_LIMITS.STYLE_PROMPT_MAX_LENGTH) {
    return ERROR_MESSAGES.PROMPT_TOO_LONG;
  }
  
  return null;
};

/**
 * Validate complete style form data
 * @param {Object} formData - Form data to validate
 * @param {string} formData.name - Style name
 * @param {string} formData.description - Style description
 * @param {string} formData.prompt - Style prompt
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const validateStyleForm = (formData) => {
  const errors = {};
  
  const nameError = validateStyleName(formData.name);
  if (nameError) errors.name = nameError;
  
  const descriptionError = validateStyleDescription(formData.description);
  if (descriptionError) errors.description = descriptionError;
  
  const promptError = validateStylePrompt(formData.prompt);
  if (promptError) errors.prompt = promptError;
  
  return errors;
};

/**
 * Check if form has any validation errors
 * @param {Object} errors - Validation errors object
 * @returns {boolean} True if form is valid (no errors)
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

/**
 * Get character count status for a field
 * @param {string} value - Current field value
 * @param {number} maxLength - Maximum allowed length
 * @returns {Object} Status object with count, remaining, and isNearLimit
 */
export const getCharacterCountStatus = (value, maxLength) => {
  const count = value ? value.length : 0;
  const remaining = maxLength - count;
  const isNearLimit = remaining <= maxLength * 0.1; // Within 10% of limit
  
  return {
    count,
    remaining,
    isNearLimit,
    isOverLimit: remaining < 0
  };
};
