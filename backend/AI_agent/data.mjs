/**
 * Data sources (not imported by code — see server.mjs):
 *
 * - Events: `events.json` in this folder (JSON array). Required at startup.
 * - Places: `places_data.json` — either in this folder or `backend/nikola/places_data.json`
 *   (export shape: `{ "places": [ { id, name, types, location, reviews, ... } ] }`). Required at startup.
 *
 * Set PLACES_DATA_PATH in .env to override the file path.
 */

export {};
