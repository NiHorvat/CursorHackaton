# Backend: Zagreb places (nikola) + AI agent

This folder contains two services that work together:

| Service | Role | Default URL |
|--------|------|-------------|
| **nikola** | FastAPI app: loads places from Google Places into SQLite and serves them at `GET /api/v1/places`. | `http://127.0.0.1:8000` |
| **AI_agent** | Node/Express + OpenAI: **places** from local **`places_data.json`** (export with `places[]`, reviews, types, `query_id`); **events** from **`events.json`**. No HTTP call to nikola for the agent. | `http://127.0.0.1:3080` |

---

## Prerequisites

- **Node.js** (v18+ recommended; global `fetch` is used).
- **uv** (Python toolchain for nikola): [Installing uv](https://docs.astral.sh/uv/installation/).
- **OpenAI API key** for the agent.
- **Google Places API key** in nikola only if you use nikola to **sync** or export data into `places_data.json` (the agent does not call nikola at runtime).

---

## 1. Run nikola (places API)

```bash
cd backend/nikola
./scripts/install.sh
```

Edit `config/secrets.json` and set `google_places_api_key` before syncing (file is created by `install.sh` from `secrets.example.json`).

Start the server:

```bash
./scripts/run.sh
```

- API root: **`/api/v1`** (see `config/routes.json`).
- Docs: **`http://127.0.0.1:8000/docs`**
- List places: **`GET http://127.0.0.1:8000/api/v1/places`**

### Load places into the database (sync)

If `GET /api/v1/places` returns `items: []`, run a sync (uses Google Places + `config/places_queries.json`):

- Browser or curl: **`GET http://127.0.0.1:8000/api/v1/sync`**  
  or **`POST http://127.0.0.1:8000/api/v1/sync`**

Then list again:

```bash
curl -s http://127.0.0.1:8000/api/v1/places | head -c 500
```

### Smoke-test nikola

From `backend/nikola`:

```bash
uv run python scripts/test_api.py --in-process
# With a live server in another terminal:
uv run python scripts/test_api.py --base-url http://127.0.0.1:8000
```

Optional: `--run-sync` (needs a valid Places key).

---

## 2. Run the AI agent

```bash
cd backend/AI_agent
cp .env.example .env
```

Edit **`.env`**:

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Required for `/chat` and `/recommend`. |
| `PORT` | Agent HTTP port (default `3080`). |
| `OPENAI_MODEL` | Optional (default `gpt-4o-mini`). |
| `PLACES_DATA_PATH` | Optional. Path to `places_data.json` (absolute or relative to `AI_agent/`). Default: `AI_agent/places_data.json` if present, else **`../nikola/places_data.json`**. |
| `PLACES_TOOL_MAX_ITEMS` | Optional (default `120`). Max place rows per `fetch_places_catalog` tool call (full file still used to enrich pins by id). |
| `PLACES_TOOL_REVIEWS_PER_PLACE` / `PLACES_TOOL_REVIEW_MAX_CHARS` | Optional caps on review text in the tool payload. |
| `EVENTS_TOOL_MAX_ITEMS` | Optional (default `250`). Max geocoded events per `fetch_events_catalog` (full `events.json` still used for enrichment). |

Keep **`AI_agent/events.json`** and a **`places_data.json`** (in `AI_agent/` or `nikola/`) next to the expected paths. The process **exits on startup** if either places file is missing/unreadable or `events.json` is invalid.

Each event object is expected to include at least: **`id`** (number), **`title`**, **`start_at`**, **`venue`**, **`address`**, **`lat`** / **`lng`** (map pins only work when both are set), **`url`**, **`source`**, **`external_key`**, **`end_at`** (optional). The model only receives a **truncated** list of geocoded events per request (see `EVENTS_TOOL_MAX_ITEMS`); the full file is still used to enrich pins by id.

The file **`data.mjs`** is documentation only (no runtime data).

Install and start:

```bash
npm install
npm start
```

Use `npm run dev` if you want the process to restart on file changes (`node --watch`).

---

## 3. Typical order (local dev)

**AI agent only:** ensure `places_data.json` and `events.json` exist, set `OPENAI_API_KEY` in `.env`, then `npm start` in `AI_agent/`.

**With nikola** (to refresh SQLite or export JSON): start nikola, run sync, export or maintain `nikola/places_data.json`; the agent reads that file by default if `AI_agent/places_data.json` is absent.

---

## 4. Using the AI agent HTTP API

### Health

Includes counts from **`places_data.json`** and **`events.json`** (and tool caps):

```bash
curl -s http://127.0.0.1:3080/health
```

### Plain chat (OpenAI text reply)

```bash
curl -s -X POST http://127.0.0.1:3080/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Suggest a coffee spot near the center"}'
```

### Map-style recommendations (JSON: summary + pins with lat/lng)

The model calls **`fetch_places_catalog`** (reads **`places_data.json`** in-process; optional `category` / `q` filters; includes **review** snippets) and **`fetch_events_catalog`**. **Place** pins use Google `id` strings from the file. **Event** pins use string ids from `events.json`. Tool payloads are **capped**; enrichment resolves any valid id from the **full** files.

```bash
curl -s -X POST http://127.0.0.1:3080/recommend \
  -H "Content-Type: application/json" \
  -d '{"message":"I want coffee somewhere relaxed"}'
```

Optional conversation context:

```json
{
  "message": "Something quieter",
  "history": [
    { "role": "user", "content": "We like cats" },
    { "role": "assistant", "content": "Here are a few ideas…" }
  ]
}
```

---

## 5. Troubleshooting

| Issue | What to check |
|-------|----------------|
| **`EADDRINUSE` on 3080** | Another process uses the port; set `PORT` in `AI_agent/.env` or stop the old agent. |
| **Agent returns no place pins** | Model didn’t return valid ids, or rows lack `lat`/`lng` in `places_data.json`. Try filters: `category=night_club` in tool, or increase `PLACES_TOOL_MAX_ITEMS`. |
| **Agent exits at startup (places)** | Missing `places_data.json` at default paths or bad `PLACES_DATA_PATH`. |
| **nikola won’t sync** | `config/secrets.json` Places key missing or invalid; billing/API enabled for Places in Google Cloud. |
| **Agent exits at startup (events)** | Missing or invalid `AI_agent/events.json`. |
| **No event pins / model ignores events** | Many rows have `lat`/`lng` null; only geocoded events are sent in the tool. Increase `EVENTS_TOOL_MAX_ITEMS` if you need a wider window (still sorted by `start_at`). |

---

## 6. Repo layout (this backend)

```
backend/
  nikola/              # FastAPI + SQLite + Places sync; optional source for places_data.json
    places_data.json   # export used by AI_agent when present (default path)
  AI_agent/
    server.mjs
    events.json
    places_data.json   # optional copy; else ../nikola/places_data.json is used
  README.md
```

The agent loads **`places_data.json`** at startup (`{ "places": [ … ] }` with `id`, `name`, `types`, `location` or `lat`/`lng`, `reviews`, `query_id`, …) and serves slices through **`fetch_places_catalog`**. Events come from **`events.json`**.
