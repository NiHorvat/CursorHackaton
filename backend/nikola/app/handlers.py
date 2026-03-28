"""HTTP handlers; wired by name from config/routes.json."""

from __future__ import annotations

from typing import Annotated

from fastapi import HTTPException, Query, Request

from app.config_schema import health_payload, load_places_queries
from app.places_client import PlacesClient
from app.services.sync_places import run_sync
from app.store import get_place, list_places


def health(_request: Request) -> dict:
    return health_payload()


def list_places_handler(
    request: Request,
    category: Annotated[str | None, Query(alias="category")] = None,
    q: Annotated[str | None, Query()] = None,
) -> dict:
    path = request.app.state.paths.places_json_path
    items, total = list_places(
        path,
        category=category,
        q=q,
    )
    out: dict = {
        "items": items,
        "total": total,
    }
    if total == 0:
        out["hint"] = (
            "No places in places_data.json yet. Open GET /api/v1/sync in the browser or POST /api/v1/sync "
            "(loads from Google Places using config/places_queries.json)."
        )
    return out


def get_place_handler(request: Request, place_id: str) -> dict:
    path = request.app.state.paths.places_json_path
    row = get_place(path, place_id)
    if not row:
        raise HTTPException(status_code=404, detail="Place not found")
    return row


def _run_places_sync(request: Request) -> dict:
    secrets = request.app.state.secrets
    paths = request.app.state.paths
    places_cfg = load_places_queries(paths.places_queries_path)
    client = PlacesClient(secrets.google_places_api_key)
    return run_sync(
        places_cfg,
        client,
        json_path=paths.places_json_path,
    )


def sync_places_handler(request: Request) -> dict:
    return _run_places_sync(request)


def sync_places_get_handler(request: Request) -> dict:
    """Same as POST /sync — GET exists so you can trigger sync from the browser bar (hackathon MVP)."""
    return _run_places_sync(request)


HANDLERS: dict[str, object] = {
    "health": health,
    "list_places": list_places_handler,
    "get_place": get_place_handler,
    "sync_places": sync_places_handler,
    "sync_places_get": sync_places_get_handler,
}
