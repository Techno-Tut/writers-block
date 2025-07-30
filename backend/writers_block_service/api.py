"""
FastAPI application for Writers Block Service with structured actions
"""

import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import ProcessTextRequest, ProcessTextResponse
from .llm_client import LLMClient
from .utils import generate_session_id, format_action_message
from .config import settings

# Configure logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered writing assistant for Salesforce Quip with structured actions",
    version=settings.VERSION
)

# Add CORS middleware for Chrome extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM client
llm_client = LLMClient()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"{settings.APP_NAME} is running",
        "version": settings.VERSION,
        "supported_actions": ["grammar_fix", "rephrase"]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "supported_actions": ["grammar_fix", "rephrase"]
    }


@app.post("/api/v1/process-text", response_model=ProcessTextResponse)
async def process_text(request: ProcessTextRequest):
    """
    Process selected text based on structured action
    
    Supported actions:
    - grammar_fix: Fix grammar and spelling errors
    - rephrase: Rewrite text in specified tone (parameters: {"tone": "professional"})
    """
    # Generate session ID if not provided
    session_id = request.session_id or generate_session_id()
    
    logger.info(f"Processing request - Session: {session_id}, Action: {request.action}, Parameters: {request.parameters}")
    
    try:
        # Process text using structured action
        if request.action == "grammar_fix":
            processed_text = await llm_client.fix_grammar(request.selected_text)
            
        elif request.action == "rephrase":
            tone = request.parameters.get("tone", "professional")
            processed_text = await llm_client.rephrase_text(request.selected_text, tone)
            
        else:
            # This shouldn't happen due to Literal type, but handle gracefully
            raise ValueError(f"Unsupported action: {request.action}")
        
        # Format response message
        message = format_action_message(request.action, request.parameters)
        
        logger.info(f"Successfully processed text - Session: {session_id}, Action: {request.action}")
        
        return ProcessTextResponse(
            success=True,
            processed_text=processed_text,
            message=message,
            session_id=session_id
        )
    
    except ValueError as e:
        logger.error(f"Invalid request - Session: {session_id}, Error: {str(e)}")
        
        return ProcessTextResponse(
            success=False,
            processed_text=request.selected_text,
            message=f"Invalid request: {str(e)}",
            session_id=session_id
        )
    
    except Exception as e:
        logger.error(f"Error processing text - Session: {session_id}, Error: {str(e)}")
        
        return ProcessTextResponse(
            success=False,
            processed_text=request.selected_text,
            message=f"Processing failed: {str(e)}",
            session_id=session_id
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
