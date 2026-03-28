import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "events.db"


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_conn()
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            external_key TEXT NOT NULL,
            title TEXT NOT NULL,
            start_at TEXT,
            end_at TEXT,
            venue TEXT,
            address TEXT,
            lat REAL,
            lng REAL,
            url TEXT NOT NULL,
            updated_at TEXT DEFAULT (datetime('now')),
            UNIQUE(source, external_key)
        );
        CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_at);
        CREATE INDEX IF NOT EXISTS idx_events_source ON events(source);
        """
    )
    conn.commit()
    conn.close()


def upsert_event(
    conn: sqlite3.Connection,
    *,
    source: str,
    external_key: str,
    title: str,
    url: str,
    start_at: str | None,
    end_at: str | None = None,
    venue: str | None = None,
    address: str | None = None,
    lat: float | None = None,
    lng: float | None = None,
) -> None:
    conn.execute(
        """
        INSERT INTO events (source, external_key, title, start_at, end_at, venue, address, lat, lng, url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(source, external_key) DO UPDATE SET
            title = excluded.title,
            start_at = excluded.start_at,
            end_at = excluded.end_at,
            venue = excluded.venue,
            address = excluded.address,
            lat = excluded.lat,
            lng = excluded.lng,
            url = excluded.url,
            updated_at = datetime('now')
        """,
        (source, external_key, title, start_at, end_at, venue, address, lat, lng, url),
    )
