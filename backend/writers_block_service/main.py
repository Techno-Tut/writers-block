"""
FastAPI application entry point for Writers Block Service
Clean application initialization with proper middleware and routing
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
  
from .controller.routes import router
from .core.config import settings
from .core.logging import get_logger

# Configure logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
logger = get_logger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered writing assistant with custom prompt support",
    version=settings.VERSION,
    docs_url="/docs" if settings.is_development else None,  # Disable docs in production
    redoc_url="/redoc" if settings.is_development else None
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router)   
lambda_handler = Mangum(app, lifespan="off")



# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "writers_block_service.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.is_development,
        log_level=settings.LOG_LEVEL.lower()
    )
