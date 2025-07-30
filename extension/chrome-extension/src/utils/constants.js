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

// Extension Info
export const EXTENSION = {
  NAME: 'Writers Block Assistant',
  VERSION: '1.0.0'
};
