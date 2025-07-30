# Writers Block Chrome Extension

AI-powered writing assistant for Salesforce Quip with React components.

## Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Extension
```bash
# Development build with watch mode
npm run dev

# Production build
npm run build
```

### 3. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select this directory (`chrome-extension/`)

### 4. Test the Extension
1. Navigate to any Quip document
2. Look for the debug panel in the top-right corner
3. Select text on the page
4. Check console logs and debug panel for text selection detection

## Current Implementation (Iteration 1)

✅ **React Setup**: React components working in Chrome extension  
✅ **Text Selection**: Detects text selection with 0.5s delay  
✅ **Debug UI**: Visual feedback for development  
✅ **Console Logging**: Text selection events logged  

## File Structure

```
chrome-extension/
├── src/
│   ├── content-script/
│   │   └── index.js          # Entry point
│   ├── components/
│   │   └── App.jsx           # Main React component
│   ├── styles/
│   │   └── app.css           # Component styles
│   └── utils/                # Utilities (future)
├── dist/                     # Built files (generated)
├── webpack.config.js         # Build configuration
├── package.json              # Dependencies
└── manifest.json             # Extension manifest
```

## Next Iterations

- **Iteration 2**: Simple floating window
- **Iteration 3**: Action buttons + API integration
- **Iteration 4**: Text replacement
- **Iteration 5**: Chat interface
- **Iteration 6**: Glassmorphism polish
