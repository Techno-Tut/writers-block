# Writer Block Chrome Extension

## Project Structure

```
chrome-extension/
├── manifest.json     # Extension configuration
├── content.js        # Runs on web pages, handles text selection
├── background.js     # Background processes, API calls
├── popup.html        # Extension popup interface
├── popup.js          # Popup functionality
├── styles.css        # Custom styles for injected UI
├── icons/            # Extension icons (16px, 48px, 128px)
└── README.md         # This file
```

## How to Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The extension should now appear in your extensions list

## Development Workflow

1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Test on any webpage

## Current Status

- ✅ Basic structure created
- ✅ Manifest configured for Manifest V3
- ✅ Content script detects text selection
- ✅ Background script ready for API calls
- ⏳ Floating UI (TODO)
- ⏳ AI integration (TODO)
- ⏳ Text replacement (TODO)

## Next Steps

1. Create floating window UI
2. Implement text replacement logic
3. Connect to AI backend
4. Add styling and animations
5. Test on various websites (Quip, Google Docs, etc.)
