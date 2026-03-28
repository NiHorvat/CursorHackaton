"""SQLite schema and connection helpers."""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any


def get_connection(db_path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS places (
            place_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            lat REAL,
            lng REAL,
            types_json TEXT,
            rating REAL,
            ratings_total INTEGER,
            address TEXT,
            raw_json TEXT,
            query_id TEXT,
            last_synced_at TEXT
        );

        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            place_id TEXT NOT NULL,
            review_key TEXT NOT NULL UNIQUE,
            author TEXT,
            rating REAL,
            text_content TEXT,
            published_at TEXT,
            FOREIGN KEY (place_id) REFERENCES places(place_id)
        );

        CREATE INDEX IF NOT EXISTS idx_reviews_place ON reviews(place_id);
        """
    )
    conn.commit()


def json_dumps(obj: Any) -> str:
    return json.dumps(obj, ensure_ascii=False)


def json_loads(s: str | None, default: Any = None) -> Any:
    if not s:
        return default
    return json.loads(s)
