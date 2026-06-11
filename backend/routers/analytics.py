"""
Analytics API routes
Computes productivity score, wellness score, habit streaks, and financial metrics
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Dict, Any, List

from models import User, Expense, Habit, Task, MoodEntry
from auth import get_current_user, get_db
import crud

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard")
def get_dashboard_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get consolidated dashboard metrics for the logged-in user
    """
    user_id = current_user.id
    
    # 1. Financial Analytics (Expenses)
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
    total_spent = 0.0
    average_expense = 0.0
    highest_expense = 0.0
    category_breakdown = {}
    
    if expenses:
        total_spent = sum(e.amount for e in expenses)
        average_expense = total_spent / len(expenses)
        highest_expense = max(e.amount for e in expenses)
        
        for expense in expenses:
            cat = expense.category or "uncategorized"
            category_breakdown[cat] = category_breakdown.get(cat, 0.0) + expense.amount
            
    # 2. Habit Streaks Analytics
    habits = db.query(Habit).filter(Habit.user_id == user_id).all()
    habit_details = []
    total_streak = 0
    
    for h in habits:
        habit_details.append({
            "id": h.id,
            "name": h.name,
            "streak": h.streak,
            "frequency": h.frequency,
            "status": h.status
        })
        if h.status == "active":
            total_streak += h.streak
            
    # 3. Productivity Score Calculation
    # Formula: 50% Task Completion + 50% Habit Streak Performance
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == "completed")
    
    task_rate = (completed_tasks / total_tasks) if total_tasks > 0 else 1.0
    
    # Habit performance score: average streak relative to target streak of 10
    avg_streak = (total_streak / len(habits)) if len(habits) > 0 else 0.0
    habit_rate = min(avg_streak / 10.0, 1.0) if len(habits) > 0 else 1.0
    
    # Composite productivity score (0 - 100)
    productivity_score = int((task_rate * 50.0) + (habit_rate * 50.0))
    # If no habits or tasks are set, give a baseline neutral score
    if total_tasks == 0 and len(habits) == 0:
        productivity_score = 75
        
    # 4. Wellness Score Calculation
    # Formula based on mood, average energy and stress levels in last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    mood_entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user_id,
        MoodEntry.date >= thirty_days_ago
    ).all()
    
    wellness_score = 75  # Default neutral score
    average_energy = 0.0
    average_stress = 0.0
    most_common_mood = None
    
    if mood_entries:
        average_energy = sum(e.energy_level for e in mood_entries) / len(mood_entries)
        average_stress = sum(e.stress_level for e in mood_entries) / len(mood_entries)
        
        # Wellness score composite
        # High energy level is positive (+5 per pt up to 10), high stress level is negative (-5 per pt)
        # score = (avg_energy * 10) - (avg_stress * 5) + 50
        raw_score = (average_energy * 10.0) - (average_stress * 5.0) + 50.0
        wellness_score = int(max(min(raw_score, 100.0), 0.0))
        
        mood_counts = {}
        for entry in mood_entries:
            mood_counts[entry.mood] = mood_counts.get(entry.mood, 0) + 1
        most_common_mood = max(mood_counts, key=mood_counts.get) if mood_counts else None

    return {
        "total_spent": round(total_spent, 2),
        "average_expense": round(average_expense, 2),
        "highest_expense": round(highest_expense, 2),
        "total_expenses": len(expenses),
        "category_breakdown": category_breakdown,
        "habit_streaks": habit_details,
        "productivity_score": productivity_score,
        "wellness_score": wellness_score,
        "mood_stats": {
            "average_energy": round(average_energy, 2) if mood_entries else 0.0,
            "average_stress": round(average_stress, 2) if mood_entries else 0.0,
            "most_common_mood": most_common_mood,
            "total_mood_logs": len(mood_entries)
        }
    }
