"""
Simple development scripts
"""

import uvicorn


def dev():
    """Start development server with auto-reload"""
    uvicorn.run(
        "writers_block_service.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )


def start():
    """Start production server"""
    uvicorn.run(
        "writers_block_service.main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )


if __name__ == "__main__":
    dev()
