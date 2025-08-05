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
  NETWORK: 'network',
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
 * Handle API errors with enhanced validation error support
 */
export const handleAPIError = (endpoint, error) => {
  // Handle Pydantic validation errors (422 status)
  if (error?.response?.status === 422) {
    const responseData = error.response.data;
    const validationErrors = responseData?.detail || [];
    
    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];
      const errorMessage = firstError.msg || ERROR_MESSAGES.API_VALIDATION_ERROR;
      
      // Map specific validation errors to user-friendly messages
      if (errorMessage.includes('both \'tone\' and \'custom_prompt\'')) {
        return new AppError(ERROR_MESSAGES.CONFLICTING_PARAMETERS, ERROR_TYPES.VALIDATION, error);
      }
      
      if (errorMessage.includes('either \'tone\' or \'custom_prompt\'')) {
        return new AppError(ERROR_MESSAGES.MISSING_PARAMETERS, ERROR_TYPES.VALIDATION, error);
      }
      
      if (errorMessage.includes('{selected_text} placeholder')) {
        return new AppError(ERROR_MESSAGES.CUSTOM_PROMPT_INVALID, ERROR_TYPES.VALIDATION, error);
      }
      
      // Generic validation error
      return new AppError(errorMessage, ERROR_TYPES.VALIDATION, error);
    }
  }
  
  // Handle other HTTP errors
  if (error?.response?.status) {
    const status = error.response.status;
    const message = error.response.data?.message || `HTTP ${status} Error`;
    
    if (status >= 500) {
      return new AppError('Server temporarily unavailable. Please try again.', ERROR_TYPES.API, error);
    }
    
    if (status === 404) {
      return new AppError('API endpoint not found', ERROR_TYPES.API, error);
    }
    
    return new AppError(message, ERROR_TYPES.API, error);
  }
  
  // Handle network errors
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
    return new AppError('Unable to connect to server. Please check your connection.', ERROR_TYPES.NETWORK, error);
  }
  
  // Generic API error fallback
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
      case ERROR_TYPES.NETWORK:
        return 'Unable to connect to server. Please check your connection and try again.';
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
