"""
FastAPI application entry point for Writers Block Service
Clean application initialization with proper middleware and routing
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

# Application startup event
@app.on_event("startup")
async def startup_event():
    """Application startup tasks"""
    logger.info(f"Starting {settings.APP_NAME} v{settings.VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"CloudWatch logging: {'enabled' if settings.ENABLE_CLOUDWATCH_LOGGING else 'disabled'}")

# Application shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown tasks"""
    logger.info(f"Shutting down {settings.APP_NAME}")


# Optimized Lambda handler - created at module level for reuse
lambda_handler = None
try:
    from mangum import Mangum
    # Create handler once at module level (not per invocation)
    lambda_handler = Mangum(app, lifespan="off")
except ImportError:
    # Mangum not available (skip Lambda handler)
    pass

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
