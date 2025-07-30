import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../components/App';

console.log('Writers Block Extension: Content script loaded');

// Create container for React app
const createAppContainer = () => {
  const container = document.createElement('div');
  container.id = 'writers-block-extension-root';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  document.body.appendChild(container);
  return container;
};

// Initialize React app
const initializeApp = () => {
  try {
    const container = createAppContainer();
    const root = createRoot(container);
    
    root.render(<App />);
    
    console.log('Writers Block Extension: React app initialized');
  } catch (error) {
    console.error('Writers Block Extension: Failed to initialize React app', error);
  }
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
