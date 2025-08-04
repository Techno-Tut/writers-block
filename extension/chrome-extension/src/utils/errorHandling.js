/**
 * Error Handling Utilities
 * Centralized error handling and logging
 */

import { ERROR_MESSAGES } from '../config';

/**
 * Error types for categorization
 */
export const ERROR_TYPES = {
  VALIDATION: 'validation',
  API: 'api',
  STORAGE: 'storage',
  CHROME_API: 'chrome_api',
  UNKNOWN: 'unknown'
};

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Log error with context
 */
export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error.message,
    type: error.type || ERROR_TYPES.UNKNOWN,
    timestamp: new Date().toISOString(),
    context,
    stack: error.stack
  };

  console.error('Application Error:', errorInfo);
  
  // In production, you might want to send this to an error tracking service
  // trackError(errorInfo);
};

/**
 * Handle Chrome extension API errors
 */
export const handleChromeError = (operation, error) => {
  const chromeError = new AppError(
    `Chrome API error during ${operation}: ${error.message}`,
    ERROR_TYPES.CHROME_API,
    error
  );
  
  logError(chromeError, { operation });
  return chromeError;
};

/**
 * Handle storage errors
 */
export const handleStorageError = (operation, error) => {
  const storageError = new AppError(
    `Storage error during ${operation}: ${error.message}`,
    ERROR_TYPES.STORAGE,
    error
  );
  
  logError(storageError, { operation });
  return storageError;
};

/**
 * Handle API errors
 */
export const handleAPIError = (endpoint, error) => {
  const apiError = new AppError(
    `API error for ${endpoint}: ${error.message}`,
    ERROR_TYPES.API,
    error
  );
  
  logError(apiError, { endpoint });
  return apiError;
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error) => {
  if (error instanceof AppError) {
    switch (error.type) {
      case ERROR_TYPES.STORAGE:
        return 'There was a problem saving your data. Please try again.';
      case ERROR_TYPES.API:
        return 'Unable to process your request. Please check your connection and try again.';
      case ERROR_TYPES.CHROME_API:
        return 'Extension error occurred. Please reload the page and try again.';
      case ERROR_TYPES.VALIDATION:
        return error.message; // Validation messages are already user-friendly
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
