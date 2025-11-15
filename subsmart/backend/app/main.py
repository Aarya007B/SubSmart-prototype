from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .routes import subscriptions
from .routes import analytics

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SubSmart API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(subscriptions.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
