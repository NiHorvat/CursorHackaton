"""kultura.zagreb.hr lists events from Supabase (PostgREST). The anon key is minted by the SPA — capture it once in headless Chromium, then page with httpx."""

from __future__ import annotations

from typing import Any

import httpx

SUPABASE_EVENTS_URL = (
    "https://hjssinrkztppyikzuovm.supabase.co/rest/v1/events_comprehensive"
)
LISTING_PAGE = "https://kultura.zagreb.hr/dogadanja"


def _supabase_headers_via_browser() -> dict[str, str]:
    from playwright.sync_api import sync_playwright

    headers: dict[str, str] = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_default_timeout(120_000)

        def on_request(request) -> None:
            if headers:
                return
            u = request.url
            if (
                "events_comprehensive" in u
                and "select=*" in u
                and request.method == "GET"
            ):
                h = request.headers
                key = h.get("apikey")
                if key:
                    headers["apikey"] = key
                    auth = h.get("authorization")
                    headers["Authorization"] = auth if auth else f"Bearer {key}"

        page.on("request", on_request)
        page.goto(LISTING_PAGE, wait_until="networkidle")
        page.wait_for_timeout(2500)
        browser.close()

    if not headers:
        raise RuntimeError(
            "Could not capture Supabase credentials from kultura.zagreb.hr"
        )
    return headers


def _normalize_row(row: dict[str, Any]) -> dict[str, Any] | None:
    oid = row.get("occurrence_id")
    if not oid:
        return None
    title = str(row.get("event_name") or "").strip()
    if not title:
        title = "Untitled"
    venue = row.get("organisation_name") or row.get("address_name")
    venue_s = str(venue).strip() if venue else None
    addr = row.get("address_text")
    addr_s = str(addr).strip() if addr else None
    start = row.get("occurrence_start")
    end = row.get("occurrence_end")
    lat = row.get("latitude")
    lng = row.get("longitude")
    try:
        lat_f = float(lat) if lat is not None else None
    except (TypeError, ValueError):
        lat_f = None
    try:
        lng_f = float(lng) if lng is not None else None
    except (TypeError, ValueError):
        lng_f = None
    start_s = str(start) if start else None
    end_s = str(end) if end else None
    return {
        "source": "kultura",
        "external_key": str(oid),
        "title": title,
        "url": f"https://kultura.zagreb.hr/events/{oid}",
        "start_at": start_s,
        "end_at": end_s,
        "venue": venue_s,
        "address": addr_s,
        "lat": lat_f,
        "lng": lng_f,
    }


def fetch_kultura_events() -> list[dict]:
    auth = _supabase_headers_via_browser()
    hdrs = {**auth, "Accept": "application/json"}
    out: list[dict] = []
    offset = 0
    limit = 500
    with httpx.Client(timeout=120.0) as client:
        while True:
            r = client.get(
                SUPABASE_EVENTS_URL,
                params={
                    "select": "*",
                    "is_active": "eq.true",
                    "order": "occurrence_start.asc",
                    "offset": offset,
                    "limit": limit,
                },
                headers=hdrs,
            )
            r.raise_for_status()
            batch = r.json()
            if not isinstance(batch, list):
                break
            for raw in batch:
                if isinstance(raw, dict):
                    norm = _normalize_row(raw)
                    if norm:
                        out.append(norm)
            if len(batch) < limit:
                break
            offset += limit
    return out
