"""
Mood & Wellness API routes
Handles mood tracking and wellness analytics
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from models import User
from schemas import MoodEntryCreate, MoodEntryResponse
from auth import get_current_user, get_db
import crud

router = APIRouter(prefix="/mood", tags=["mood"])


@router.post("", response_model=MoodEntryResponse, status_code=status.HTTP_201_CREATED)
def create_mood_entry(
    mood_entry: MoodEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new mood entry"""
    return crud.create_mood_entry(db, mood_entry, current_user.id)


@router.get("", response_model=list[MoodEntryResponse])
def list_mood_entries(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get mood entries for the last N days"""
    return crud.get_mood_entries(db, current_user.id, days)


@router.get("/stats/summary")
def get_mood_stats(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get mood statistics"""
    stats = crud.get_mood_stats(db, current_user.id, days)
    return stats
