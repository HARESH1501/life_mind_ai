"""
Habit API routes
Handles habit tracking and management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import User
from schemas import HabitCreate, HabitUpdate, HabitResponse
from auth import get_current_user, get_db
import crud

router = APIRouter(prefix="/habits", tags=["habits"])


@router.post("", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(
    habit: HabitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new habit"""
    return crud.create_habit(db, habit, current_user.id)


@router.get("", response_model=list[HabitResponse])
def list_habits(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all habits for current user"""
    return crud.get_habits(db, current_user.id)


@router.get("/{habit_id}", response_model=HabitResponse)
def get_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific habit"""
    habit = crud.get_habit(db, habit_id, current_user.id)
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    return habit


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: int,
    habit_update: HabitUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a habit"""
    habit = crud.update_habit(db, habit_id, current_user.id, habit_update)
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a habit"""
    success = crud.delete_habit(db, habit_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    return None


@router.post("/{habit_id}/log")
def log_habit_completion(
    habit_id: int,
    completed: bool = True,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log habit completion"""
    success = crud.log_habit(db, habit_id, current_user.id, completed)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    return {"message": "Habit logged successfully"}
