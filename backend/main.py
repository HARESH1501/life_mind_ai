"""
LifeMind AI - Main FastAPI Application
Enterprise-grade AI-powered life management platform
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from database import engine, Base
from config import PROJECT_NAME, PROJECT_VERSION, ALLOWED_ORIGINS, API_V1_PREFIX
from routers import auth, expenses, habits, tasks, mood, settings, notifications, analytics, ai
from services.scheduler_service import scheduler_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    logger.info("Starting LifeMind AI application...")
    scheduler_service.start()
    logger.info("Application startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down LifeMind AI application...")
    scheduler_service.stop()
    logger.info("Application shutdown complete")


# Initialize FastAPI app with lifespan
app = FastAPI(
    title=PROJECT_NAME,
    version=PROJECT_VERSION,
    description="AI-powered personal life assistant platform",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": f"{PROJECT_NAME} v{PROJECT_VERSION} Running!",
        "api_version": "v1",
        "scheduler": "running" if scheduler_service.running else "stopped"
    }


@app.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "scheduler": "running" if scheduler_service.running else "stopped"
    }


# Include routers
app.include_router(auth.router, prefix=API_V1_PREFIX)
app.include_router(expenses.router, prefix=API_V1_PREFIX)
app.include_router(habits.router, prefix=API_V1_PREFIX)
app.include_router(tasks.router, prefix=API_V1_PREFIX)
app.include_router(mood.router, prefix=API_V1_PREFIX)
app.include_router(settings.router, prefix=API_V1_PREFIX)
app.include_router(notifications.router, prefix=API_V1_PREFIX)
app.include_router(analytics.router, prefix=API_V1_PREFIX)
app.include_router(ai.router, prefix=API_V1_PREFIX)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)