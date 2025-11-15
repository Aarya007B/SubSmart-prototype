from sqlalchemy import Column, Integer, String, Float, Date

from .database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=False)
    renewal_date = Column(Date, nullable=False)
    status = Column(String, nullable=False, default="active")
