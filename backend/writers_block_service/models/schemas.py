"""
Pydantic models and schemas for Writers Block Service API
Consolidated models with enhanced validation
"""

from pydantic import BaseModel, validator
from typing import Optional, Dict, Literal, Any


class ProcessTextRequest(BaseModel):
    """Request model for text processing with structured actions"""
    selected_text: str
    action: Literal["grammar_fix", "rephrase"]
    parameters: Optional[Dict[str, str]] = {}
    session_id: Optional[str] = None
    
    @validator('selected_text')
    def validate_selected_text(cls, v):
        if not v or not v.strip():
            raise ValueError('Selected text cannot be empty')
        if len(v) > 10000:  # Reasonable limit for text processing
            raise ValueError('Selected text too long (max 10000 characters)')
        return v
    
    @validator('parameters')
    def validate_rephrase_parameters(cls, v, values):
        if values.get('action') == 'rephrase':
            tone = v.get('tone')
            custom_prompt = v.get('custom_prompt')
            
            # Exactly one of tone or custom_prompt must be provided
            if tone and custom_prompt:
                raise ValueError("Cannot specify both 'tone' and 'custom_prompt' parameters")
            
            if not tone and not custom_prompt:
                raise ValueError("Must specify either 'tone' or 'custom_prompt' parameter for rephrase action")
            
            # Validate custom_prompt if provided
            if custom_prompt:
                if '{selected_text}' not in custom_prompt:
                    raise ValueError("Custom prompt must contain '{selected_text}' placeholder")
                
                if len(custom_prompt) > 2000:
                    raise ValueError("Custom prompt too long (max 2000 characters)")
            
            # Validate built-in tone if provided
            if tone:
                valid_tones = {'professional', 'casual', 'academic', 'creative', 'technical'}
                if tone not in valid_tones:
                    raise ValueError(f"Invalid tone '{tone}'. Valid tones: {', '.join(valid_tones)}")
        
        return v


class ProcessTextResponse(BaseModel):
    """Response model for text processing"""
    success: bool
    processed_text: str
    message: str
    session_id: str


class HealthResponse(BaseModel):
    """Response model for health check endpoints"""
    message: str
    version: str
    status: str
    supported_actions: list
    rephrase_options: Dict[str, Any]


class ErrorResponse(BaseModel):
    """Response model for error cases"""
    success: bool = False
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None
