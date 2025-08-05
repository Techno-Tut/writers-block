/**
 * Application Configuration
 * Centralized configuration for better maintainability
 */

// Built-in rewrite styles configuration
export const BUILTIN_STYLES = [
  { value: 'professional', label: 'Professional', type: 'builtin' },
  { value: 'casual', label: 'Casual', type: 'builtin' },
  { value: 'academic', label: 'Academic', type: 'builtin' },
  { value: 'creative', label: 'Creative', type: 'builtin' },
  { value: 'technical', label: 'Technical', type: 'builtin' }
];

// Form validation limits
export const VALIDATION_LIMITS = {
  STYLE_NAME_MAX_LENGTH: 50,
  STYLE_DESCRIPTION_MAX_LENGTH: 200,
  STYLE_PROMPT_MAX_LENGTH: 1000,
  REQUIRED_PLACEHOLDER: '{selected_text}'
};

// UI Configuration
export const UI_CONFIG = {
  FLOATING_WINDOW: {
    WIDTH: 280,
    HEIGHT: 200,
    MARGIN: 10
  },
  ANIMATIONS: {
    FADE_DURATION: 200,
    SLIDE_DURATION: 200
  },
  TOOLTIPS: {
    DELAY: 500,
    FADE_DURATION: 200
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  STYLE_NAME_REQUIRED: 'Style name is required',
  STYLE_NAME_TOO_LONG: `Style name must be ${VALIDATION_LIMITS.STYLE_NAME_MAX_LENGTH} characters or less`,
  DESCRIPTION_REQUIRED: 'Description is required',
  DESCRIPTION_TOO_LONG: `Description must be ${VALIDATION_LIMITS.STYLE_DESCRIPTION_MAX_LENGTH} characters or less`,
  PROMPT_REQUIRED: 'Custom prompt is required',
  PROMPT_MISSING_PLACEHOLDER: `Prompt must contain ${VALIDATION_LIMITS.REQUIRED_PLACEHOLDER} placeholder`,
  PROMPT_TOO_LONG: `Prompt must be ${VALIDATION_LIMITS.STYLE_PROMPT_MAX_LENGTH} characters or less`,
  CUSTOM_STYLES_LOAD_ERROR: 'Error loading custom styles',
  SETTINGS_OPEN_ERROR: 'Failed to open settings page',
  // New validation error messages
  VALIDATION_ERROR: 'Invalid request parameters',
  CUSTOM_PROMPT_INVALID: 'Custom prompt must contain {selected_text} placeholder',
  CONFLICTING_PARAMETERS: 'Cannot specify both tone and custom prompt',
  MISSING_PARAMETERS: 'Must specify either tone or custom prompt',
  API_VALIDATION_ERROR: 'Request validation failed'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TEXT_APPLIED: '✅ Text updated successfully!',
  STYLE_CREATED: '✅ Style created successfully!',
  STYLE_UPDATED: '✅ Style updated successfully!',
  STYLE_DELETED: '✅ Style deleted successfully!'
};

// API Configuration
export const API_CONFIG = {
  ENDPOINTS: {
    GRAMMAR_FIX: 'grammar_fix',
    REPHRASE: 'rephrase'  // Handles both built-in tones and custom prompts
  },
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};
