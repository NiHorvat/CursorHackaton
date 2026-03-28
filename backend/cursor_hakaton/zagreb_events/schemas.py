"""Response shapes your frontend can rely on (see OpenAPI at /docs)."""

from __future__ import annotations

from pydantic import BaseModel, Field


class EventOut(BaseModel):
    id: int
    source: str
    external_key: str
    title: str
    start_at: str | None = None
    end_at: str | None = None
    venue: str | None = None
    address: str | None = None
    lat: float | None = None
    lng: float | None = None
    url: str
    updated_at: str | None = None


class ScrapeError(BaseModel):
    source: str
    detail: str


class ScrapeResult(BaseModel):
    sources: dict[str, dict[str, int]] = Field(
        default_factory=dict,
        description="Per source: number of rows upserted",
    )
    errors: list[ScrapeError] = Field(
        default_factory=list,
        description="Scrapers that failed (others may still have run)",
    )
