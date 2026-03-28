"""Parse Google Places API (New) JSON into plain structures."""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from typing import Any


def extract_place_id(raw: str) -> str:
    s = (raw or "").strip()
    if s.startswith("places/"):
        return s.split("/", 1)[1]
    return s


def localized_text(obj: Any) -> str | None:
    if obj is None:
        return None
    if isinstance(obj, str):
        return obj
    if isinstance(obj, dict):
        t = obj.get("text")
        if isinstance(t, str):
            return t
    return None


def lat_lng_from_place(place: dict[str, Any]) -> tuple[float | None, float | None]:
    loc = place.get("location") or {}
    lat = loc.get("latitude")
    lng = loc.get("longitude")
    if lat is None or lng is None:
        return None, None
    return float(lat), float(lng)


def primary_type(types: list[str] | None) -> str | None:
    if not types:
        return None
    return types[0]


def review_key_for(
    place_id: str,
    review: dict[str, Any],
) -> str:
    name = review.get("name")
    if isinstance(name, str) and name.strip():
        return name
    text_obj = review.get("text") or {}
    text = text_obj.get("text") if isinstance(text_obj, dict) else str(text_obj or "")
    attr = review.get("authorAttribution") or {}
    author = attr.get("displayName") or ""
    publish_time = str(review.get("publishTime") or "")
    h = hashlib.sha256(
        f"{place_id}|{author}|{text}|{publish_time}".encode("utf-8")
    ).hexdigest()
    return f"local:{h}"


MAX_REVIEWS_PER_PLACE = 10


def parse_reviews_for_db(place_id: str, details: dict[str, Any]) -> list[dict[str, Any]]:
    revs = list(details.get("reviews") or [])
    revs.sort(key=lambda r: float(r.get("rating") or 0.0), reverse=True)
    revs = revs[:MAX_REVIEWS_PER_PLACE]
    rows: list[dict[str, Any]] = []
    for rev in revs:
        text_obj = rev.get("text") or {}
        text = text_obj.get("text") if isinstance(text_obj, dict) else str(text_obj or "")
        attr = rev.get("authorAttribution") or {}
        author = attr.get("displayName") or "Anonymous"
        rating = rev.get("rating")
        publish_time = rev.get("publishTime")
        rows.append(
            {
                "review_key": review_key_for(place_id, rev),
                "author": author,
                "rating": float(rating) if rating is not None else None,
                "text_content": text or "",
                "published_at": publish_time,
            }
        )
    return rows


def place_row_from_details(
    details: dict[str, Any],
    *,
    query_id: str,
    synced_at: datetime,
) -> dict[str, Any]:
    pid = str(details.get("id") or "")
    place_id = extract_place_id(pid)
    name = localized_text(details.get("displayName")) or "(unnamed)"
    lat, lng = lat_lng_from_place(details)
    types = list(details.get("types") or [])
    return {
        "place_id": place_id,
        "name": name,
        "lat": lat,
        "lng": lng,
        "types_json": types,
        "rating": details.get("rating"),
        "ratings_total": details.get("userRatingCount"),
        "address": details.get("formattedAddress"),
        "raw_json": details,
        "query_id": query_id,
        "last_synced_at": synced_at.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
    }


def place_row_from_search_hit(
    hit: dict[str, Any],
    *,
    query_id: str,
    synced_at: datetime,
) -> dict[str, Any]:
    raw = str(hit.get("id") or hit.get("name") or "")
    place_id = extract_place_id(raw)
    name = localized_text(hit.get("displayName")) or "(unnamed)"
    lat, lng = lat_lng_from_place(hit)
    types = list(hit.get("types") or [])
    return {
        "place_id": place_id,
        "name": name,
        "lat": lat,
        "lng": lng,
        "types_json": types,
        "rating": hit.get("rating"),
        "ratings_total": hit.get("userRatingCount"),
        "address": hit.get("formattedAddress"),
        "raw_json": hit,
        "query_id": query_id,
        "last_synced_at": synced_at.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
