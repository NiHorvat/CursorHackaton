"""SQLite persistence for places and reviews."""

from __future__ import annotations

import json
import sqlite3
from collections import defaultdict
from typing import Any

MAX_REVIEWS_PER_PLACE = 10


def upsert_place(conn: sqlite3.Connection, row: dict[str, Any]) -> None:
    raw = row.get("raw_json")
    raw_s = json.dumps(raw, ensure_ascii=False) if isinstance(raw, dict) else str(raw or "")
    types_s = json.dumps(row.get("types_json") or [], ensure_ascii=False)
    conn.execute(
        """
        INSERT INTO places (
            place_id, name, lat, lng, types_json, rating, ratings_total,
            address, raw_json, query_id, last_synced_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(place_id) DO UPDATE SET
            name = excluded.name,
            lat = COALESCE(excluded.lat, places.lat),
            lng = COALESCE(excluded.lng, places.lng),
            types_json = excluded.types_json,
            rating = COALESCE(excluded.rating, places.rating),
            ratings_total = COALESCE(excluded.ratings_total, places.ratings_total),
            address = COALESCE(excluded.address, places.address),
            raw_json = excluded.raw_json,
            query_id = excluded.query_id,
            last_synced_at = excluded.last_synced_at
        """,
        (
            row["place_id"],
            row["name"],
            row.get("lat"),
            row.get("lng"),
            types_s,
            row.get("rating"),
            row.get("ratings_total"),
            row.get("address"),
            raw_s,
            row.get("query_id"),
            row.get("last_synced_at"),
        ),
    )


def replace_reviews(
    conn: sqlite3.Connection,
    place_id: str,
    reviews: list[dict[str, Any]],
) -> None:
    conn.execute("DELETE FROM reviews WHERE place_id = ?", (place_id,))
    for r in reviews:
        conn.execute(
            """
            INSERT INTO reviews (place_id, review_key, author, rating, text_content, published_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                place_id,
                r["review_key"],
                r["author"],
                r.get("rating"),
                r.get("text_content"),
                r.get("published_at"),
            ),
        )


def _reviews_dict_rows(
    rev_rows: list[sqlite3.Row],
) -> list[dict[str, Any]]:
    out = [
        {
            "author": r["author"],
            "rating": r["rating"],
            "text": r["text_content"] or "",
            "time": r["published_at"],
        }
        for r in rev_rows
    ]
    out.sort(key=lambda x: float(x["rating"] or 0.0), reverse=True)
    return out[:MAX_REVIEWS_PER_PLACE]


def reviews_for_place_ids(
    conn: sqlite3.Connection,
    place_ids: list[str],
) -> dict[str, list[dict[str, Any]]]:
    if not place_ids:
        return {}
    ph = ",".join("?" * len(place_ids))
    rows = conn.execute(
        f"""
        SELECT place_id, author, rating, text_content, published_at
        FROM reviews WHERE place_id IN ({ph})
        """,
        place_ids,
    ).fetchall()
    grouped: dict[str, list[sqlite3.Row]] = defaultdict(list)
    for r in rows:
        grouped[str(r["place_id"])].append(r)
    return {pid: _reviews_dict_rows(lst) for pid, lst in grouped.items()}


def list_places(
    conn: sqlite3.Connection,
    *,
    category: str | None,
    q: str | None,
) -> tuple[list[dict[str, Any]], int]:
    where: list[str] = []
    params: list[Any] = []

    if category:
        where.append(
            "(json_extract(types_json, '$[0]') = ? OR query_id = ?)"
        )
        params.extend([category, category])

    if q:
        where.append("name LIKE ?")
        params.append(f"%{q}%")

    wh = " WHERE " + " AND ".join(where) if where else ""

    rows = conn.execute(
        f"""
        SELECT * FROM places
        {wh}
        ORDER BY name COLLATE NOCASE
        """,
        params,
    ).fetchall()

    pids = [str(r["place_id"]) for r in rows]
    reviews_by_place = reviews_for_place_ids(conn, pids)

    items: list[dict[str, Any]] = []
    for r in rows:
        types = json.loads(r["types_json"] or "[]")
        pid = str(r["place_id"])
        items.append(
            {
                "id": pid,
                "name": r["name"],
                "primary_type": types[0] if types else None,
                "address": r["address"],
                "lat": r["lat"],
                "lng": r["lng"],
                "rating": r["rating"],
                "user_ratings_total": r["ratings_total"],
                "last_synced_at": r["last_synced_at"],
                "reviews": reviews_by_place.get(pid, []),
            }
        )
    return items, len(items)


def get_place(
    conn: sqlite3.Connection,
    place_id: str,
) -> dict[str, Any] | None:
    row = conn.execute(
        "SELECT * FROM places WHERE place_id = ?", (place_id,)
    ).fetchone()
    if not row:
        return None
    types = json.loads(row["types_json"] or "[]")
    rev_rows = conn.execute(
        """
        SELECT author, rating, text_content, published_at
        FROM reviews WHERE place_id = ?
        """,
        (place_id,),
    ).fetchall()
    reviews = _reviews_dict_rows(list(rev_rows))
    return {
        "id": row["place_id"],
        "name": row["name"],
        "types": types,
        "address": row["address"],
        "location": {"lat": row["lat"], "lng": row["lng"]},
        "rating": row["rating"],
        "user_ratings_total": row["ratings_total"],
        "reviews": reviews,
    }
