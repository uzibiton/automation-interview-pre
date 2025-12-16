from sqlalchemy import Column, Integer, String, Numeric, Date, ARRAY, TIMESTAMP, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.database import Base


class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    sub_category_id = Column(Integer, ForeignKey("sub_categories.id"))
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="USD")
    description = Column(Text)
    date = Column(Date, nullable=False, default=func.current_date())
    payment_method = Column(String(50))
    labels = Column(ARRAY(Text))
    created_at = Column(TIMESTAMP, default=func.current_timestamp())
    updated_at = Column(TIMESTAMP, default=func.current_timestamp(), onupdate=func.current_timestamp())
