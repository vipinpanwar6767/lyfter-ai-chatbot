from app.routes.chat import router as chat_router
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db, check_db


# Application startup and shutdown lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):

    # Startup operations
    init_db()

    print("Database initialized successfully")

    yield

    # Shutdown operations
    print("Application shutting down")


# Initialize FastAPI application
app = FastAPI(
    title="Lyfter AI Chatbot API",
    description="LLM chatbot with persistent memory, caching and API key failover.",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(chat_router)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Root endpoint
@app.get("/")
def root():

    return {
        "message": "Welcome to Lyfter AI Chatbot API"
    }


# Health check endpoint
@app.get("/health")
def health():

    try:
        if not check_db():
            raise RuntimeError("Database unavailable")

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable"
        )

    return {
        "status": "ok"
    }