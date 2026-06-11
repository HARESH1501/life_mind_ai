"""
CRUD operations for database models
Handles all database interactions with proper error handling
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime, timedelta
from models import Expense, User, Habit, Task, MoodEntry, HabitLog
from schemas import (
    ExpenseCreate, ExpenseUpdate,
    HabitCreate, HabitUpdate,
    TaskCreate, TaskUpdate,
    MoodEntryCreate
)


# ============ EXPENSE CRUD ============

def create_expense(db: Session, expense: ExpenseCreate, user_id: int):
    """Create a new expense"""
    db_expense = Expense(
        user_id=user_id,
        title=expense.title,
        description=expense.description,
        amount=expense.amount,
        category=expense.category
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def get_expense(db: Session, expense_id: int, user_id: int):
    """Get a single expense by ID"""
    return db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == user_id
    ).first()


def get_expenses(db: Session, user_id: int, skip: int = 0, limit: int = 20):
    """Get all expenses for a user with pagination"""
    query = db.query(Expense).filter(Expense.user_id == user_id)
    total = query.count()
    
    expenses = query.order_by(desc(Expense.date)).offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "items": expenses,
        "skip": skip,
        "limit": limit
    }


def get_expenses_by_category(db: Session, user_id: int, category: str):
    """Get expenses filtered by category"""
    return db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.category == category
    ).order_by(desc(Expense.date)).all()


def get_expenses_by_date_range(db: Session, user_id: int, start_date: datetime, end_date: datetime):
    """Get expenses within a date range"""
    return db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= start_date,
        Expense.date <= end_date
    ).order_by(desc(Expense.date)).all()


def get_monthly_expenses(db: Session, user_id: int, year: int, month: int):
    """Get expenses for a specific month"""
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)
    
    return get_expenses_by_date_range(db, user_id, start_date, end_date)


def get_expense_stats(db: Session, user_id: int):
    """Get expense statistics"""
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
    
    if not expenses:
        return {
            "total_spent": 0,
            "average_expense": 0,
            "highest_expense": 0,
            "category_breakdown": {}
        }
    
    total_spent = sum(e.amount for e in expenses)
    average_expense = total_spent / len(expenses)
    highest_expense = max(e.amount for e in expenses)
    
    # Category breakdown
    category_breakdown = {}
    for expense in expenses:
        if expense.category not in category_breakdown:
            category_breakdown[expense.category] = 0
        category_breakdown[expense.category] += expense.amount
    
    return {
        "total_spent": total_spent,
        "average_expense": average_expense,
        "highest_expense": highest_expense,
        "category_breakdown": category_breakdown,
        "total_expenses": len(expenses)
    }


def update_expense(db: Session, expense_id: int, user_id: int, expense_update: ExpenseUpdate):
    """Update an expense"""
    db_expense = get_expense(db, expense_id, user_id)
    if not db_expense:
        return None
    
    update_data = expense_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_expense, field, value)
    
    db_expense.updated_at = datetime.utcnow()
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def delete_expense(db: Session, expense_id: int, user_id: int):
    """Delete an expense"""
    db_expense = get_expense(db, expense_id, user_id)
    if not db_expense:
        return False
    
    db.delete(db_expense)
    db.commit()
    return True


# ============ HABIT CRUD ============

def create_habit(db: Session, habit: HabitCreate, user_id: int):
    """Create a new habit"""
    db_habit = Habit(
        user_id=user_id,
        name=habit.name,
        description=habit.description,
        frequency=habit.frequency
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


def get_habit(db: Session, habit_id: int, user_id: int):
    """Get a single habit by ID"""
    return db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == user_id
    ).first()


def get_habits(db: Session, user_id: int):
    """Get all habits for a user"""
    return db.query(Habit).filter(Habit.user_id == user_id).all()


def update_habit(db: Session, habit_id: int, user_id: int, habit_update: HabitUpdate):
    """Update a habit"""
    db_habit = get_habit(db, habit_id, user_id)
    if not db_habit:
        return None
    
    update_data = habit_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_habit, field, value)
    
    db_habit.updated_at = datetime.utcnow()
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


def delete_habit(db: Session, habit_id: int, user_id: int):
    """Delete a habit"""
    db_habit = get_habit(db, habit_id, user_id)
    if not db_habit:
        return False
    
    db.delete(db_habit)
    db.commit()
    return True


def log_habit(db: Session, habit_id: int, user_id: int, completed: bool = True):
    """Log habit completion"""
    habit = get_habit(db, habit_id, user_id)
    if not habit:
        return None
    
    # Check if already logged today
    today = datetime.utcnow().date()
    existing_log = db.query(HabitLog).filter(
        HabitLog.habit_id == habit_id,
        func.date(HabitLog.date) == today
    ).first()
    
    if existing_log:
        existing_log.completed = completed
        db.add(existing_log)
    else:
        log = HabitLog(
            habit_id=habit_id,
            completed=completed
        )
        db.add(log)
        
        # Update streak
        if completed:
            habit.streak += 1
            db.add(habit)
    
    db.commit()
    return True


# ============ TASK CRUD ============

def create_task(db: Session, task: TaskCreate, user_id: int):
    """Create a new task"""
    db_task = Task(
        user_id=user_id,
        title=task.title,
        description=task.description,
        priority=task.priority,
        due_date=task.due_date
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def get_task(db: Session, task_id: int, user_id: int):
    """Get a single task by ID"""
    return db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == user_id
    ).first()


def get_tasks(db: Session, user_id: int, status: str = None):
    """Get all tasks for a user"""
    query = db.query(Task).filter(Task.user_id == user_id)
    
    if status:
        query = query.filter(Task.status == status)
    
    return query.order_by(Task.due_date).all()


def update_task(db: Session, task_id: int, user_id: int, task_update: TaskUpdate):
    """Update a task"""
    db_task = get_task(db, task_id, user_id)
    if not db_task:
        return None
    
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db_task.updated_at = datetime.utcnow()
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int, user_id: int):
    """Delete a task"""
    db_task = get_task(db, task_id, user_id)
    if not db_task:
        return False
    
    db.delete(db_task)
    db.commit()
    return True


# ============ MOOD CRUD ============

def create_mood_entry(db: Session, mood_entry: MoodEntryCreate, user_id: int):
    """Create a new mood entry"""
    db_mood = MoodEntry(
        user_id=user_id,
        mood=mood_entry.mood,
        energy_level=mood_entry.energy_level,
        stress_level=mood_entry.stress_level,
        notes=mood_entry.notes
    )
    db.add(db_mood)
    db.commit()
    db.refresh(db_mood)
    return db_mood


def get_mood_entries(db: Session, user_id: int, days: int = 30):
    """Get mood entries for the last N days"""
    start_date = datetime.utcnow() - timedelta(days=days)
    return db.query(MoodEntry).filter(
        MoodEntry.user_id == user_id,
        MoodEntry.date >= start_date
    ).order_by(desc(MoodEntry.date)).all()


def get_mood_stats(db: Session, user_id: int, days: int = 30):
    """Get mood statistics"""
    entries = get_mood_entries(db, user_id, days)
    
    if not entries:
        return {
            "average_energy": 0,
            "average_stress": 0,
            "most_common_mood": None
        }
    
    average_energy = sum(e.energy_level for e in entries) / len(entries)
    average_stress = sum(e.stress_level for e in entries) / len(entries)
    
    # Most common mood
    mood_counts = {}
    for entry in entries:
        mood_counts[entry.mood] = mood_counts.get(entry.mood, 0) + 1
    most_common_mood = max(mood_counts, key=mood_counts.get) if mood_counts else None
    
    return {
        "average_energy": round(average_energy, 2),
        "average_stress": round(average_stress, 2),
        "most_common_mood": most_common_mood,
        "total_entries": len(entries)
    }
