"""
Custom exceptions for Writers Block Service
"""

from typing import Optional, Dict, Any


class WritersBlockException(Exception):
    """Base exception for Writers Block service"""
    
    def __init__(self, message: str, error_code: Optional[str] = None, 
                 details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(WritersBlockException):
    """Validation related errors"""
    
    def __init__(self, message: str, field: Optional[str] = None, **kwargs):
        self.field = field
        super().__init__(message, error_code="VALIDATION_ERROR", **kwargs)


class LLMServiceError(WritersBlockException):
    """LLM service related errors"""
    
    def __init__(self, message: str, **kwargs):
        super().__init__(message, error_code="LLM_SERVICE_ERROR", **kwargs)


class ProcessingError(WritersBlockException):
    """Text processing related errors"""
    
    def __init__(self, message: str, **kwargs):
        super().__init__(message, error_code="PROCESSING_ERROR", **kwargs)


class ConfigurationError(WritersBlockException):
    """Configuration related errors"""
    
    def __init__(self, message: str, **kwargs):
        super().__init__(message, error_code="CONFIGURATION_ERROR", **kwargs)


# User-friendly error messages (safe to expose to users)
USER_ERROR_MESSAGES = {
    "VALIDATION_ERROR": "Invalid request parameters",
    "LLM_SERVICE_ERROR": "Unable to process text. Please try again.",
    "PROCESSING_ERROR": "Text processing failed. Please try again.",
    "CONFIGURATION_ERROR": "Service temporarily unavailable",
    "UNKNOWN_ERROR": "An unexpected error occurred. Please try again."
}


def get_user_friendly_message(error: Exception) -> str:
    """
    Get user-friendly error message that's safe to expose
    
    Args:
        error: Exception instance
        
    Returns:
        Safe error message for users
    """
    if isinstance(error, WritersBlockException):
        return USER_ERROR_MESSAGES.get(error.error_code, USER_ERROR_MESSAGES["UNKNOWN_ERROR"])
    
    # For any other exception, return generic message
    return USER_ERROR_MESSAGES["UNKNOWN_ERROR"]
