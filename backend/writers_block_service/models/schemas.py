"""
Pydantic models and schemas for Writers Block Service API
Consolidated models with enhanced validation
"""

from pydantic import BaseModel, validator
from typing import Optional, Dict, Literal, Any
import uuid


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


class FeedbackRequest(BaseModel):
    """Request model for user feedback submission"""
    type: Literal["general", "bug", "feature", "improvement"]
    rating: int
    message: Optional[str] = None
    email: Optional[str] = None
    allow_contact: bool = False
    extension_version: Optional[str] = None
    user_agent: Optional[str] = None
    session_id: Optional[str] = None

    @validator('rating')
    def validate_rating(cls, v):
        if not 1 <= v <= 5:
            raise ValueError('Rating must be between 1 and 5')
        return v

    @validator('message')
    def validate_message(cls, v):
        if v and len(v.strip()) > 2000:
            raise ValueError('Feedback message too long (max 2000 characters)')
        return v.strip() if v else None

    @validator('email')
    def validate_email(cls, v, values):
        if values.get('allow_contact') and not v:
            raise ValueError('Email is required when allowing contact')
        if v and '@' not in v:
            raise ValueError('Invalid email format')
        return v


class FeedbackResponse(BaseModel):
    """Response model for feedback submission"""
    success: bool
    message: str
    feedback_id: str
