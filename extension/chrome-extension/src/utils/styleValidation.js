import { CUSTOM_STYLES } from './constants';

/**
 * Validation utilities for custom rewrite styles
 */

/**
 * Validate a custom rewrite style object
 * @param {Object} style - The style object to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateCustomStyle = (style) => {
  const errors = [];

  // Check required fields
  if (!style || typeof style !== 'object') {
    return { isValid: false, errors: ['Style must be an object'] };
  }

  // Validate name
  if (!style.name || typeof style.name !== 'string') {
    errors.push('Name is required and must be a string');
  } else if (style.name.trim().length === 0) {
    errors.push('Name cannot be empty');
  } else if (style.name.length > CUSTOM_STYLES.MAX_NAME_LENGTH) {
    errors.push(`Name must be ${CUSTOM_STYLES.MAX_NAME_LENGTH} characters or less`);
  }

  // Validate description (optional)
  if (style.description !== undefined) {
    if (typeof style.description !== 'string') {
      errors.push('Description must be a string');
    } else if (style.description.length > CUSTOM_STYLES.MAX_DESCRIPTION_LENGTH) {
      errors.push(`Description must be ${CUSTOM_STYLES.MAX_DESCRIPTION_LENGTH} characters or less`);
    }
  }

  // Validate prompt
  if (!style.prompt || typeof style.prompt !== 'string') {
    errors.push('Prompt is required and must be a string');
  } else if (style.prompt.trim().length === 0) {
    errors.push('Prompt cannot be empty');
  } else if (style.prompt.length > CUSTOM_STYLES.MAX_PROMPT_LENGTH) {
    errors.push(`Prompt must be ${CUSTOM_STYLES.MAX_PROMPT_LENGTH} characters or less`);
  } else if (!style.prompt.includes(CUSTOM_STYLES.REQUIRED_PLACEHOLDER)) {
    errors.push(`Prompt must contain the placeholder: ${CUSTOM_STYLES.REQUIRED_PLACEHOLDER}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize and normalize a style object
 * @param {Object} style - The style object to sanitize
 * @returns {Object} - Sanitized style object
 */
export const sanitizeCustomStyle = (style) => {
  return {
    id: style.id || `style_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: (style.name || '').trim(),
    description: (style.description || '').trim(),
    prompt: (style.prompt || '').trim(),
    createdAt: style.createdAt || Date.now(),
    lastModified: Date.now(),
    isCustom: true
  };
};

/**
 * Check if a style name is unique within an array of styles
 * @param {string} name - The name to check
 * @param {Array} existingStyles - Array of existing styles
 * @param {string} excludeId - ID to exclude from check (for updates)
 * @returns {boolean} - True if name is unique
 */
export const isStyleNameUnique = (name, existingStyles, excludeId = null) => {
  const trimmedName = name.trim().toLowerCase();
  return !existingStyles.some(style => 
    style.id !== excludeId && 
    style.name.trim().toLowerCase() === trimmedName
  );
};

/**
 * Generate a unique style ID
 * @returns {string} - Unique style ID
 */
export const generateStyleId = () => {
  return `style_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
