"""Pydantic models for JSON configuration files."""

from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app import __version__


class LatLng(BaseModel):
    latitude: float
    longitude: float


class CircleArea(BaseModel):
    center: LatLng
    radius_meters: float

    def to_places_api(self) -> dict:
        return {
            "center": {
                "latitude": self.center.latitude,
                "longitude": self.center.longitude,
            },
            "radius": float(self.radius_meters),
        }


class ZagrebLocation(BaseModel):
    circle: CircleArea


class PlacesQueryItem(BaseModel):
    id: str
    textQuery: str
    includedType: str | None = None
    maxResultCount: int = Field(default=20, ge=1, le=20)


class PlacesQueriesConfig(BaseModel):
    zagreb_location: ZagrebLocation
    queries: list[PlacesQueryItem]
    max_places_upserted: int | None = Field(
        default=None,
        description="Stop sync after this many successful place upserts; null = no limit",
    )
    max_pages_per_query: int = Field(
        default=15,
        ge=1,
        le=50,
        description="Max nextPageToken pages per query row (Google Text Search pagination)",
    )


class RouteEntry(BaseModel):
    name: str
    method: Literal["GET", "POST", "PUT", "PATCH", "DELETE"]
    path: str


class RoutesConfig(BaseModel):
    api_root: str = Field(default="/api/v1")
    routes: list[RouteEntry]


class SecretsConfig(BaseModel):
    model_config = ConfigDict(extra="ignore")

    google_places_api_key: str


class AppPaths(BaseModel):
    """Resolved paths for config and data files."""

    project_root: Path
    places_queries_path: Path
    routes_path: Path
    secrets_path: Path
    places_json_path: Path

    @classmethod
    def from_project_root(cls, root: Path | None = None) -> AppPaths:
        root = root or Path(__file__).resolve().parent.parent
        return cls(
            project_root=root,
            places_queries_path=root / "config" / "places_queries.json",
            routes_path=root / "config" / "routes.json",
            secrets_path=root / "config" / "secrets.json",
            places_json_path=root / "places_data.json",
        )


def load_places_queries(path: Path) -> PlacesQueriesConfig:
    return PlacesQueriesConfig.model_validate_json(path.read_text(encoding="utf-8"))


def load_routes(path: Path) -> RoutesConfig:
    return RoutesConfig.model_validate_json(path.read_text(encoding="utf-8"))


def load_secrets(path: Path) -> SecretsConfig:
    if not path.is_file():
        raise FileNotFoundError(
            f"Missing {path}. Copy config/secrets.example.json to config/secrets.json."
        )
    return SecretsConfig.model_validate_json(path.read_text(encoding="utf-8"))


def health_payload() -> dict:
    return {"status": "ok", "version": __version__}
