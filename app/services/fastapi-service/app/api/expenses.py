from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
from app.core.database import get_db
from app.core.security import verify_token
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseUpdate

router = APIRouter()


@router.get("", response_model=List[ExpenseResponse])
async def get_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    """
    Get all expenses for the authenticated user
    """
    user_id = token_payload.get("sub") or token_payload.get("userId")
    
    query = select(Expense).where(Expense.user_id == user_id).order_by(desc(Expense.date)).offset(skip).limit(limit)
    result = await db.execute(query)
    expenses = result.scalars().all()
    
    return expenses


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense_data: ExpenseCreate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    """
    Create a new expense for the authenticated user
    """
    user_id = token_payload.get("sub") or token_payload.get("userId")
    
    expense = Expense(
        user_id=user_id,
        **expense_data.model_dump()
    )
    
    db.add(expense)
    await db.commit()
    await db.refresh(expense)
    
    return expense


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    """
    Get a specific expense by ID
    """
    user_id = token_payload.get("sub") or token_payload.get("userId")
    
    query = select(Expense).where(Expense.id == expense_id, Expense.user_id == user_id)
    result = await db.execute(query)
    expense = result.scalar_one_or_none()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    """
    Update an existing expense
    """
    user_id = token_payload.get("sub") or token_payload.get("userId")
    
    query = select(Expense).where(Expense.id == expense_id, Expense.user_id == user_id)
    result = await db.execute(query)
    expense = result.scalar_one_or_none()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    # Update only provided fields
    update_data = expense_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    
    await db.commit()
    await db.refresh(expense)
    
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    """
    Delete an expense
    """
    user_id = token_payload.get("sub") or token_payload.get("userId")
    
    query = select(Expense).where(Expense.id == expense_id, Expense.user_id == user_id)
    result = await db.execute(query)
    expense = result.scalar_one_or_none()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    await db.delete(expense)
    await db.commit()
