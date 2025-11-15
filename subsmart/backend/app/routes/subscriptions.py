from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.get("/", response_model=List[schemas.Subscription])
def read_subscriptions(db: Session = Depends(get_db)):
    return crud.get_subscriptions(db)


@router.post("/", response_model=schemas.Subscription, status_code=201)
def create_subscription(subscription: schemas.SubscriptionCreate, db: Session = Depends(get_db)):
    return crud.create_subscription(db, subscription)


@router.get("/{subscription_id}", response_model=schemas.Subscription)
def read_subscription(subscription_id: int, db: Session = Depends(get_db)):
    db_subscription = crud.get_subscription(db, subscription_id)
    if not db_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return db_subscription


@router.put("/{subscription_id}", response_model=schemas.Subscription)
def update_subscription(subscription_id: int, subscription: schemas.SubscriptionUpdate, db: Session = Depends(get_db)):
    db_subscription = crud.update_subscription(db, subscription_id, subscription)
    if not db_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return db_subscription


@router.patch("/{subscription_id}/status", response_model=schemas.Subscription)
def set_subscription_status(
    subscription_id: int,
    payload: schemas.SubscriptionStatusUpdate,
    db: Session = Depends(get_db),
):
    updated = crud.update_subscription_status(db, subscription_id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return updated


@router.delete("/{subscription_id}", status_code=204)
def delete_subscription(subscription_id: int, db: Session = Depends(get_db)):
    db_subscription = crud.delete_subscription(db, subscription_id)
    if not db_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return None
