"""
Configuration management for LifeMind AI Backend
Handles environment variables, database config, and app settings
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG = ENVIRONMENT == "development"

# Database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./lifemind.db"
)

# JWT
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "your-secret-key-change-in-production"
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# API
API_V1_PREFIX = "/api/v1"
PROJECT_NAME = "LifeMind AI"
PROJECT_VERSION = "1.0.0"

# CORS
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

# AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# Pagination
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# ============ EMAIL CONFIGURATION ============
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", "noreply@lifemind.ai")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "LifeMind AI")

# Email Features
ENABLE_EMAIL_NOTIFICATIONS = os.getenv("ENABLE_EMAIL_NOTIFICATIONS", "true").lower() == "true"
ENABLE_HABIT_REMINDERS = os.getenv("ENABLE_HABIT_REMINDERS", "true").lower() == "true"
ENABLE_TASK_REMINDERS = os.getenv("ENABLE_TASK_REMINDERS", "true").lower() == "true"
ENABLE_MEETING_REMINDERS = os.getenv("ENABLE_MEETING_REMINDERS", "true").lower() == "true"
ENABLE_DAILY_SUMMARY = os.getenv("ENABLE_DAILY_SUMMARY", "true").lower() == "true"

# ============ SCHEDULER CONFIGURATION ============
SCHEDULER_ENABLED = os.getenv("SCHEDULER_ENABLED", "true").lower() == "true"
SCHEDULER_TIMEZONE = os.getenv("SCHEDULER_TIMEZONE", "UTC")

# Email validation
SMTP_CONFIGURED = bool(SMTP_USER and SMTP_PASSWORD)
