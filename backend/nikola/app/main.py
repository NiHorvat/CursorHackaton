"""FastAPI application: routes loaded from config/routes.json."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from starlette.responses import RedirectResponse

from app import __version__
from app.config_schema import AppPaths, RoutesConfig, health_payload, load_routes, load_secrets
from app.db import get_connection, init_db
from app.handlers import HANDLERS


@asynccontextmanager
async def lifespan(app: FastAPI):
    paths = AppPaths.from_project_root()
    secrets = load_secrets(paths.secrets_path)
    conn = get_connection(paths.database_path)
    init_db(conn)

    app.state.paths = paths
    app.state.secrets = secrets
    app.state.conn = conn

    yield

    conn.close()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Zagreb places",
        version=__version__,
        lifespan=lifespan,
    )

    paths = AppPaths.from_project_root()
    routes_cfg = load_routes(paths.routes_path)
    register_from_config(app, routes_cfg)
    register_root_aliases(app, routes_cfg)
    register_api_help(app, routes_cfg)

    return app


def register_from_config(app: FastAPI, routes_cfg: RoutesConfig) -> None:
    from fastapi import APIRouter

    prefix = routes_cfg.api_root.rstrip("/") or ""
    router = APIRouter(prefix=prefix)
    for entry in routes_cfg.routes:
        handler = HANDLERS.get(entry.name)
        if handler is None:
            raise KeyError(f"Unknown route handler: {entry.name}")
        router.add_api_route(
            entry.path,
            handler,
            methods=[entry.method],
            name=entry.name,
        )
    app.include_router(router)


def register_root_aliases(app: FastAPI, routes_cfg: RoutesConfig) -> None:
    """Unversioned / and /health so local checks work; versioned routes stay under api_root."""

    api_root = routes_cfg.api_root.rstrip("/") or ""
    health_url = f"{api_root}/health" if api_root else "/health"
    endpoints = [
        {
            "name": r.name,
            "method": r.method,
            "url": f"{api_root}{r.path}" if api_root else r.path,
        }
        for r in routes_cfg.routes
    ]

    @app.get("/", tags=["meta"])
    def root() -> dict:
        return {
            "service": "zagreb-places",
            "version": __version__,
            "api_root": api_root or "/",
            "health": health_url,
            "docs": "/docs",
            "openapi": "/openapi.json",
            "endpoints": endpoints,
            "hint": "Public URLs use `path` from config/routes.json (e.g. /places), not the handler `name` (e.g. list_places).",
        }

    @app.get("/health", tags=["meta"])
    def health_unversioned() -> dict:
        return health_payload()


def register_api_help(app: FastAPI, routes_cfg: RoutesConfig) -> None:
    """GET /api/v1 index + redirects for common /name/ URL mistakes."""

    api_root = routes_cfg.api_root.rstrip("/") or ""
    if not api_root:
        return

    endpoints = [
        {
            "name": r.name,
            "method": r.method,
            "path": r.path,
            "url": f"{api_root}{r.path}",
        }
        for r in routes_cfg.routes
    ]

    @app.get(api_root, tags=["meta"])
    def api_index() -> dict:
        return {
            "api_root": api_root,
            "endpoints": endpoints,
            "hint": "`name` (list_places, get_place) maps to Python handlers. The HTTP path is `path` (/places, /places/{place_id}).",
        }

    @app.get(f"{api_root}/list_places", tags=["meta"])
    def redirect_list_places_name_typo() -> RedirectResponse:
        return RedirectResponse(url=f"{api_root}/places", status_code=307)

    @app.get(f"{api_root}/get_place", tags=["meta"])
    def get_place_name_typo() -> None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Use GET {api_root}/places/{{place_id}} with a Google place id "
                "(from GET /places or after sync)."
            ),
        )


app = create_app()
