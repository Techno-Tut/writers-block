"""
Helper utilities for Writers Block Service
Simple utility functions without complex session management
"""

import uuid
import re
from typing import Optional


def generate_session_id() -> str:
    """
    Generate unique session ID for request correlation
    
    Returns:
        Unique session ID string
    """
    return f"session_{uuid.uuid4().hex[:8]}"


def validate_session_id(session_id: str) -> bool:
    """
    Validate session ID format
    
    Args:
        session_id: Session ID to validate
        
    Returns:
        True if valid format, False otherwise
    """
    if not session_id:
        return False
    
    # Check format: session_xxxxxxxx (8 hex characters)
    pattern = r'^session_[a-f0-9]{8}$'
    return bool(re.match(pattern, session_id))


def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """
    Truncate text to specified length with suffix
    
    Args:
        text: Text to truncate
        max_length: Maximum length before truncation
        suffix: Suffix to add when truncated
        
    Returns:
        Truncated text with suffix if needed
    """
    if not text or len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix


def clean_whitespace(text: str) -> str:
    """
    Clean excessive whitespace from text
    
    Args:
        text: Text to clean
        
    Returns:
        Text with normalized whitespace
    """
    if not text:
        return text
    
    # Replace multiple whitespace with single space
    cleaned = re.sub(r'\s+', ' ', text.strip())
    return cleaned


def extract_error_info(error: Exception) -> dict:
    """
    Extract safe error information for logging
    
    Args:
        error: Exception instance
        
    Returns:
        Dictionary with safe error information
    """
    return {
        "error_type": type(error).__name__,
        "error_message": str(error)[:200],  # Truncate long messages
        "has_args": bool(error.args)
    }
