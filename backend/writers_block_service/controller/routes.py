"""
HTTP routes for Writers Block Service
Clean API layer with business logic separated to services
"""

import time
from fastapi import APIRouter, HTTPException
from pydantic import ValidationError as PydanticValidationError

from ..models.schemas import ProcessTextRequest, ProcessTextResponse, HealthResponse
from ..services.llm_service import LLMService
from ..core.config import settings
from ..core.logging import cloudwatch_logger
from ..core.exceptions import (
    WritersBlockException, 
    ValidationError,
    get_user_friendly_message
)
from ..utils.helpers import generate_session_id

# Initialize router
router = APIRouter()

# Initialize service
llm_service = LLMService()


@router.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint with service information"""
    return HealthResponse(
        message=f"{settings.APP_NAME} is running",
        version=settings.VERSION,
        status="healthy",
        supported_actions=["grammar_fix", "rephrase"],
        rephrase_options={
            "built_in_tones": ["professional", "casual", "academic", "creative", "technical"],
            "custom_prompts": "Supported with {selected_text} placeholder"
        }
    )


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        message="Service is healthy",
        version=settings.VERSION,
        status="healthy",
        supported_actions=["grammar_fix", "rephrase"],
        rephrase_options={
            "built_in_tones": ["professional", "casual", "academic", "creative", "technical"],
            "custom_prompts": "Supported with {selected_text} placeholder"
        }
    )


@router.post("/api/v1/process-text", response_model=ProcessTextResponse)
async def process_text(request: ProcessTextRequest):
    """
    Process selected text based on structured action
    
    Supported actions:
    - grammar_fix: Fix grammar and spelling errors
    - rephrase: Rewrite text with built-in tone or custom prompt
      - Built-in tones: professional, casual, academic, creative, technical
      - Custom prompts: User-defined templates with {selected_text} placeholder
    """
    # Generate session ID if not provided
    session_id = request.session_id or generate_session_id()
    
    # Start timing for performance logging
    start_time = time.time()
    
    # Log request start (secure logging - no user content)
    custom_prompt = request.parameters.get("custom_prompt")
    cloudwatch_logger.log_request_start(
        session_id=session_id,
        action=request.action,
        text_length=len(request.selected_text),
        has_custom_prompt=bool(custom_prompt),
        prompt_template=custom_prompt if custom_prompt else None
    )
    
    try:
        # Process text using service layer
        processed_text = await llm_service.process_text(
            text=request.selected_text,
            action=request.action,
            parameters=request.parameters,
            session_id=session_id
        )
        
        # Calculate processing time
        processing_time_ms = (time.time() - start_time) * 1000
        
        # Format success message
        if request.action == "grammar_fix":
            message = "Grammar and spelling corrected"
        elif request.action == "rephrase":
            style_name = request.parameters.get("style_name", "")
            if custom_prompt:
                message = f"Text rephrased using '{style_name}' style" if style_name else "Text rephrased with custom style"
            else:
                tone = request.parameters.get("tone", "professional")
                message = f"Text rephrased in {tone} tone"
        else:
            message = "Text processed successfully"
        
        # Log successful completion
        cloudwatch_logger.log_request_success(
            session_id=session_id,
            action=request.action,
            processing_time_ms=processing_time_ms,
            output_length=len(processed_text)
        )
        
        return ProcessTextResponse(
            success=True,
            processed_text=processed_text,
            message=message,
            session_id=session_id
        )
    
    except PydanticValidationError as e:
        # Handle Pydantic validation errors
        error_details = e.errors()[0] if e.errors() else {}
        field = error_details.get('loc', ['unknown'])[-1]
        error_msg = error_details.get('msg', 'Validation failed')
        
        cloudwatch_logger.log_validation_error(
            session_id=session_id,
            validation_field=str(field),
            error_message=error_msg
        )
        
        return ProcessTextResponse(
            success=False,
            processed_text=request.selected_text,
            message=f"Invalid request: {error_msg}",
            session_id=session_id
        )
    
    except ValidationError as e:
        # Handle custom validation errors
        cloudwatch_logger.log_validation_error(
            session_id=session_id,
            validation_field=e.field or "unknown",
            error_message=e.message
        )
        
        return ProcessTextResponse(
            success=False,
            processed_text=request.selected_text,
            message=f"Invalid request: {e.message}",
            session_id=session_id
        )
    
    except WritersBlockException as e:
        # Handle custom service exceptions
        cloudwatch_logger.log_request_error(
            session_id=session_id,
            action=request.action,
            error_type=e.error_code or "unknown",
            error_code=e.error_code
        )
        
        return ProcessTextResponse(
            success=False,
            processed_text=request.selected_text,
            message=get_user_friendly_message(e),
            session_id=session_id
        )
    
    except Exception as e:
        # Handle unexpected errors
        cloudwatch_logger.log_request_error(
            session_id=session_id,
            action=request.action,
            error_type="unexpected_error",
            error_code=type(e).__name__
        )
        
        return ProcessTextResponse(
            success=False,
            processed_text=request.selected_text,
            message="Unable to process text. Please try again.",
            session_id=session_id
        )
