from sqlalchemy.orm import Session

from . import models, schemas


def _coerce_enum_fields(data: dict):
    result = dict(data)
    status = result.get("status")
    if isinstance(status, schemas.SubscriptionStatus):
        result["status"] = status.value
    return result


def get_subscriptions(db: Session):
    return db.query(models.Subscription).all()


def get_subscription(db: Session, subscription_id: int):
    return db.query(models.Subscription).filter(models.Subscription.id == subscription_id).first()


def create_subscription(db: Session, subscription: schemas.SubscriptionCreate):
    payload = _coerce_enum_fields(subscription.dict())
    db_subscription = models.Subscription(**payload)
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription


def update_subscription(db: Session, subscription_id: int, subscription: schemas.SubscriptionUpdate):
    db_subscription = get_subscription(db, subscription_id)
    if not db_subscription:
        return None

    update_data = _coerce_enum_fields(subscription.dict(exclude_unset=True))
    for key, value in update_data.items():
        setattr(db_subscription, key, value)

    db.commit()
    db.refresh(db_subscription)
    return db_subscription


def delete_subscription(db: Session, subscription_id: int):
    db_subscription = get_subscription(db, subscription_id)
    if not db_subscription:
        return None

    db.delete(db_subscription)
    db.commit()
    return db_subscription


def update_subscription_status(
    db: Session, subscription_id: int, status: schemas.SubscriptionStatus
):
    db_subscription = get_subscription(db, subscription_id)
    if not db_subscription:
        return None

    status_value = status.value if hasattr(status, "value") else status
    db_subscription.status = status_value
    db.commit()
    db.refresh(db_subscription)
    return db_subscription
