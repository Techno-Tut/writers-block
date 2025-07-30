"""
Development server runner for Writers Block Service
"""

import uvicorn
from writers_block_service.api import app

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
