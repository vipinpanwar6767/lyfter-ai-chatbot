import os
from pathlib import Path
from dotenv import load_dotenv


# Locate the backend directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(BASE_DIR / ".env")


class Settings:

    def __init__(self):

        # LLM configuration
        self.llm_api_keys = [
            key.strip()
            for key in os.getenv("LLM_API_KEYS", "").split(",")
            if key.strip()
        ]

        self.llm_model = os.getenv(
            "LLM_MODEL",
            "gemini/gemini-3.5-flash-lite"
        )

        self.llm_api_base = os.getenv(
            "LLM_API_BASE",
            "https://generativelanguage.googleapis.com/v1beta"
        )

        # Database configuration
        self.database_url = os.getenv(
            "DATABASE_URL",
            "sqlite:///./data/app.db"
        )

        # CORS configuration
        self.allowed_origins = [
            origin.strip()
            for origin in os.getenv(
                "ALLOWED_ORIGINS",
                "http://localhost:5173,http://localhost:3000"
            ).split(",")
            if origin.strip()
        ]

        # Failure simulation
        self.enable_failure_simulation = (
            os.getenv(
                "ENABLE_FAILURE_SIMULATION",
                "false"
            ).lower() == "true"
        )

        # Default system prompt
        self.default_system_prompt = os.getenv(
            "DEFAULT_SYSTEM_PROMPT",
            "You are a helpful AI assistant."
        )


# Shared configuration object
settings = Settings()