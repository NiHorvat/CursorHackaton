"""Official TZGZ JSON API (same data as the Info Zagreb React client uses)."""

from __future__ import annotations

import calendar
from datetime import date
from typing import Any

import httpx

INFOZAGREB_API = "https://www.infozagreb.hr/API/hr/search"


def _upcoming_month_ranges(start: date, num_months: int) -> list[tuple[str, str]]:
    """Each (date_from, date_to) as DD.MM.YYYY for full calendar months."""
    ranges: list[tuple[str, str]] = []
    y, m = start.year, start.month
    for _ in range(num_months):
        last_day = calendar.monthrange(y, m)[1]
        ranges.append((f"01.{m:02d}.{y}", f"{last_day:02d}.{m:02d}.{y}"))
        if m == 12:
            y, m = y + 1, 1
        else:
            m += 1
    return ranges


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
    months_ahead: int = 18,
    http_timeout: float = 90.0,
) -> list[dict[str, Any]]:
    """Return normalized dicts ready for DB upsert."""
    headers = {
        "User-Agent": "ZagrebHackathonEvents/1.0 (educational; +local)",
        "Accept": "application/json",
    }
    params_base = {
        "menu_id": "",
        "categories": "",
        "type": "EVENTS",
        "orderField": "startDate",
        "per_page": "120",
    }

    seen: set[int] = set()
    raw_items: list[dict[str, Any]] = []

    with httpx.Client(timeout=http_timeout, headers=headers) as client:
        for date_from, date_to in _upcoming_month_ranges(date.today(), months_ahead):
            params = {
                **params_base,
                "date_from": date_from,
                "date_to": date_to,
            }
            r = client.get(api_url, params=params)
            r.raise_for_status()
            payload = r.json()
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
