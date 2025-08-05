"""
Custom CloudWatch logging utility for Writers Block Service
Secure logging that only logs prompts and metadata, never user content
"""

import json
import re
import hashlib
import logging
from datetime import datetime
from typing import Any, Dict, Optional
import boto3
from botocore.exceptions import ClientError

from .config import settings


def sanitize_for_log(value: Any, max_length: int = 100) -> str:
    """
    Sanitize any value for safe CloudWatch logging
    
    Args:
        value: Value to sanitize
        max_length: Maximum length before truncation
        
    Returns:
        Sanitized string safe for logging
    """
    if value is None:
        return "[null]"
    
    # Convert to string
    text = str(value)
    
    # Remove dangerous characters that could break logs
    sanitized = re.sub(r'[\r\n\t\x00-\x1f\x7f-\x9f]', ' ', text)
    
    # Truncate if too long and add hash for debugging
    if len(sanitized) > max_length:
        text_hash = hashlib.sha256(text.encode()).hexdigest()[:8]
        return f"{sanitized[:max_length]}...[hash:{text_hash}]"
    
    return sanitized


class CloudWatchLogger:
    """
    Custom CloudWatch logger for structured, secure logging
    Only logs prompts and metadata, never user content
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.cloudwatch_client = None
        
        if settings.ENABLE_CLOUDWATCH_LOGGING:
            try:
                self.cloudwatch_client = boto3.client('logs', region_name=settings.AWS_REGION)
                self._ensure_log_group_exists()
            except Exception as e:
                self.logger.warning(f"Failed to initialize CloudWatch client: {e}")
    
    def _ensure_log_group_exists(self):
        """Ensure the CloudWatch log group exists"""
        try:
            self.cloudwatch_client.create_log_group(
                logGroupName=settings.CLOUDWATCH_LOG_GROUP
            )
        except ClientError as e:
            if e.response['Error']['Code'] != 'ResourceAlreadyExistsException':
                self.logger.warning(f"Failed to create log group: {e}")
    
    def _create_log_entry(self, event: str, session_id: str, **kwargs) -> Dict[str, Any]:
        """Create structured log entry"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": "INFO",
            "event": event,
            "session_id": sanitize_for_log(session_id, 12),  # Truncated for privacy
            "environment": settings.ENVIRONMENT,
            **kwargs
        }
        return log_entry
    
    def _log_to_cloudwatch(self, log_entry: Dict[str, Any]):
        """Send log entry to CloudWatch"""
        if not self.cloudwatch_client or not settings.ENABLE_CLOUDWATCH_LOGGING:
            # Fallback to standard logging
            self.logger.info(json.dumps(log_entry))
            return
        
        try:
            # Create log stream name with timestamp
            stream_name = f"lambda-{datetime.utcnow().strftime('%Y-%m-%d')}"
            
            # Try to create log stream (ignore if exists)
            try:
                self.cloudwatch_client.create_log_stream(
                    logGroupName=settings.CLOUDWATCH_LOG_GROUP,
                    logStreamName=stream_name
                )
            except ClientError as e:
                if e.response['Error']['Code'] != 'ResourceAlreadyExistsException':
                    raise
            
            # Send log event
            self.cloudwatch_client.put_log_events(
                logGroupName=settings.CLOUDWATCH_LOG_GROUP,
                logStreamName=stream_name,
                logEvents=[{
                    'timestamp': int(datetime.utcnow().timestamp() * 1000),
                    'message': json.dumps(log_entry)
                }]
            )
            
        except Exception as e:
            # Fallback to standard logging if CloudWatch fails
            self.logger.warning(f"CloudWatch logging failed: {e}")
            self.logger.info(json.dumps(log_entry))
    
    def log_request_start(self, session_id: str, action: str, text_length: int, 
                         has_custom_prompt: bool = False, prompt_template: str = None):
        """
        Log request start with safe metadata only
        
        Args:
            session_id: Request session ID
            action: Action type (grammar_fix, rephrase)
            text_length: Length of user text (not the content)
            has_custom_prompt: Whether request uses custom prompt
            prompt_template: Custom prompt template (safe to log)
        """
        log_data = {
            "action": action,
            "text_length": text_length,
            "has_custom_prompt": has_custom_prompt
        }
        
        # Only log prompt templates (safe), never user content
        if has_custom_prompt and prompt_template and settings.LOG_PROMPTS_ONLY:
            log_data["prompt_template"] = sanitize_for_log(prompt_template, 200)
            log_data["prompt_template_hash"] = hashlib.sha256(prompt_template.encode()).hexdigest()[:8]
        
        log_entry = self._create_log_entry("request_start", session_id, **log_data)
        self._log_to_cloudwatch(log_entry)
    
    def log_request_success(self, session_id: str, action: str, processing_time_ms: float, 
                           output_length: int):
        """
        Log successful request completion
        
        Args:
            session_id: Request session ID
            action: Action type
            processing_time_ms: Processing time in milliseconds
            output_length: Length of output text (not the content)
        """
        log_data = {
            "action": action,
            "processing_time_ms": round(processing_time_ms, 2),
            "output_length": output_length,
            "status": "success"
        }
        
        log_entry = self._create_log_entry("request_success", session_id, **log_data)
        self._log_to_cloudwatch(log_entry)
    
    def log_request_error(self, session_id: str, action: str, error_type: str, 
                         error_code: Optional[str] = None):
        """
        Log request error without exposing sensitive data
        
        Args:
            session_id: Request session ID
            action: Action type
            error_type: Type of error (validation, processing, service)
            error_code: Optional error code for debugging
        """
        log_data = {
            "action": action,
            "error_type": error_type,
            "status": "error"
        }
        
        if error_code:
            log_data["error_code"] = sanitize_for_log(error_code, 50)
        
        log_entry = self._create_log_entry("request_error", session_id, level="ERROR", **log_data)
        self._log_to_cloudwatch(log_entry)
    
    def log_validation_error(self, session_id: str, validation_field: str, error_message: str):
        """
        Log validation errors for debugging
        
        Args:
            session_id: Request session ID
            validation_field: Field that failed validation
            error_message: Validation error message (safe to log)
        """
        log_data = {
            "validation_field": validation_field,
            "error_message": sanitize_for_log(error_message, 100),
            "status": "validation_error"
        }
        
        log_entry = self._create_log_entry("validation_error", session_id, level="WARNING", **log_data)
        self._log_to_cloudwatch(log_entry)


# Global logger instance
cloudwatch_logger = CloudWatchLogger()


def get_logger(name: str) -> logging.Logger:
    """Get configured standard logger for fallback"""
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(getattr(logging, settings.LOG_LEVEL))
    return logger
