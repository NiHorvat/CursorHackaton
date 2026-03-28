#!/usr/bin/env python3
"""Export ``events.db`` to ``events.json`` (same row shape as GET /events).

Run from ``cursor_hakaton``::

    py -3 export_events_json.py
    py -3 export_events_json.py path/to/out.json
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from zagreb_events.db import DB_PATH, get_conn


def main() -> None:
    out_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DB_PATH.parent / "events.json"
    conn = get_conn()
    cur = conn.execute(
        "SELECT id, source, external_key, title, start_at, end_at, venue, address, "
        "lat, lng, url, updated_at FROM events ORDER BY (start_at IS NULL), start_at ASC"
    )
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    out_path.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} rows to {out_path.resolve()}")


if __name__ == "__main__":
    main()
