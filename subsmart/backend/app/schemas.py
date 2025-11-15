from datetime import date
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class SubscriptionStatus(str, Enum):
    active = "active"
    paused = "paused"
    cancelled = "cancelled"


class SubscriptionBase(BaseModel):
    name: str = Field(..., min_length=1)
    price: float = Field(..., ge=0)
    renewal_date: date
    status: SubscriptionStatus = Field(default=SubscriptionStatus.active)


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1)
    price: Optional[float] = Field(default=None, ge=0)
    renewal_date: Optional[date] = None
    status: Optional[SubscriptionStatus] = None


class Subscription(SubscriptionBase):
    id: int

    class Config:
        orm_mode = True


class SubscriptionStatusUpdate(BaseModel):
    status: SubscriptionStatus
