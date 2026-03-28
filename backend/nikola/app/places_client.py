"""Google Places API (New) HTTP client."""

from __future__ import annotations

from typing import Any
from urllib.parse import quote

import httpx

TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"

# Response fields for Text Search (New)
SEARCH_FIELD_MASK = (
    "places.id,"
    "places.displayName,"
    "places.formattedAddress,"
    "places.location,"
    "places.types,"
    "places.rating,"
    "places.userRatingCount"
)

# Place Details field mask
DETAILS_FIELD_MASK = (
    "id,"
    "displayName,"
    "formattedAddress,"
    "location,"
    "rating,"
    "userRatingCount,"
    "types,"
    "reviews"
)


def normalize_place_id(place_id_or_name: str) -> str:
    if place_id_or_name.startswith("places/"):
        return place_id_or_name.split("/", 1)[1]
    return place_id_or_name


def place_details_url(place_id_or_name: str) -> str:
    pid = normalize_place_id(place_id_or_name)
    return f"https://places.googleapis.com/v1/places/{quote(pid, safe='')}"


class PlacesClient:
    def __init__(self, api_key: str, timeout: float = 60.0) -> None:
        self._api_key = api_key
        self._timeout = timeout

    def _headers(self, field_mask: str) -> dict[str, str]:
        return {
            "X-Goog-Api-Key": self._api_key,
            "X-Goog-FieldMask": field_mask,
            "Content-Type": "application/json",
        }

    def search_text(
        self,
        *,
        text_query: str,
        location_bias_circle: dict[str, Any],
        included_type: str | None,
        max_result_count: int,
        page_token: str | None = None,
    ) -> dict[str, Any]:
        # Text Search (New): locationRestriction only allows rectangle, not circle.
        # Circle bias is valid under locationBias (see Places API searchText reference).
        body: dict[str, Any] = {
            "textQuery": text_query,
            "locationBias": {"circle": location_bias_circle},
            "regionCode": "HR",
            "maxResultCount": max_result_count,
        }
        if included_type:
            body["includedType"] = included_type
        if page_token:
            body["pageToken"] = page_token

        with httpx.Client(timeout=self._timeout) as client:
            r = client.post(
                TEXT_SEARCH_URL,
                headers=self._headers(SEARCH_FIELD_MASK),
                json=body,
            )
            r.raise_for_status()
            return r.json()

    def get_place_details(self, place_id_or_name: str) -> dict[str, Any]:
        url = place_details_url(place_id_or_name)
        with httpx.Client(timeout=self._timeout) as client:
            r = client.get(
                url,
                headers=self._headers(DETAILS_FIELD_MASK),
            )
            r.raise_for_status()
            return r.json()
