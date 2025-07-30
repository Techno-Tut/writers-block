/**
 * Text replacement utilities using execCommand for reliable text replacement
 */

/**
 * Replace the currently selected text with new text
 * Uses execCommand('insertText') for maximum compatibility with web editors
 */
export const replaceSelectedText = (newText) => {
  try {
    const selection = window.getSelection();
    
    if (!selection.rangeCount) {
      throw new Error('No text selection found');
    }

    // Check if we have a valid selection
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      throw new Error('No text is currently selected');
    }

    // Use execCommand for reliable text replacement
    // This method updates both DOM and internal editor state
    const success = document.execCommand('insertText', false, newText);
    
    if (!success) {
      // Fallback method if execCommand fails
      console.warn('execCommand failed, using fallback method');
      range.deleteContents();
      range.insertNode(document.createTextNode(newText));
    }

    console.log('Text replacement successful:', newText);
    return true;

  } catch (error) {
    console.error('Text replacement failed:', error);
    throw error;
  }
};

/**
 * Check if text replacement is possible in the current context
 */
export const canReplaceText = () => {
  try {
    const selection = window.getSelection();
    
    if (!selection.rangeCount) {
      return { canReplace: false, reason: 'No text selection found' };
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      return { canReplace: false, reason: 'No text is currently selected' };
    }

    // Check if the selection is in an editable element
    const container = range.commonAncestorContainer;
    const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
    
    const isEditable = element.isContentEditable || 
                      element.closest('[contenteditable="true"]') ||
                      element.tagName === 'TEXTAREA' ||
                      element.tagName === 'INPUT';

    if (!isEditable) {
      return { canReplace: false, reason: 'Selected text is not in an editable area' };
    }

    return { canReplace: true, reason: 'Text replacement is possible' };

  } catch (error) {
    return { canReplace: false, reason: `Error checking replacement capability: ${error.message}` };
  }
};

/**
 * Get information about the current text selection
 */
export const getSelectionInfo = () => {
  try {
    const selection = window.getSelection();
    
    if (!selection.rangeCount) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    const rect = range.getBoundingClientRect();

    return {
      text: selectedText,
      range: range,
      rect: rect,
      isEmpty: range.collapsed
    };

  } catch (error) {
    console.error('Error getting selection info:', error);
    return null;
  }
};
