"""
Pydantic models for Writers Block Service API
"""

from pydantic import BaseModel
from typing import Optional, Dict, Literal


class ProcessTextRequest(BaseModel):
    """Request model for text processing with structured actions"""
    selected_text: str
    action: Literal["grammar_fix", "rephrase"]
    parameters: Optional[Dict[str, str]] = {}
    session_id: Optional[str] = None


class ProcessTextResponse(BaseModel):
    """Response model for text processing"""
    success: bool
    processed_text: str
    message: str
    session_id: str
