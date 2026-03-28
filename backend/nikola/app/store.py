"""JSON file persistence for places and reviews (places_data.json)."""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

MAX_REVIEWS_PER_PLACE = 10


def _default_payload() -> dict[str, Any]:
    return {"exported_at": "", "places": []}


def load_places_payload(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return _default_payload()
    raw = path.read_text(encoding="utf-8").strip()
    if not raw:
        return _default_payload()
    data = json.loads(raw)
    if not isinstance(data, dict):
        return _default_payload()
    places = data.get("places")
    if not isinstance(places, list):
        places = []
    return {"exported_at": data.get("exported_at") or "", "places": places}


def atomic_save_places_payload(path: Path, payload: dict[str, Any]) -> None:
    """Write JSON atomically and sync to disk so each place is visible immediately."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.parent / f"{path.name}.tmp"
    with tmp.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)


def reviews_db_to_api(reviews_db: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out = [
        {
            "author": r["author"],
            "rating": r["rating"],
            "text": r["text_content"] or "",
            "time": r["published_at"],
        }
        for r in reviews_db
    ]
    out.sort(key=lambda x: float(x["rating"] or 0.0), reverse=True)
    return out[:MAX_REVIEWS_PER_PLACE]


def place_entry_from_row_and_reviews(
    row: dict[str, Any],
    reviews_db: list[dict[str, Any]],
) -> dict[str, Any]:
    types = row.get("types_json") or []
    return {
        "id": row["place_id"],
        "name": row["name"],
        "types": types,
        "address": row["address"],
        "location": {"lat": row["lat"], "lng": row["lng"]},
        "rating": row["rating"],
        "user_ratings_total": row["ratings_total"],
        "query_id": row["query_id"],
        "last_synced_at": row["last_synced_at"],
        "reviews": reviews_db_to_api(reviews_db),
    }


def upsert_place_into_payload(
    payload: dict[str, Any],
    row: dict[str, Any],
    reviews_db: list[dict[str, Any]],
) -> None:
    """Merge one place into the in-memory payload (no I/O)."""
    entry = place_entry_from_row_and_reviews(row, reviews_db)
    places: list[dict[str, Any]] = list(payload.get("places") or [])
    pid = entry["id"]
    idx = next((i for i, p in enumerate(places) if p.get("id") == pid), None)
    if idx is not None:
        places[idx] = entry
    else:
        places.append(entry)
    payload["places"] = places
    payload["exported_at"] = (
        datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    )


def upsert_place_in_json(
    path: Path,
    row: dict[str, Any],
    reviews_db: list[dict[str, Any]],
) -> None:
    """Load file, merge one place, save atomically (single-place API; reads disk each call)."""
    payload = load_places_payload(path)
    upsert_place_into_payload(payload, row, reviews_db)
    atomic_save_places_payload(path, payload)


def list_places(
    path: Path,
    *,
    category: str | None,
    q: str | None,
) -> tuple[list[dict[str, Any]], int]:
    payload = load_places_payload(path)
    raw = list(payload.get("places") or [])
    items: list[dict[str, Any]] = []
    for p in raw:
        types = p.get("types") or []
        primary = types[0] if types else None
        if category:
            if not (primary == category or p.get("query_id") == category):
                continue
        if q:
            name = (p.get("name") or "")
            if q.lower() not in name.lower():
                continue
        loc = p.get("location") or {}
        items.append(
            {
                "id": p.get("id"),
                "name": p.get("name"),
                "primary_type": primary,
                "address": p.get("address"),
                "lat": loc.get("lat"),
                "lng": loc.get("lng"),
                "rating": p.get("rating"),
                "user_ratings_total": p.get("user_ratings_total"),
                "last_synced_at": p.get("last_synced_at"),
                "reviews": p.get("reviews") or [],
            }
        )
    items.sort(key=lambda x: (x.get("name") or "").lower())
    return items, len(items)


def get_place(path: Path, place_id: str) -> dict[str, Any] | None:
    payload = load_places_payload(path)
    for p in payload.get("places") or []:
        if p.get("id") == place_id:
            return {
                "id": p["id"],
                "name": p["name"],
                "types": p.get("types") or [],
                "address": p.get("address"),
                "location": p.get("location") or {},
                "rating": p.get("rating"),
                "user_ratings_total": p.get("user_ratings_total"),
                "reviews": p.get("reviews") or [],
            }
    return None
