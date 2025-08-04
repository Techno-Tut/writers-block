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
  
  if (request.action === 'openSettings') {
    // Open settings page in new tab
    chrome.tabs.create({ 
      url: chrome.runtime.getURL('settings.html') 
    }).then(() => {
      console.log('Settings page opened successfully');
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Failed to open settings page:', error);
      sendResponse({ success: false, error: error.message });
    });
  }
  
  return true; // Keep message channel open for async response
});
