# Writers Block Service Backend

Backend implementation for Feature 1: Text Selection with structured actions and master system prompt

## Current Implementation

FastAPI backend that processes text using direct Amazon Bedrock Claude API calls with a structured action-based approach.

### Supported Features
- **Grammar Fix**: Corrects grammatical errors and spelling mistakes
- **Rephrase**: Rewrites text in specified tone (professional, casual, academic, etc.)

## Quick Start

### 1. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your AWS region and model preferences
# The application will use your AWS profile credentials
```

### 2. Install Dependencies
```bash
uv sync
```

### 3. Run the Server
```bash
# Development server with auto-reload
uv run dev

# Or production server
uv run start
```

The API will be available at `http://localhost:8000`

## API Usage

### Process Text Endpoint
```
POST /api/v1/process-text
```

**Grammar Fix Request:**
```json
{
  "selected_text": "This sentence have errors",
  "action": "grammar_fix",
  "parameters": {}
}
```

**Rephrase Request:**
```json
{
  "selected_text": "Hey there",
  "action": "rephrase",
  "parameters": {
    "tone": "professional"
  }
}
```

**Response:**
```json
{
  "success": true,
  "processed_text": "This sentence has errors",
  "message": "Fixed grammar and spelling errors",
  "session_id": "session_abc123"
}
```

### Supported Actions

| Action | Description | Parameters |
|--------|-------------|------------|
| `grammar_fix` | Fix grammar and spelling errors | None |
| `rephrase` | Rewrite text in specified tone | `tone`: professional, casual, academic, creative, technical |

## Architecture

```
Chrome Extension → FastAPI → Amazon Bedrock Claude (with Master System Prompt)
     ↓
Client-side Chat Storage
(UI Display Only)
```

### Key Improvements

**Structured Actions:**
- No more prompt parsing - explicit action types
- Type-safe with Pydantic Literal types
- Consistent API interface

**Master System Prompt:**
- Single, comprehensive system prompt for all actions
- Consistent LLM behavior across requests
- Better performance and reliability

**Generic Processing:**
- `process_text()` method handles all action types
- Easy to extend with new actions
- Centralized prompt construction

## Components

- **FastAPI App** (`api.py`): Main web server with structured action handling
- **LLM Client** (`llm_client.py`): Master system prompt + direct Bedrock calls
- **Models** (`models.py`): Structured request/response with Literal action types
- **Utils** (`utils.py`): Session management and message formatting
- **Config** (`config.py`): Environment-based configuration

## Directory Structure
```
backend/
├── writers_block_service/
│   ├── __init__.py
│   ├── api.py              # FastAPI routes with structured actions
│   ├── models.py           # Pydantic models with Literal types
│   ├── llm_client.py       # Master system prompt + Bedrock client
│   ├── config.py           # Configuration
│   └── utils.py            # Helper functions
├── run.py                  # Development server
├── .env.example            # Environment template
├── pyproject.toml          # Dependencies
└── README.md
```

## Master System Prompt

The LLM client uses a comprehensive system prompt that defines all supported actions:

```
You are a writing assistant specialized in Salesforce Quip documents. 

Based on the action requested, process the text accordingly:

GRAMMAR_FIX: Fix grammar and spelling errors while preserving the original meaning and style.
REPHRASE: Rewrite the text in the specified tone while maintaining the original meaning.

Always return only the processed text without any additional explanations.
```

## Development

### Testing the API
```bash
# Health check
curl http://localhost:8000/health

# Grammar fix
curl -X POST http://localhost:8000/api/v1/process-text \
  -H "Content-Type: application/json" \
  -d '{
    "selected_text": "This have errors",
    "action": "grammar_fix"
  }'

# Rephrase
curl -X POST http://localhost:8000/api/v1/process-text \
  -H "Content-Type: application/json" \
  -d '{
    "selected_text": "Hey there",
    "action": "rephrase",
    "parameters": {"tone": "professional"}
  }'
```

### Adding New Actions
1. **Add action to Literal type** in `models.py`
2. **Update master system prompt** in `llm_client.py`
3. **Add action handling** in `api.py`
4. **Add message formatting** in `utils.py`

Example:
```python
# models.py
action: Literal["grammar_fix", "rephrase", "summarize"]

# llm_client.py
SUMMARIZE: Create a concise summary of the text while preserving key information.

# api.py
elif request.action == "summarize":
    processed_text = await llm_client.process_text(
        request.selected_text, 
        "summarize"
    )
```

## Benefits of Structured Approach

✅ **Type Safety** - Explicit action types prevent invalid requests  
✅ **Consistency** - Master system prompt ensures reliable LLM behavior  
✅ **Extensibility** - Easy to add new actions without breaking changes  
✅ **Performance** - No prompt parsing overhead  
✅ **Maintainability** - Clear separation between actions and parameters  
✅ **Testing** - Predictable inputs and outputs  

## Future Extensions

This structured foundation supports:
- **Agent-based processing** (replace LLMClient with AgentClient)
- **Document context analysis** (add document parameter)
- **Research capabilities** (new action types)
- **Advanced conversation management** (session-based context)

The API interface remains stable, making migration seamless.
