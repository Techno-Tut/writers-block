// Writer Block - Background Script
console.log('Writer Block background script loaded');

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  if (request.action === 'processText') {
    // TODO: Send text to AI backend for processing
    // For now, return dummy response
    sendResponse({
      result: `Processed: ${request.text} (dummy response)`
    });
  }
  
  return true; // Keep message channel open for async response
});
