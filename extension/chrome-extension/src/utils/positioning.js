/**
 * Calculate optimal position for floating window near text selection
 */

import { FLOATING_WINDOW } from './constants';

const { WIDTH: WINDOW_WIDTH, HEIGHT: WINDOW_HEIGHT, MARGIN } = FLOATING_WINDOW;

export const calculateFloatingWindowPosition = () => {
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    return { x: 100, y: 100 }; // Fallback position
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  
  // Calculate initial position (below selection)
  let x = rect.left + scrollX;
  let y = rect.bottom + scrollY + MARGIN;
  
  // Adjust horizontal position if window would go off-screen
  if (x + WINDOW_WIDTH > viewportWidth + scrollX) {
    x = viewportWidth + scrollX - WINDOW_WIDTH - MARGIN;
  }
  
  // Ensure minimum left margin
  if (x < scrollX + MARGIN) {
    x = scrollX + MARGIN;
  }
  
  // Check if there's enough space below, otherwise position above
  if (y + WINDOW_HEIGHT > viewportHeight + scrollY) {
    // Position above selection
    y = rect.top + scrollY - WINDOW_HEIGHT - MARGIN;
    
    // If still not enough space above, position at top of viewport
    if (y < scrollY + MARGIN) {
      y = scrollY + MARGIN;
    }
  }
  
  return { x: Math.round(x), y: Math.round(y) };
};

/**
 * Check if click is outside the floating window
 */
export const isClickOutsideWindow = (event, windowElement) => {
  if (!windowElement) return true;
  return !windowElement.contains(event.target);
};
