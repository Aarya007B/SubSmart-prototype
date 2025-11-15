from datetime import datetime, timedelta
from typing import Dict, List

import pandas as pd
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models
from ..database import get_db

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _subscriptions_dataframe(db: Session) -> pd.DataFrame:
    records = [
        {
            "id": subscription.id,
            "name": subscription.name,
            "price": subscription.price,
            "renewal_date": subscription.renewal_date,
            "status": subscription.status,
        }
        for subscription in db.query(models.Subscription).all()
    ]

    if not records:
        return pd.DataFrame(columns=["id", "name", "price", "renewal_date", "status"])

    df = pd.DataFrame(records)
    df["renewal_date"] = pd.to_datetime(df["renewal_date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0.0)
    df["status"] = df["status"].str.lower()
    return df


def _format_top_services(df: pd.DataFrame) -> List[Dict[str, object]]:
    if df.empty:
        return []

    top = df.sort_values("price", ascending=False).head(3)
    return [
        {
            "id": int(row.id),
            "name": row.name,
            "price": float(row.price),
            "status": row.status,
        }
        for row in top.itertuples(index=False)
    ]


def _status_breakdown(df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
    if df.empty:
        return {"counts": {}, "percentages": {}}

    counts = df["status"].value_counts().to_dict()
    percentages = df["status"].value_counts(normalize=True).mul(100).round(2).to_dict()

    return {
        "counts": {status: int(count) for status, count in counts.items()},
        "percentages": {status: float(percent) for status, percent in percentages.items()},
    }


def _renewals_within(df: pd.DataFrame, days: int) -> List[Dict[str, object]]:
    if df.empty:
        return []

    today = pd.Timestamp(datetime.utcnow().date())
    horizon = today + pd.Timedelta(days=days)
    upcoming = df[(df["renewal_date"] >= today) & (df["renewal_date"] <= horizon)]

    if upcoming.empty:
        return []

    return [
        {
            "id": int(row.id),
            "name": row.name,
            "renewal_date": row.renewal_date.date().isoformat(),
            "status": row.status,
            "price": float(row.price),
        }
        for row in upcoming.sort_values("renewal_date").itertuples(index=False)
    ]


def _overdue_renewals(df: pd.DataFrame) -> List[Dict[str, object]]:
    if df.empty:
        return []

    today = pd.Timestamp(datetime.utcnow().date())
    overdue = df[(df["renewal_date"] < today) & (df["status"] == "active")]
    if overdue.empty:
        return []

    return [
        {
            "id": int(row.id),
            "name": row.name,
            "renewal_date": row.renewal_date.date().isoformat(),
            "price": float(row.price),
        }
        for row in overdue.sort_values("renewal_date").itertuples(index=False)
    ]


def _spend_by_provider(df: pd.DataFrame) -> List[Dict[str, object]]:
    if df.empty:
        return []

    grouped = df.groupby("name", as_index=False)["price"].sum().sort_values("price", ascending=False)
    return [
        {"name": row.name, "total_spend": float(row.price)}
        for row in grouped.itertuples(index=False)
    ]


def _monthly_trend(df: pd.DataFrame) -> Dict[str, List[Dict[str, object]]]:
    if df.empty or df["renewal_date"].isna().all():
        return {"monthly_totals": [], "rolling_average": []}

    monthly = (
        df.dropna(subset=["renewal_date"])
        .assign(month=lambda d: d["renewal_date"].dt.to_period("M"))
        .groupby("month")["price"]
        .sum()
        .sort_index()
    )

    monthly = monthly.astype(float)
    monthly_df = monthly.to_frame(name="total").reset_index()
    monthly_df["month"] = monthly_df["month"].astype(str)

    rolling = monthly.rolling(window=3, min_periods=1).mean()

    return {
        "monthly_totals": [
            {"month": row.month, "total": float(row.total)}
            for row in monthly_df.itertuples(index=False)
        ],
        "rolling_average": [
            {"month": str(idx), "average": float(value)}
            for idx, value in rolling.items()
        ],
    }


def _duplicate_services(df: pd.DataFrame) -> List[Dict[str, object]]:
    if df.empty:
        return []

    df["name_key"] = df["name"].str.strip().str.lower()
    dupes = df.groupby("name_key").filter(lambda grp: len(grp) > 1)
    if dupes.empty:
        return []

    duplicates = []
    for name_key, group in dupes.groupby("name_key"):
        duplicates.append(
            {
                "service": group.iloc[0]["name"],
                "count": int(len(group)),
                "total_spend": float(group["price"].sum()),
                "subscription_ids": group["id"].astype(int).tolist(),
            }
        )
    return duplicates


def _downgrade_suggestions(df: pd.DataFrame) -> List[Dict[str, object]]:
    if df.empty:
        return []

    active = df[df["status"] == "active"]
    if active.empty:
        return []

    spend_threshold = active["price"].mean() * 1.5 if len(active) > 1 else active["price"].max()
    high_cost = active[active["price"] >= spend_threshold]

    if high_cost.empty:
        return []

    return [
        {
            "id": int(row.id),
            "name": row.name,
            "price": float(row.price),
            "note": "Consider evaluating usage for possible downgrade.",
        }
        for row in high_cost.sort_values("price", ascending=False).itertuples(index=False)
    ]


@router.get("/summary")
def analytics_summary(db: Session = Depends(get_db)):
    df = _subscriptions_dataframe(db)

    total_monthly_cost = float(df["price"].sum()) if not df.empty else 0.0
    yearly_projection = total_monthly_cost * 12
    average_price = float(df["price"].mean()) if not df.empty else None
    median_price = float(df["price"].median()) if not df.empty else None

    return {
        "spending": {
            "total_monthly": total_monthly_cost,
            "annual_projection": yearly_projection,
            "average_price": average_price,
            "median_price": median_price,
            "top_services": _format_top_services(df),
        },
        "status": _status_breakdown(df),
        "renewal_risk": {
            "upcoming_7_days": _renewals_within(df, 7),
            "upcoming_30_days": _renewals_within(df, 30),
            "overdue": _overdue_renewals(df),
        },
        "vendor_breakdown": _spend_by_provider(df),
        "temporal_trends": _monthly_trend(df),
        "recommendations": {
            "duplicates": _duplicate_services(df),
            "downgrade_candidates": _downgrade_suggestions(df),
            "status_churn": None,
            "notes": "Status change analytics require status change timestamps to be tracked.",
        },
    }
