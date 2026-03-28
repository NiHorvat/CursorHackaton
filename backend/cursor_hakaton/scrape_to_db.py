#!/usr/bin/env python3
"""Fetch events from sites and write `events.db` (no web server).

Run from the project root::

    pip install -r requirements.txt
    python -m playwright install chromium
    python scrape_to_db.py
"""

from __future__ import annotations

import json
import sys

from zagreb_events.scrapers.runner import run_scrapers


def main() -> None:
    summary = run_scrapers()
    out = {
        "sources": summary.get("sources", {}),
        "errors": [
            {"source": e["source"], "detail": e["detail"][-4000:]}
            for e in summary.get("errors", [])
        ],
    }
    print(json.dumps(out, indent=2))
    if summary.get("errors"):
        sys.exit(1)


if __name__ == "__main__":
    main()
