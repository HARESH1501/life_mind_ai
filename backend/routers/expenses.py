"""
Expense API routes
Handles all expense-related endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime
from models import User
from schemas import ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseListResponse
from auth import get_current_user, get_db
import crud

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new expense"""
    return crud.create_expense(db, expense, current_user.id)


@router.get("", response_model=ExpenseListResponse)
def list_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all expenses for current user"""
    result = crud.get_expenses(db, current_user.id, skip, limit)
    return ExpenseListResponse(
        total=result["total"],
        skip=skip,
        limit=limit,
        items=result["items"]
    )


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific expense"""
    expense = crud.get_expense(db, expense_id, current_user.id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_update: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an expense"""
    expense = crud.update_expense(db, expense_id, current_user.id, expense_update)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an expense"""
    success = crud.delete_expense(db, expense_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    return None


@router.get("/category/{category}")
def get_expenses_by_category(
    category: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get expenses filtered by category"""
    expenses = crud.get_expenses_by_category(db, current_user.id, category)
    return {"category": category, "expenses": expenses, "count": len(expenses)}


@router.get("/stats/summary")
def get_expense_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get expense statistics"""
    stats = crud.get_expense_stats(db, current_user.id)
    return stats


@router.get("/monthly/{year}/{month}")
def get_monthly_expenses(
    year: int,
    month: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get expenses for a specific month"""
    if month < 1 or month > 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Month must be between 1 and 12"
        )
    
    expenses = crud.get_monthly_expenses(db, current_user.id, year, month)
    total = sum(e.amount for e in expenses)
    
    return {
        "year": year,
        "month": month,
        "expenses": expenses,
        "total": total,
        "count": len(expenses)
    }

