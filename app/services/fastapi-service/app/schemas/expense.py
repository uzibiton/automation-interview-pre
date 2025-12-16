from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import date
from decimal import Decimal


class ExpenseBase(BaseModel):
    amount: Decimal = Field(..., gt=0, description="Expense amount (must be positive)")
    currency: str = Field(default="USD", max_length=3)
    description: Optional[str] = None
    date: date
    category_id: Optional[int] = None
    sub_category_id: Optional[int] = None
    payment_method: Optional[str] = Field(None, max_length=50)
    labels: Optional[List[str]] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    amount: Optional[Decimal] = Field(None, gt=0)
    currency: Optional[str] = Field(None, max_length=3)
    description: Optional[str] = None
    date: Optional[date] = None
    category_id: Optional[int] = None
    sub_category_id: Optional[int] = None
    payment_method: Optional[str] = Field(None, max_length=50)
    labels: Optional[List[str]] = None


class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    created_at: Optional[date] = None
    updated_at: Optional[date] = None
    
    model_config = ConfigDict(from_attributes=True)
