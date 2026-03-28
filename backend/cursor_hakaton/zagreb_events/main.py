"""
Why FastAPI here: your frontend runs in the browser; it cannot read SQLite files.
This app exposes JSON over HTTP so your map/list can ``fetch("/events")``.

Run from repo root::

    pip install -r requirements.txt
    python -m playwright install chromium
    uvicorn zagreb_events.main:app --reload --host 127.0.0.1 --port 8000

Workflow: ``POST /scrape`` (or ``python scrape_to_db.py``), then ``GET /events``
for markers. Use ``venue`` + Google Geocoding on the client if ``lat``/``lng`` are null.

OpenAPI UI: http://127.0.0.1:8000/docs
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import date

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from zagreb_events.db import get_conn, init_db
from zagreb_events.schemas import EventOut, ScrapeError, ScrapeResult
from zagreb_events.scrapers.runner import run_scrapers


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Zagreb events API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/scrape", response_model=ScrapeResult)
def scrape() -> ScrapeResult:
    raw = run_scrapers()
    errors = [
        ScrapeError(source=e["source"], detail=e["detail"])
        for e in raw.get("errors", [])
    ]
    return ScrapeResult(sources=raw.get("sources", {}), errors=errors)


@app.get("/events", response_model=list[EventOut])
def list_events(
    upcoming: bool = False,
    limit: int = 400,
    source: str | None = None,
) -> list[EventOut]:
    """Load saved rows for the UI. Filter to upcoming only with ``upcoming=true``."""
    conn = get_conn()
    q = (
        "SELECT id, source, external_key, title, start_at, end_at, venue, address, "
        "lat, lng, url, updated_at FROM events WHERE 1=1"
    )
    args: list = []
    if source:
        q += " AND source = ?"
        args.append(source)
    q += " ORDER BY (start_at IS NULL), start_at ASC LIMIT ?"
    args.append(limit)
    cur = conn.execute(q, args)
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()

    if upcoming:
        today = date.today().isoformat()

        def _keep(r: dict) -> bool:
            s = r.get("start_at")
            if not s:
                return True
            return s[:10] >= today

        rows = [r for r in rows if _keep(r)]

    return [EventOut(**r) for r in rows]


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
