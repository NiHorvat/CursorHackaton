"""Sync places from Google Places API into places_data.json."""

from __future__ import annotations

import math
from datetime import datetime, timezone
from pathlib import Path

from app.config_schema import PlacesQueriesConfig
from app.places_client import PlacesClient
from app.places_parse import parse_reviews_for_db, place_row_from_details
from app.store import (
    atomic_save_places_payload,
    load_places_payload,
    upsert_place_into_payload,
)

_EARTH_RADIUS_M = 6371000.0
_MAX_OUTSIDE_ERROR_LINES = 40


def _haversine_meters(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    """Great-circle distance between two WGS84 points in meters."""
    p1 = math.radians(lat1)
    p2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlng = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlng / 2) ** 2
    return 2 * _EARTH_RADIUS_M * math.asin(min(1.0, math.sqrt(a)))


def _inside_zagreb_circle(
    lat: float | None,
    lng: float | None,
    *,
    center_lat: float,
    center_lng: float,
    radius_meters: float,
) -> bool:
    if lat is None or lng is None:
        return False
    return (
        _haversine_meters(lat, lng, center_lat, center_lng) <= radius_meters
    )


def run_sync(
    places_cfg: PlacesQueriesConfig,
    client: PlacesClient,
    *,
    json_path: Path,
) -> dict:
    circle_cfg = places_cfg.zagreb_location.circle
    circle = circle_cfg.to_places_api()
    center_lat = circle_cfg.center.latitude
    center_lng = circle_cfg.center.longitude
    radius_m = float(circle_cfg.radius_meters)

    cap = places_cfg.max_places_upserted
    max_pages = places_cfg.max_pages_per_query
    queries_run = 0
    places_upserted = 0
    skipped_no_coords = 0
    skipped_outside = 0
    outside_error_lines = 0
    errors: list[str] = []
    now = datetime.now(timezone.utc)
    # One load at start; each successful place mutates payload then atomic disk write.
    payload = load_places_payload(json_path)

    for q in places_cfg.queries:
        if cap is not None and places_upserted >= cap:
            break
        queries_run += 1
        page_token: str | None = None
        for _page in range(max_pages):
            if cap is not None and places_upserted >= cap:
                break
            try:
                resp = client.search_text(
                    text_query=q.textQuery,
                    location_bias_circle=circle,
                    included_type=q.includedType,
                    max_result_count=q.maxResultCount,
                    page_token=page_token,
                )
            except Exception as e:
                errors.append(f"query {q.id} search: {e!s}")
                break

            places = resp.get("places") or []
            for hit in places:
                if cap is not None and places_upserted >= cap:
                    break
                ref = str(hit.get("id") or hit.get("name") or "")
                if not ref:
                    continue
                try:
                    details = client.get_place_details(ref)
                    row = place_row_from_details(
                        details, query_id=q.id, synced_at=now
                    )
                    lat, lng = row.get("lat"), row.get("lng")
                    if lat is None or lng is None:
                        skipped_no_coords += 1
                        errors.append(f"skipped_no_coords: {ref}")
                        continue
                    if not _inside_zagreb_circle(
                        float(lat),
                        float(lng),
                        center_lat=center_lat,
                        center_lng=center_lng,
                        radius_meters=radius_m,
                    ):
                        skipped_outside += 1
                        if outside_error_lines < _MAX_OUTSIDE_ERROR_LINES:
                            errors.append(f"skipped_outside_zagreb: {ref}")
                            outside_error_lines += 1
                        continue
                    reviews = parse_reviews_for_db(row["place_id"], details)
                    upsert_place_into_payload(payload, row, reviews)
                    atomic_save_places_payload(json_path, payload)
                    places_upserted += 1
                except Exception as e:
                    errors.append(f"{ref}: {e!s}")

            page_token = resp.get("nextPageToken")
            if not page_token:
                break

    stopped_at_cap = cap is not None and places_upserted >= cap
    if skipped_outside > _MAX_OUTSIDE_ERROR_LINES:
        errors.append(
            f"skipped_outside_zagreb: ({skipped_outside - _MAX_OUTSIDE_ERROR_LINES} more not listed)"
        )
    out: dict = {
        "status": "completed",
        "queries_run": queries_run,
        "places_upserted": places_upserted,
        "max_places_upserted": cap,
        "stopped_at_cap": stopped_at_cap,
        "skipped_no_coordinates": skipped_no_coords,
        "skipped_outside_zagreb": skipped_outside,
        "zagreb_center": {"latitude": center_lat, "longitude": center_lng},
        "zagreb_radius_meters": radius_m,
        "errors": errors,
        "places_json": str(json_path),
    }
    return out
