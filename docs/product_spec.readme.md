# Product Spec

It is a writer assists chrome extension based agent that can help

1. Review documents
2. Get Tone and analysis and understand any gaps
3. Give suggestion and edit specific section of the document instead of replacing or rewriting the whole text which could make it tough for human to review in a text editor

**Pilot Support**: Initial implementation targets Salesforce Quip documents

## Feature 1: Text Selection:
User selects text and gets a hover UI with an input field and few prepopulated options like rephrase, etc.

### UI Behavior:
- Hover UI appears with 0.5 second delay after text selection
- Positions below or above the selection (wherever there is space)
- Closes when user deselects text or clicks anywhere else
- If user selects new text while UI is open, it updates with the new selection

### Prepopulated Options:
- **Grammar & Spelling Fix**: Immediately triggers agent to correct grammatical errors and spelling mistakes
- **Rephrase**: Fills input field with "Rephrase in [tone]" text for user to specify tone and modify if needed

### Chat Interface Design:
- **Visual Style**: Glassmorphism/translucent design with backdrop blur effect
- **Initial State**: Compact floating window (200px wide) with semi-transparent background
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

## Feature 2: Research (Future Extension):
Extends Feature 1 to include research capabilities for enhancing selected text with external information.

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