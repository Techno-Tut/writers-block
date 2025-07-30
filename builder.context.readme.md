# Writers Block Assistant - Builder Context

## 🎯 Project Overview

**Writers Block Assistant** is an AI-powered Chrome extension that helps users improve their writing directly in web-based editors like Salesforce Quip. The extension uses Claude 3.7 Sonnet via AWS Bedrock to provide grammar fixes and text rephrasing with real-time text replacement.

## 📁 Project Structure

```
write-assist/
├── backend/                          # FastAPI backend service
│   ├── writers_block_service/
│   │   ├── __init__.py
│   │   ├── api.py                   # FastAPI routes
│   │   ├── config.py                # Configuration settings
│   │   ├── llm_client.py            # AWS Bedrock integration
│   │   ├── models.py                # Pydantic models
│   │   └── utils.py                 # Utility functions
│   ├── pyproject.toml               # Python dependencies (uv)
│   ├── .env.example                 # Environment variables template
│   └── README.md                    # Backend documentation
├── extension/chrome-extension/       # React-based Chrome extension
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── App.jsx              # Main app component
│   │   │   ├── FloatingWindow.jsx   # Main floating UI
│   │   │   ├── ActionButtons.jsx    # Grammar Fix/Rephrase buttons
│   │   │   ├── ResultDisplay.jsx    # Text comparison & apply/cancel
│   │   │   ├── SuccessMessage.jsx   # Success confirmation
│   │   │   ├── ErrorMessage.jsx     # Error handling
│   │   │   └── DebugPanel.jsx       # Development debug panel
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useTextSelection.js  # Text selection with range storage
│   │   │   ├── useFloatingWindow.js # Window positioning & visibility
│   │   │   ├── useDebugPanel.js     # Debug panel state
│   │   │   ├── useAPI.js            # Backend API communication
│   │   │   └── index.js             # Hooks exports
│   │   ├── utils/                   # Utility functions
│   │   │   ├── constants.js         # App constants
│   │   │   ├── positioning.js       # Window positioning logic
│   │   │   └── textReplacement.js   # Text replacement utilities
│   │   ├── styles/                  # CSS stylesheets
│   │   │   ├── app.css              # Main app styles
│   │   │   ├── floating-window.css  # Floating window styles
│   │   │   ├── action-buttons.css   # Button styles
│   │   │   └── result-display.css   # Result display styles
│   │   └── content-script/
│   │       └── index.js             # Content script entry point
│   ├── dist/                        # Built extension files (generated)
│   ├── package.json                 # Node.js dependencies
│   ├── webpack.config.js            # Build configuration
│   └── manifest.json                # Chrome extension manifest
└── docs/                            # Documentation
    ├── product_spec.readme.md       # Product specification
    └── core_architecture.readme.md  # Technical architecture
```

## 🚀 Current Implementation Status

### ✅ Completed Iterations

#### **Iteration 1: Basic React Setup + Text Selection**
- React build system with Webpack
- Text selection detection with 0.5s delay
- Debug panel for development
- Chrome extension integration

#### **Iteration 2: Simple Floating Window**
- Floating window appears near selected text
- Smart positioning (above/below based on available space)
- Show/hide logic with outside click detection
- Debug panel toggle (🐛 button)

#### **Iteration 3: Action Buttons + API Integration**
- Grammar Fix and Rephrase buttons
- API integration with FastAPI backend
- Loading states and error handling
- Tone selection for rephrasing (professional, casual, academic, creative, technical)
- Session management with session IDs

#### **Iteration 4: Text Replacement** ✅ CURRENT STATE
- Apply/Cancel buttons for text changes
- Text replacement using `document.execCommand('insertText')`
- Selection range storage and restoration
- Success feedback with auto-close
- Undo support (Ctrl+Z/Cmd+Z)
- Error handling for non-editable areas

### 🔄 Planned Iterations

#### **Iteration 5: Chat Interface** (Next)
- Conversation history display
- Multiple back-and-forth interactions
- Chat-like message bubbles
- Local storage for chat persistence

#### **Iteration 6: Glassmorphism Polish** (Final)
- Beautiful glass UI effects with backdrop blur
- Smooth animations and transitions
- Final visual polish and responsive design

## 🛠️ Technical Implementation

### **Backend Architecture**
- **Framework**: FastAPI with Python 3.12
- **AI Model**: Claude 3.7 Sonnet via AWS Bedrock
- **Package Manager**: uv (modern Python package manager)
- **API Endpoint**: `POST /api/v1/process-text`

### **Frontend Architecture**
- **Framework**: React 18 with functional components
- **Build System**: Webpack 5 with Babel
- **State Management**: Custom React hooks
- **Styling**: CSS with component-based organization
- **Text Replacement**: `document.execCommand('insertText')` for reliability

### **Key Technical Decisions**
1. **execCommand for Text Replacement**: Most reliable method for web editors
2. **Selection Range Storage**: Preserves selection even when UI interactions clear it
3. **Custom Hooks Pattern**: Clean separation of concerns and reusability
4. **Smart Positioning**: Window appears above/below selection based on viewport space
5. **Event Handling**: Proper event bubbling prevention for UI interactions

## 🔧 Development Setup

### **Backend Setup**
```bash
cd backend
uv sync                    # Install dependencies
cp .env.example .env       # Configure environment variables
uv run dev                 # Start development server (localhost:8000)
```

### **Extension Setup**
```bash
cd extension/chrome-extension
npm install               # Install dependencies
npm run dev              # Build with watch mode
```

### **Chrome Extension Installation**
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `extension/chrome-extension/` directory

## 🎯 Current User Flow

1. **Text Selection**: User selects text on any webpage
2. **Window Appears**: Floating window shows near selection after 0.5s delay
3. **Action Selection**: User clicks "Grammar Fix" or "Rephrase" button
4. **API Processing**: Backend processes text using Claude 3.7 Sonnet
5. **Result Display**: Shows original vs processed text comparison
6. **Apply Changes**: User clicks "Apply Changes" to replace text in document
7. **Success Confirmation**: Shows success message with auto-close
8. **Undo Available**: User can undo changes with Ctrl+Z/Cmd+Z

## 📊 API Specification

### **Request Format**
```json
{
  "selected_text": "This sentence have errors",
  "action": "grammar_fix",
  "parameters": {
    "tone": "professional"  // Only for rephrase action
  },
  "session_id": "session_abc123"  // Optional, for conversation continuity
}
```

### **Response Format**
```json
{
  "success": true,
  "processed_text": "This sentence has errors",
  "message": "Fixed grammar and spelling errors",
  "session_id": "session_abc123"
}
```

### **Supported Actions**
- `grammar_fix`: Fixes grammar and spelling errors
- `rephrase`: Rephrases text with specified tone

## 🐛 Debug Features

### **Debug Panel** (Toggle with 🐛 button)
- Text selection count and current selection
- Floating window visibility and position
- API status (idle, loading, success, error)
- Session ID tracking
- Success message status

### **Console Logging**
- Text selection events
- API requests and responses
- Text replacement attempts
- Selection range storage and restoration
- Error tracking

## 🔍 Known Issues & Solutions

### **Text Selection Clearing**
- **Issue**: Clicking buttons clears text selection
- **Solution**: Store selection range on initial selection, restore before replacement

### **Editor Compatibility**
- **Works**: Web-based editors (Quip, Google Docs, contenteditable elements)
- **Limitations**: Desktop applications, non-editable content

### **Event Handling**
- **Solution**: Proper event bubbling prevention with `stopPropagation()`
- **Solution**: Ignore selection changes from extension UI elements

## 🚀 Quick Start Commands

### **Start Development Environment**
```bash
# Terminal 1: Backend
cd backend && uv run dev

# Terminal 2: Extension Build
cd extension/chrome-extension && npm run dev

# Then load extension in Chrome and test on any webpage
```

### **Test the Extension**
1. Navigate to any webpage with editable text
2. Select text with errors (e.g., "This have errors")
3. Click "Grammar Fix" in floating window
4. Review the comparison
5. Click "Apply Changes" to replace text
6. Verify text is updated and undo works

## 📝 Git Commit History

- **Initial Setup**: Backend FastAPI + Chrome extension structure
- **Iteration 1**: React setup with text selection detection
- **Iteration 2**: Floating window with smart positioning
- **Iteration 3**: Action buttons with API integration
- **Iteration 4**: Text replacement with apply/cancel flow

## 🎯 Next Development Session

When resuming development:

1. **Verify Current State**: Test text replacement functionality
2. **Start Iteration 5**: Implement chat interface with conversation history
3. **Consider**: Local storage for chat persistence
4. **Plan**: Message bubble UI components

## 🔧 Environment Variables

### **Backend (.env)**
```
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=us.anthropic.claude-3-7-sonnet-20250219-v1:0
LOG_LEVEL=INFO
```

## 📚 Key Files to Understand

1. **`backend/writers_block_service/api.py`** - Main API endpoints
2. **`extension/src/components/App.jsx`** - Main React component with state management
3. **`extension/src/hooks/useTextSelection.js`** - Text selection logic with range storage
4. **`extension/src/utils/textReplacement.js`** - Text replacement utilities
5. **`extension/src/components/FloatingWindow.jsx`** - Main UI component

This context should provide everything needed to resume development from the current state! 🚀
