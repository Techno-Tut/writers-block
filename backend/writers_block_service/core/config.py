"""
Enhanced configuration settings for Writers Block Service
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings with CloudWatch logging configuration"""
    
    # AWS Configuration
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    
    # Bedrock Configuration
    BEDROCK_MODEL_ID: str = os.getenv(
        "BEDROCK_MODEL_ID", 
        "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
    )
    
    # Application Configuration
    APP_NAME: str = "Writers Block Service"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Logging Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    CLOUDWATCH_LOG_GROUP: str = os.getenv(
        "CLOUDWATCH_LOG_GROUP", 
        "/aws/lambda/writers-block-service/application"
    )
    ENABLE_CLOUDWATCH_LOGGING: bool = os.getenv("ENABLE_CLOUDWATCH_LOGGING", "true").lower() == "true"
    LOG_PROMPTS_ONLY: bool = os.getenv("LOG_PROMPTS_ONLY", "true").lower() == "true"
    
    # Security Configuration
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",")
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment"""
        return self.ENVIRONMENT.lower() == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development environment"""
        return self.ENVIRONMENT.lower() == "development"


# Global settings instance
settings = Settings()
