"""
Writers Block Service - AI-powered writing assistant
Refactored with clean architecture and secure CloudWatch logging
"""

__version__ = "0.1.0"
__author__ = "Writers Block Team"
__description__ = "AI-powered writing assistant with custom prompt support"

# Import main components for easy access
from .core.config import settings
from .main import app

__all__ = ["app", "settings"]
