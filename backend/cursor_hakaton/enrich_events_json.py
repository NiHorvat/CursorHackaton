#!/usr/bin/env python3
"""Remove duplicates, add ``category`` to each event, write JSON.

Usage (from ``cursor_hakaton``)::

    python enrich_events_json.py
    python enrich_events_json.py events.json events.clean.json
"""

from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

from zagreb_events.db import DB_PATH
from zagreb_events.BITNO import enrich_events


def main() -> None:
    base = DB_PATH.parent
    in_path = Path(sys.argv[1]) if len(sys.argv) > 1 else base / "events.json"
    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else in_path

    raw = json.loads(in_path.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise SystemExit("Expected a JSON array of events")
    before = len(raw)
    out = enrich_events(raw)
    after = len(out)

    if out_path.resolve() == in_path.resolve():
        bak = in_path.with_suffix(".json.bak")
        shutil.copy2(in_path, bak)
        print(f"Backup: {bak}")

    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Events: {before} -> {after} (deduped); wrote {out_path.resolve()}")


if __name__ == "__main__":
    main()
