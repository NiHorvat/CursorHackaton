from __future__ import annotations

import sqlite3
import traceback
from typing import Any

from zagreb_events.db import get_conn, init_db, upsert_event
from zagreb_events.scrapers.infozagreb import fetch_infozagreb_events
from zagreb_events.scrapers.kultura import fetch_kultura_events
from zagreb_events.scrapers.meetinzagreb import fetch_meetinzagreb_events


def run_scrapers(conn: sqlite3.Connection | None = None) -> dict[str, Any]:
    """Fetch all sources and upsert. Owns transaction if `conn` is None."""
    close = False
    if conn is None:
        init_db()
        conn = get_conn()
        close = True
    summary: dict[str, Any] = {"sources": {}, "errors": []}
    try:
        batches: list[tuple[str, list[dict]]] = []
        try:
            batches.append(("infozagreb", fetch_infozagreb_events()))
        except Exception:
            summary["errors"].append(
                {"source": "infozagreb", "detail": traceback.format_exc()}
            )
        try:
            batches.append(("meetinzagreb", fetch_meetinzagreb_events()))
        except Exception:
            summary["errors"].append(
                {"source": "meetinzagreb", "detail": traceback.format_exc()}
            )
        try:
            batches.append(("kultura", fetch_kultura_events()))
        except Exception:
            summary["errors"].append(
                {"source": "kultura", "detail": traceback.format_exc()}
            )

        for source, events in batches:
            n = 0
            for ev in events:
                upsert_event(conn, **ev)
                n += 1
            summary["sources"][source] = {"upserted": n}
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        if close:
            conn.close()
    return summary
