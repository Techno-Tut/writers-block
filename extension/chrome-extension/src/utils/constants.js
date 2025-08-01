/**
 * Application constants
 */

// Timing
export const SELECTION_DELAY = 500; // ms

// Floating Window
export const FLOATING_WINDOW = {
  WIDTH: 280,
  HEIGHT: 200,
  MARGIN: 10,
  Z_INDEX: 10001
};

// Debug Panel
export const DEBUG_PANEL = {
  Z_INDEX: 10000
};

// API Configuration
export const API = {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: {
    PROCESS_TEXT: '/api/v1/process-text'
  },
  TIMEOUT: 30000 // 30 seconds
};

// Custom Rewrite Styles
export const CUSTOM_STYLES = {
  STORAGE_KEY: 'custom_rewrite_styles',
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_PROMPT_LENGTH: 2000,
  REQUIRED_PLACEHOLDER: '{selected_text}',
  DEFAULT_STYLES: [] // No default custom styles
};

// Extension Info
export const EXTENSION = {
  NAME: 'Writers Block Assistant',
  VERSION: '1.0.0'
};
