// Writer Block - Clean Implementation
console.log('Writer Block loaded on:', window.location.href);

// Visual indicator
const indicator = document.createElement('div');
indicator.textContent = 'Writer Block Active';
indicator.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  background: #4CAF50;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  z-index: 10000;
  font-size: 12px;
  font-family: Arial, sans-serif;
`;
document.body.appendChild(indicator);

// Remove indicator after 3 seconds
setTimeout(() => {
  if (indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}, 3000);

// Test sentences for AI simulation
const aiResponses = {
  grammar: (text) => `${text.replace(/\b(teh|hte)\b/g, 'the').replace(/\bi\b/g, 'I')}`,
  rewrite: (text) => `Here's a clearer version: ${text}`,
  expand: (text) => `${text} This expanded version provides additional context and detail.`,
  summarize: (text) => text.length > 50 ? `${text.substring(0, 30)}... (summarized)` : text
};

// Core text replacement function using execCommand
function replaceSelectedText(newText) {
  const selection = window.getSelection();
  
  if (selection.rangeCount === 0) {
    console.log('❌ No text selected');
    return false;
  }
  
  console.log(`🔄 Replacing selected text with: "${newText}"`);
  
  try {
    // This is the magic method that works with Quip's internal state
    const success = document.execCommand('insertText', false, newText);
    
    if (success) {
      console.log('✅ Text replacement successful');
      return true;
    } else {
      console.log('❌ execCommand returned false');
      return false;
    }
  } catch (error) {
    console.log('❌ execCommand failed:', error);
    return false;
  }
}

// AI processing simulation (replace with actual AI API calls)
function processTextWithAI(text, action) {
  console.log(`🤖 Processing text with AI: ${action}`);
  
  // Simulate AI processing
  if (aiResponses[action]) {
    return aiResponses[action](text);
  }
  
  return `AI processed (${action}): ${text}`;
}

// Handle AI actions
function handleAIAction(action, selectedText) {
  console.log(`🎯 AI Action: ${action} for text: "${selectedText}"`);
  
  // Process text with AI
  const aiResult = processTextWithAI(selectedText, action);
  
  // Show result to user and confirm replacement
  const confirmed = confirm(`${action.toUpperCase()} Result:\n\n"${aiResult}"\n\nReplace selected text?`);
  
  if (confirmed) {
    const success = replaceSelectedText(aiResult);
    if (success) {
      alert('✅ Text replaced successfully! Changes will be auto-saved by Quip.');
    } else {
      alert('❌ Failed to replace text. Please try again.');
    }
  }
}

// Listen for text selection
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText.length > 0) {
    console.log('📋 Selected text:', selectedText);
    
    // Show AI options
    const options = `Selected: "${selectedText}"

Choose AI action:
1 - Fix Grammar
2 - Rewrite 
3 - Expand
4 - Summarize

Enter 1, 2, 3, or 4:`;
    
    const choice = prompt(options);
    
    const actions = {
      '1': 'grammar',
      '2': 'rewrite', 
      '3': 'expand',
      '4': 'summarize'
    };
    
    if (actions[choice]) {
      handleAIAction(actions[choice], selectedText);
    } else {
      console.log('Action cancelled');
    }
  }
});

console.log('🎯 Writer Block ready! Select text to see AI options.');
console.log('💡 Using execCommand method for reliable text replacement.');
