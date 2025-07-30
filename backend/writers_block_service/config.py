"""
Configuration settings for Writers Block Service
"""

import os


class Settings:
    """Application settings"""
    
    # AWS Configuration
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    
    # Bedrock Configuration
    BEDROCK_MODEL_ID: str = os.getenv(
        "BEDROCK_MODEL_ID", 
        "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
    )
    
    # Application Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    APP_NAME: str = "Writers Block Service"
    VERSION: str = "0.1.0"


# Global settings instance
settings = Settings()
