# Product Spec

It is a writer assists chrome extension based agent that can help

1. Review documents
2. Get Tone and analysis and understand any gaps
3. Give suggestion and edit specific section of the document instead of replacing or rewriting the whole text which could make it tough for human to review in a text editor

**Pilot Support**: Initial implementation targets Salesforce Quip documents

## Feature 1: Text Selection & AI Processing:
User selects text and gets a hover UI with an input field and few prepopulated options like rephrase, etc.

### UI Behavior:
- Hover UI appears with 0.5 second delay after text selection
- Positions below or above the selection (wherever there is space)
- Closes when user deselects text or clicks anywhere else
- If user selects new text while UI is open, it updates with the new selection

### Core Actions:
- **Grammar & Spelling Fix**: Immediately triggers agent to correct grammatical errors and spelling mistakes
- **Rephrase**: Provides tone selection (Professional, Casual, Academic, Creative, Technical) for contextual rephrasing
- **Custom Rewrite**: User-defined rewrite styles with personalized prompts (see Feature 3)

### Text Replacement System:
- **Reliable Integration**: Uses `document.execCommand('insertText')` for maximum compatibility with web editors
- **Selection Preservation**: Stores and restores text selection ranges to handle UI interactions
- **Undo Support**: Maintains browser's native undo/redo functionality (Ctrl+Z/Cmd+Z)
- **Apply/Cancel Flow**: Shows original vs processed text comparison with clear action buttons
- **Success Feedback**: Confirmation messages with auto-close functionality

### Chat Interface Design:
- **Visual Style**: Glassmorphism/translucent design with backdrop blur effect
- **Initial State**: Compact floating window (280px wide) with semi-transparent background
- **Chat Mode**: Expands vertically when user types custom prompts (max 400px height)
- **Tool Call Confirmation**: When agent suggests text replacement, shows:
  - Agent message explaining the action
  - Preview box with new text (glass effect with subtle border)
  - [Apply] [Refine] [Cancel] buttons with glass styling
- **Post-Action**: Shows brief summary after successful application, then auto-collapses
- **Scrolling**: For longer conversations within max height limit
- **Glass Effects**: 
  - Semi-transparent background with backdrop blur
  - Subtle borders and shadows
  - Maintains readability while blending with document background

### Agent Context & Analysis:
- **Document Context**: Agent reads the complete Quip document to understand overall tone, style, and context
- **Tone Matching**: Automatically matches the document's existing tone when rephrasing or making changes
- **Contextual Processing**: Uses surrounding text and Quip document structure to make appropriate suggestions
- **Consistency Maintenance**: Ensures all changes align with the document's writing style and voice
- **Quip Integration**: Leverages Quip's contenteditable structure and auto-save mechanisms

### User Flow:
User selects text and agent analyzes both the selection and complete document context. Agent can do analysis on top and return back action. In case of tool call for replacing the text, the user confirms in UI and replaces the selected text with the new text.

## Feature 2: Deep Research Agent (To Be Discussed - Not for MVP):
**Status**: Future feature requiring clarification and detailed specification

### Concept Overview:
Extends core text processing capabilities to include research capabilities for enhancing selected text with external information and data sources.

### Areas Requiring Discussion:
- **Research Sources**: What external data sources to integrate (web search, academic databases, company knowledge bases)
- **Research Scope**: How much context and depth of research to provide
- **Information Integration**: How to seamlessly blend research findings with selected text
- **Fact Verification**: Ensuring accuracy and reliability of research information
- **User Control**: How users specify research parameters and preferences
- **Performance**: Balancing research depth with response time
- **Cost Implications**: External API costs for research capabilities

### Placeholder for Future Specification:
This feature will be fully specified after MVP completion and user feedback on core functionality.

## Feature 3: Conversational Chat Interface:
Transform single-interaction model into conversational AI writing assistant.

### Chat Capabilities:
- **Message History**: Persistent conversation during session with message bubbles
- **Follow-up Interactions**: Users can refine, modify, or ask follow-up questions about text changes
- **Context Preservation**: AI maintains context of previous interactions and text selections
- **Multiple Suggestions**: Users can request different approaches to the same text
- **Inline Apply**: Apply buttons on individual AI messages containing text changes

### Chat Flow:
1. **Initial Selection**: User selects text → Chat window appears with context
2. **AI Processing**: User chooses action → AI responds in chat bubble format
3. **Conversation**: User can continue with "Make it more formal", "Add more detail", etc.
4. **Selective Application**: Apply specific AI suggestions while continuing conversation
5. **Session Persistence**: Chat history maintained until window is closed

### Technical Implementation:
- **Message Storage**: Local storage for conversation persistence
- **Session Management**: Maintain conversation context across interactions
- **Bubble UI**: Distinct styling for user messages vs AI responses
- **Scroll Management**: Auto-scroll to new messages with smooth animations

## Feature 4: Custom Rewrite Styles (Power User Feature): ✅ COMPLETE
Allow users to create personalized rewrite styles with custom prompts for unlimited extensibility.

### Implementation Status: COMPLETE ✅
**Completed**: August 4, 2025
**Architecture**: Modern React with custom hooks, centralized configuration, and design system
**Status**: Production-ready with professional UI/UX and comprehensive error handling

### Core Concept:
Transform the extension from fixed-function tool into customizable AI writing platform where users create their own rewrite styles with custom prompts, enabling industry-specific and role-based workflows.

### ✅ Implemented Features:

#### **Custom Style Creation & Management:**
- **Professional Settings Page**: Dedicated Chrome extension settings page with Writers Block branding
- **Style Library Interface**: Complete CRUD operations with table layout and user-friendly messaging
- **Form Validation**: Real-time validation with character limits and required field checking
- **Template System**: Custom prompts with `{selected_text}` placeholder for dynamic text insertion
- **Persistent Storage**: Chrome storage.local integration with error handling and data validation

#### **Seamless UI Integration:**
- **Enhanced Dropdown**: Custom styles integrated alongside built-in options with visual distinction
- **Settings Access**: One-click settings access via ⚙️ button in floating window header
- **Visual Hierarchy**: Custom styles marked with 📝 icons and separated from built-in styles
- **Loading States**: Professional loading indicators and error handling throughout

#### **Modern Architecture:**
- **Custom Hooks**: Separated business logic with `useStyleForm`, `useStyleSelection`, `useCustomRewriteStyles`
- **Reusable Components**: `FormField`, `StylePreview`, `LoadingSpinner` for consistency
- **Design System**: CSS variables for colors, spacing, typography, and component dimensions
- **Error Handling**: Centralized error management with user-friendly messages
- **Configuration**: Centralized constants, validation limits, and API endpoints

### ✅ API Integration Design:
**Backend Integration Strategy**: Custom styles leverage existing `rephrase` action with template resolution

#### **API Request Structure:**
```json
{
  "selected_text": "Your request has been denied.",
  "action": "rephrase",
  "parameters": {
    "tone": "professional",                    // For built-in styles
    "custom_prompt": "template with {selected_text}",  // For custom styles
    "style_name": "Empathetic Support"         // For tracking/logging
  }
}
```

#### **Template Processing:**
- **Frontend Resolution**: Templates stored client-side with `{selected_text}` placeholder
- **Backend Replacement**: Backend replaces placeholder and processes as instruction
- **Security Benefits**: Separates user content from template for prompt injection detection
- **Efficiency**: Avoids text duplication in API payload

### ✅ Example Custom Styles:
```
Resume Bullet Enhancer:
"Transform these bullet points into achievement-focused resume bullets that highlight impact and results. Text to enhance: {selected_text}
Requirements: Start with action verbs, include metrics, focus on outcomes"

Meeting Notes → Action Items:
"Convert these meeting notes into clear, actionable items with owners and deadlines. Notes: {selected_text}
Format: [Action] - [Owner] - [Due Date]"

Technical → Executive Summary:
"Translate this technical content into executive-friendly language focusing on business impact. Content: {selected_text}"
```

### ✅ User Experience Features:
- **Guided Onboarding**: "What are Custom Styles?" explanation with before/after examples
- **Professional Branding**: Writers Block header with logo, title, subtitle, and version badge
- **Intuitive Workflow**: Clear progression from understanding → creation → usage
- **Visual Feedback**: Real-time character counts, validation states, and success confirmations
- **Responsive Design**: Mobile-friendly layouts with proper spacing and touch targets

### ✅ Technical Implementation:
- **Data Model**: Structured custom style objects with validation and metadata
- **Storage Strategy**: Chrome storage.local for persistence without backend dependency
- **API Integration**: Custom prompts sent via existing `rephrase` endpoint with template parameter
- **UI Integration**: Enhanced dropdown component with custom style support and loading states
- **Build System**: Webpack configuration for settings page bundle and web accessible resources

### ✅ Completed MVP Scope:
- ✅ **Custom Style Creation**: Professional form interface with validation
- ✅ **Settings Management**: Complete CRUD operations with confirmation dialogs
- ✅ **UI Integration**: Seamless dropdown integration with visual distinction
- ✅ **Chrome Storage**: Persistent storage with error handling and data validation
- ✅ **Template Processing**: Dynamic text insertion with placeholder replacement
- ✅ **Professional Polish**: Modern React architecture with design system
- ✅ **User Guidance**: Clear explanations and examples for new users
- ✅ **Error Handling**: Comprehensive error management with user-friendly messages

### 🔄 Future Enhancements (Post-MVP):
- ❌ **Advanced Organization**: Categories, favorites, search functionality
- ❌ **Style Sharing**: Export/import capabilities and marketplace
- ❌ **Usage Analytics**: Style usage tracking and recommendations
- ❌ **Collaborative Features**: Team style libraries and sharing
- ❌ **AI Assistance**: Style suggestion and optimization features


## Technical Architecture:

### Backend:
- **Framework**: FastAPI with Python 3.12+ and clean architecture
- **AI Model**: Claude 3.7 Sonnet via AWS Bedrock
- **Package Management**: uv for modern Python dependency management
- **API Design**: RESTful endpoints with structured request/response models
- **Architecture**: Refactored with separated concerns (Controller → Service → LLM layers)
- **Logging**: Custom CloudWatch logging with security-first approach (prompt-only, no user content)
- **Lambda Optimization**: Mangum adapter with module-level initialization for optimal performance

### API Structure:
- **Single Endpoint**: `/api/v1/process-text` handles all text processing actions
- **Action Types**: `grammar_fix`, `rephrase` with parameter-based customization
- **Custom Style Support**: Templates sent as `custom_prompt` parameter with `{selected_text}` placeholder
- **Built-in Styles**: Simple tone keywords (`professional`, `casual`, `academic`, `creative`, `technical`)
- **Template Resolution**: Backend replaces placeholders and processes as unified instructions
- **Security**: Input sanitization, secure logging, generic error messages for users

### API Request Format:
```json
{
  "selected_text": "user selected text",
  "action": "grammar_fix" | "rephrase",
  "parameters": {
    "tone": "professional",                    // For built-in styles
    "custom_prompt": "template with {selected_text}",  // For custom styles  
    "style_name": "Custom Style Name"          // For logging/tracking
  },
  "session_id": "optional_session_id"
}
```

### Secure Logging Architecture:
- **CloudWatch Integration**: Custom log groups for structured application logging
- **Security-First**: Only logs prompts, metadata, and processing metrics - never user content
- **Lambda-Optimized**: Efficient logging designed for serverless environments
- **Sanitized Inputs**: All log entries sanitized to prevent log injection attacks
- **Structured Format**: JSON logging with correlation IDs for debugging

### Frontend:
- **Framework**: React 18 with functional components and hooks
- **Build System**: Webpack 5 with Babel for Chrome extension compatibility
- **State Management**: Custom React hooks for clean separation of concerns
- **Styling**: Component-based CSS with glassmorphism design system
- **Architecture**: Modern patterns with centralized configuration and reusable components

### Chrome Extension:
- **Manifest V3**: Modern Chrome extension architecture
- **Content Scripts**: React-based floating UI injected into web pages
- **Storage**: Chrome storage APIs for settings and custom styles persistence
- **Permissions**: Minimal required permissions for text processing and storage
- **Settings Page**: Dedicated settings interface with professional branding

### Key Technical Decisions:
- **Text Replacement**: `document.execCommand('insertText')` for maximum editor compatibility
- **Selection Management**: DOM Range API with cloning for reliable text selection handling
- **Event Handling**: Proper event bubbling prevention and UI interaction management
- **Storage Strategy**: Client-side persistence using Chrome storage APIs (no backend database)
- **Template Processing**: Frontend stores templates, backend resolves placeholders for security
- **API Unification**: Single `rephrase` action handles both built-in tones and custom prompts

## Development Phases:

### Phase 1: Core Functionality ✅
- Text selection detection and floating window
- Grammar fix and rephrase with tone selection
- Text replacement with apply/cancel flow
- Basic error handling and success feedback

### Phase 2: Enhanced UX ✅
- Improved floating window positioning
- Loading states and smooth animations
- Debug panel for development
- Robust event handling and selection preservation

### Phase 3: API Integration ✅
- FastAPI backend with Claude integration
- Structured API calls with session management
- Error handling and retry logic
- Text comparison and result display

### Phase 4: Text Replacement ✅
- Reliable text replacement using execCommand
- Selection range storage and restoration
- Apply/cancel confirmation flow
- Native undo support preservation

### Phase 5: Custom Rewrite Styles ✅
- Custom style creation and management interface
- Chrome storage integration with persistence
- Enhanced dropdown with custom styles
- Template system with placeholder replacement
- Professional settings page with branding
- Modern React architecture with design system

### Phase 6: Backend Integration & Refactoring ✅
- Backend support for custom prompt processing
- Template placeholder resolution
- Enhanced validation and error handling
- Unified API design for built-in and custom styles
- **Complete Backend Refactoring**: Clean architecture with separated concerns
- **Secure CloudWatch Logging**: Production-ready logging without user data exposure
- **Lambda Optimization**: Optimized for serverless deployment with best practices

### Phase 7: Chat Interface (Future)
- Conversational message bubbles
- Chat history and context preservation
- Follow-up interactions and refinements
- Session-based conversation management

### Phase 8: Glassmorphism Polish (Future)
- Beautiful glass UI effects with backdrop blur
- Smooth animations and transitions
- Responsive design optimization
- Final visual polish and accessibility

## Success Metrics:
- **User Engagement**: Text selections processed per session
- **Feature Adoption**: Usage distribution across grammar fix, rephrase, and custom styles
- **Text Replacement Success**: Apply vs cancel rates for processed text
- **Custom Style Creation**: Average custom styles created per power user
- **Session Duration**: Time spent in conversational interactions
- **User Retention**: Return usage patterns and feature stickiness

### Additional Prepopulated Options:
- **Research & Enhance**: Researches the topic and adds relevant information, statistics, or examples
- **Fact Check**: Verifies claims in the selected text and provides sources
- **Add Context**: Finds background information to make the text more comprehensive

### Research Flow:
- Agent identifies research needs from selected text
- Performs web search and information gathering
- Presents findings in chat interface
- Offers to enhance original text with research findings
- Shows sources and allows user to verify before applying changes

### Scalable Design Considerations:
- **Modular Action System**: Each feature (grammar, rephrase, research) as separate action groups
- **Extensible UI**: Chat interface can handle any number of action types
- **Plugin Architecture**: Easy to add new prepopulated options and corresponding agent capabilities
- **Context Preservation**: Agent maintains conversation history for follow-up actions 