"""
AI Coach API routes
Generates smart life optimization advice using Groq LLaMA 3
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Dict, Any, List

from models import User, Expense, Habit, Task, MoodEntry
from auth import get_current_user, get_db

from ai.groq_client import groq_client
from ai.habit_intelligence import generate_habit_recommendations
from ai.mood_intelligence import generate_mood_insight

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/coach/suggestions")
def get_habit_suggestions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate smart habit recommendations based on current user habits
    """
    try:
        active_habits = db.query(Habit).filter(
            Habit.user_id == current_user.id,
            Habit.status == "active"
        ).all()
        
        recommendations = generate_habit_recommendations(active_habits)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate habit suggestions: {str(e)}"
        )


@router.get("/expenses/insights")
def get_expense_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze user expenses and generate smart savings insights
    """
    try:
        expenses = db.query(Expense).filter(Expense.user_id == current_user.id).all()
        
        if not expenses:
            return {
                "insights": "No expenses logged yet. Add some expenses to receive personalized savings insights!"
            }
            
        total_spent = sum(e.amount for e in expenses)
        
        # Category breakdown
        category_breakdown = {}
        for expense in expenses:
            cat = expense.category or "uncategorized"
            category_breakdown[cat] = category_breakdown.get(cat, 0.0) + expense.amount
            
        # Format for prompt
        breakdown_str = "\n".join([f"- {cat}: ₹{amt:.2f}" for cat, amt in category_breakdown.items()])
        expense_list_str = "\n".join([f"- {e.title}: ₹{e.amount:.2f} ({e.category})" for e in expenses[-10:]])
        
        system_prompt = """
        You are a top-tier personal finance advisor and AI wealth coach.
        Analyze the user's spending patterns and provide a highly practical, encouraging saving strategy (max 3 sentences).
        Do NOT use markdown format. Do NOT use emojis. Output only plain text.
        """
        
        user_prompt = f"""
        User current spending details:
        Total Spent: ₹{total_spent:.2f}
        
        Category Breakdown:
        {breakdown_str}
        
        Recent Expenses:
        {expense_list_str}
        
        Provide actionable advice on where I can save money and improve my financial wellness.
        """
        
        insight_text = groq_client.generate_completion(prompt=user_prompt, system_prompt=system_prompt)
        return {"insights": insight_text.strip()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate expense insights: {str(e)}"
        )


@router.get("/wellness/analysis")
def get_wellness_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze wellness and mood logs to generate encouraging coaching insights
    """
    try:
        # Get mood logs for last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        mood_entries = db.query(MoodEntry).filter(
            MoodEntry.user_id == current_user.id,
            MoodEntry.date >= thirty_days_ago
        ).all()
        
        if not mood_entries:
            return {
                "insights": "No wellness logs found in the last 30 days. Log your mood to get an AI wellness analysis!"
            }
            
        average_energy = sum(e.energy_level for e in mood_entries) / len(mood_entries)
        average_stress = sum(e.stress_level for e in mood_entries) / len(mood_entries)
        
        mood_counts = {}
        for entry in mood_entries:
            mood_counts[entry.mood] = mood_counts.get(entry.mood, 0) + 1
        most_common_mood = max(mood_counts, key=mood_counts.get) if mood_counts else "unknown"
        
        stats = {
            "average_energy": round(average_energy, 2),
            "average_stress": round(average_stress, 2),
            "most_common_mood": most_common_mood,
            "total_entries": len(mood_entries)
        }
        
        insight_text = generate_mood_insight(stats)
        return {"insights": insight_text}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate wellness insights: {str(e)}"
        )


@router.get("/daily-planner")
def get_daily_planner(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate an optimal daily productivity timeline based on habits, tasks, and recent wellness
    """
    try:
        # Fetch pending tasks and active habits
        pending_tasks = db.query(Task).filter(
            Task.user_id == current_user.id,
            Task.status != "completed"
        ).all()
        
        active_habits = db.query(Habit).filter(
            Habit.user_id == current_user.id,
            Habit.status == "active"
        ).all()
        
        # Fetch recent mood entries
        recent_mood = db.query(MoodEntry).filter(
            MoodEntry.user_id == current_user.id
        ).order_by(MoodEntry.date.desc()).first()
        
        tasks_str = ", ".join([f"{t.title} ({t.priority})" for t in pending_tasks]) if pending_tasks else "None"
        habits_str = ", ".join([h.name for h in active_habits]) if active_habits else "None"
        mood_str = f"Mood: {recent_mood.mood}, Energy: {recent_mood.energy_level}/10, Stress: {recent_mood.stress_level}/10" if recent_mood else "Not logged recently"
        
        system_prompt = """
        You are a world-class startup CTO and performance coach.
        Design a brief daily planner timeline or schedule suggestions for the user (max 4 sentences).
        Optimize task sequence based on priorities and wellness energy levels.
        Do NOT use markdown. Do NOT use emojis. Output only plain text.
        """
        
        user_prompt = f"""
        My details:
        Pending Tasks: {tasks_str}
        Active Habits to track: {habits_str}
        Current wellness state: {mood_str}
        
        Generate an optimal schedule suggestion for my day.
        """
        
        planner_text = groq_client.generate_completion(prompt=user_prompt, system_prompt=system_prompt)
        return {"planner": planner_text.strip()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate daily planner: {str(e)}"
        )
