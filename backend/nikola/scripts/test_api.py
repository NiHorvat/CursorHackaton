#!/usr/bin/env python3
"""Smoke-test the API.

Without a running server (recommended for CI):
  uv run python scripts/test_api.py --in-process

Against a live server (./scripts/run.sh in another terminal):
  uv run python scripts/test_api.py
  uv run python scripts/test_api.py --base-url http://127.0.0.1:8000

Optional Google sync (needs valid Places key in config/secrets.json):
  uv run python scripts/test_api.py --in-process --run-sync

Environment:
  BASE_URL     default for --base-url when using HTTP mode
"""

from __future__ import annotations

import argparse
import os
import sys
from collections.abc import Callable
from typing import Any

import httpx


def _location_matches(base: str, location: str | None, expected_path: str) -> bool:
    if not location:
        return False
    loc = location.strip()
    if loc.startswith("http://") or loc.startswith("https://"):
        return loc.rstrip("/") == f"{base}{expected_path}".rstrip("/")
    return loc.rstrip("/") == expected_path.rstrip("/")


def ok(name: str) -> None:
    print(f"  OK  {name}")


def fail(name: str, detail: str) -> None:
    print(f"  FAIL {name}: {detail}")


def run_smoke(
    request_fn: Callable[..., Any],
    *,
    base: str,
    run_sync: bool,
) -> int:
    """request_fn(method, url_path, follow_redirects=..., headers=...) -> response-like."""
    failures = 0

    def check(
        name: str,
        method: str,
        path: str,
        *,
        expect_status: int | tuple[int, ...] = 200,
        follow_redirects: bool = True,
        headers: dict[str, str] | None = None,
        json_body: Any | None = None,
    ):
        nonlocal failures
        try:
            r = request_fn(
                method,
                path,
                follow_redirects=follow_redirects,
                headers=headers,
                json_body=json_body,
            )
        except Exception as e:
            fail(name, f"{e!s}")
            failures += 1
            return None

        expected = expect_status if isinstance(expect_status, tuple) else (expect_status,)
        if r.status_code not in expected:
            fail(
                name,
                f"HTTP {r.status_code} for {method} {base}{path!r} — {r.text[:300]}",
            )
            failures += 1
            return None
        ok(f"{name} ({r.status_code})")
        return r

    r = check("GET /", "GET", "/")
    if r and r.json().get("service") != "zagreb-places":
        fail("GET / body", "missing service=zagreb-places")
        failures += 1

    check("GET /health", "GET", "/health")
    check("GET /api/v1/health", "GET", "/api/v1/health")
    check("GET /api/v1 index", "GET", "/api/v1")
    check("GET /api/v1/places", "GET", "/api/v1/places")

    check(
        "GET /api/v1/places/{unknown id} (404)",
        "GET",
        "/api/v1/places/ChIJdoesnotexist999",
        expect_status=404,
    )

    r = check(
        "GET /api/v1/list_places (redirect)",
        "GET",
        "/api/v1/list_places",
        expect_status=307,
        follow_redirects=False,
    )
    if r is not None and not _location_matches(
        base, r.headers.get("location"), "/api/v1/places"
    ):
        fail(
            "redirect Location",
            f"expected /api/v1/places, got {r.headers.get('location')!r}",
        )
        failures += 1

    r404 = check(
        "GET /api/v1/get_place (expected 404 hint)",
        "GET",
        "/api/v1/get_place",
        expect_status=404,
    )
    if r404 is not None and "places" not in (r404.json().get("detail") or "").lower():
        fail("GET /api/v1/get_place detail", "expected hint about /places/{place_id}")
        failures += 1

    if run_sync:
        rs = check(
            "POST /api/v1/sync",
            "POST",
            "/api/v1/sync",
            expect_status=200,
        )
        if rs is not None:
            body = rs.json()
            print(
                f"       sync: queries_run={body.get('queries_run')} "
                f"places_upserted={body.get('places_upserted')} "
                f"errors={len(body.get('errors') or [])}"
            )
            errs = body.get("errors") or []
            if errs:
                print(f"       (Google/API messages, first few: {errs[:3]})")

    if failures:
        print(f"\n{failures} check(s) failed.")
        return 1
    print("\nAll checks passed.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Smoke-test zagreb-places API")
    parser.add_argument(
        "--base-url",
        default=os.environ.get("BASE_URL", "http://127.0.0.1:8000"),
        help="API base (HTTP mode only; default BASE_URL or http://127.0.0.1:8000)",
    )
    parser.add_argument(
        "--in-process",
        action="store_true",
        help="Run against the app in-process (no server; TestClient + lifespan)",
    )
    parser.add_argument(
        "--run-sync",
        action="store_true",
        help="Also POST /api/v1/sync (calls Google Places API)",
    )
    args = parser.parse_args()
    base = args.base_url.rstrip("/")

    if args.in_process:
        from starlette.testclient import TestClient

        from app.main import app

        mode = "in-process (TestClient)"
        print(f"Testing ({mode})\n")
        with TestClient(app, base_url=base) as tc:

            def request_fn(
                method: str,
                path: str,
                *,
                follow_redirects: bool = True,
                headers: dict[str, str] | None = None,
                json_body: Any | None = None,
            ):
                kw: dict[str, Any] = {
                    "follow_redirects": follow_redirects,
                    "headers": headers,
                }
                if json_body is not None:
                    kw["json"] = json_body
                return tc.request(method, path, **kw)

            return run_smoke(
                request_fn,
                base=base,
                run_sync=args.run_sync,
            )

    mode = f"HTTP {base}"
    print(f"Testing ({mode})\n")
    with httpx.Client(base_url=base, timeout=120.0) as client:

        def request_fn(
            method: str,
            path: str,
            *,
            follow_redirects: bool = True,
            headers: dict[str, str] | None = None,
            json_body: Any | None = None,
        ):
            kw: dict[str, Any] = {
                "follow_redirects": follow_redirects,
                "headers": headers,
            }
            if json_body is not None:
                kw["json"] = json_body
            return client.request(method, path, **kw)

        return run_smoke(
            request_fn,
            base=base,
            run_sync=args.run_sync,
        )


if __name__ == "__main__":
    sys.exit(main())
