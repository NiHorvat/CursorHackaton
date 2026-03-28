"""Official TZGZ JSON API (same data as the Info Zagreb React client uses)."""

from __future__ import annotations

import time
from datetime import date, timedelta
from typing import Any

import httpx

INFOZAGREB_API = "https://www.infozagreb.hr/API/hr/search"


def _upcoming_week_ranges(
    start: date, *, days_ahead: int = 270
) -> list[tuple[str, str]]:
    """Small 7-day windows + lower per_page — less work per request, fewer 504s."""
    ranges: list[tuple[str, str]] = []
    end = start + timedelta(days=days_ahead)
    d0 = start
    while d0 <= end:
        d1 = min(d0 + timedelta(days=6), end)
        ranges.append(
            (
                f"{d0.day:02d}.{d0.month:02d}.{d0.year}",
                f"{d1.day:02d}.{d1.month:02d}.{d1.year}",
            )
        )
        d0 = d1 + timedelta(days=1)
    return ranges


def _get_search_payload(
    client: httpx.Client,
    api_url: str,
    params: dict[str, str],
    *,
    max_retries: int = 6,
) -> dict[str, Any] | None:
    """Return JSON or None if this window is unusable (504/timeouts) — caller skips window."""
    for attempt in range(max_retries):
        try:
            r = client.get(api_url, params=params)
            if r.status_code in (502, 503, 504):
                if attempt + 1 >= max_retries:
                    return None
                time.sleep(min(2.0 * (2**attempt), 30.0))
                continue
            r.raise_for_status()
            return r.json()
        except httpx.TimeoutException:
            if attempt + 1 >= max_retries:
                return None
            time.sleep(min(2.0 * (2**attempt), 30.0))
        except httpx.HTTPStatusError:
            return None
    return None


def _event_url(item: dict[str, Any]) -> str:
    base = "https://www.infozagreb.hr"
    path = (item.get("pages_link") or "").rstrip("/")
    slug = item.get("link") or ""
    return f"{base}{path}/{slug}" if path else f"{base}/hr/dogadanja/{slug}"


def _start_iso(item: dict[str, Any]) -> str | None:
    dates = item.get("dates") or []
    if dates and isinstance(dates, list):
        u = dates[0].get("u_date_from")
        if u:
            return str(u).replace("Z", "+00:00") if "Z" in str(u) else str(u)
    df = item.get("date_from")
    tf = item.get("time_from")
    if not df:
        return None
    # e.g. "28.04.2026" and "20.00"
    parts = str(df).replace(" ", "").split(".")
    if len(parts) < 3:
        return None
    try:
        d, m, y = int(parts[0]), int(parts[1]), int(parts[2][:4])
    except ValueError:
        return None
    hour, minute = 12, 0
    if tf:
        t = str(tf).replace("h", "").strip()
        for sep in (":", "."):
            if sep in t:
                a, b = t.split(sep, 1)[:2]
                try:
                    hour, minute = int(a), int(b[:2])
                except ValueError:
                    pass
                break
    try:
        from datetime import datetime

        return datetime(y, m, d, hour, minute).isoformat()
    except ValueError:
        return None


def _venue(item: dict[str, Any]) -> str | None:
    locs = item.get("locations") or []
    if locs and isinstance(locs, list):
        name = locs[0].get("name")
        return str(name) if name else None
    return None


def fetch_infozagreb_events(
    *,
    api_url: str = INFOZAGREB_API,
    days_ahead: int = 270,
    http_timeout: float = 90.0,
) -> list[dict[str, Any]]:
    """Return normalized dicts ready for DB upsert."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept": "application/json",
    }
    params_base = {
        "menu_id": "",
        "categories": "",
        "type": "EVENTS",
        "orderField": "startDate",
        "per_page": "40",
    }

    seen: set[int] = set()
    raw_items: list[dict[str, Any]] = []

    with httpx.Client(timeout=http_timeout, headers=headers) as client:
        for date_from, date_to in _upcoming_week_ranges(date.today(), days_ahead=days_ahead):
            params = {
                **params_base,
                "date_from": date_from,
                "date_to": date_to,
            }
            payload = _get_search_payload(client, api_url, params)
            time.sleep(0.35)
            if not payload:
                continue
            for it in payload.get("data") or []:
                oid = it.get("id_objects")
                if isinstance(oid, int) and oid not in seen:
                    seen.add(oid)
                    raw_items.append(it)

    out: list[dict[str, Any]] = []
    for item in raw_items:
        oid = item.get("id_objects")
        if not isinstance(oid, int):
            continue
        out.append(
            {
                "source": "infozagreb",
                "external_key": str(oid),
                "title": str(item.get("name") or "").strip() or "Untitled",
                "url": _event_url(item),
                "start_at": _start_iso(item),
                "end_at": None,
                "venue": _venue(item),
                "address": None,
                "lat": None,
                "lng": None,
            }
        )
    return out
