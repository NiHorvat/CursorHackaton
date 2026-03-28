# Backend: Zagreb places (nikola) + AI agent

This folder contains two services that work together:

| Service | Role | Default URL |
|--------|------|-------------|
| **nikola** | FastAPI app: loads places from Google Places into SQLite and serves them at `GET /api/v1/places`. | `http://127.0.0.1:8000` |
| **AI_agent** | Node/Express + OpenAI: answers prompts and returns map-friendly recommendations; **places** from nikola over HTTP; **events** from the local `events.json` snapshot (ship/update the file as needed). | `http://127.0.0.1:3080` |

---

## Prerequisites

- **Node.js** (v18+ recommended; global `fetch` is used).
- **uv** (Python toolchain for nikola): [Installing uv](https://docs.astral.sh/uv/installation/).
- **OpenAI API key** for the agent.
- **Google Places API key** in nikola if you want to **sync** real venues (optional for API shape tests; an empty DB returns no place items).

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
| `PLACES_API_BASE_URL` | **Required** for place data. Must match nikola’s API root, e.g. `http://127.0.0.1:8000/api/v1`. |
| `PORT` | Agent HTTP port (default `3080`). Change if the port is already in use. |
| `OPENAI_MODEL` | Optional (default `gpt-4o-mini`). |
| `EVENTS_TOOL_MAX_ITEMS` | Optional (default `250`). Max events **with coordinates** included in each `fetch_events_catalog` tool response (the full `events.json` is still loaded for lookups). |

Keep **`AI_agent/events.json`** next to `server.mjs`. The process **exits on startup** if the file is missing or invalid JSON.

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

1. Start **nikola** (`./scripts/run.sh`).
2. If the DB is empty, call **`/api/v1/sync`** once (with a valid Google key).
3. Confirm **`GET /api/v1/places`** returns `items` with entries.
4. Start **AI_agent** with `PLACES_API_BASE_URL` pointing at nikola.
5. Call the agent endpoints below.

---

## 4. Using the AI agent HTTP API

### Health

Includes counts from `events.json` (total rows vs rows with `lat`/`lng`, and the tool cap):

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

The model calls **`fetch_places_catalog`** (nikola) and **`fetch_events_catalog`** (`events.json`). **Place** pins use Google `id` strings from nikola. **Event** pins use **string** ids matching `events.json` (e.g. `"37"` for numeric id `37`). Only events that appear in the tool’s `items` array should be recommended for maps (the tool returns a **truncated** subset: sorted by `start_at`, with coordinates only; see `truncated` / `hint` in the tool payload). Enrichment still resolves any valid event id from the **full** file if the model returns it.

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
| **Agent returns no place pins** | `PLACES_API_BASE_URL` wrong; nikola not running; or **`items` empty** — run nikola **sync** and verify `GET …/places`. |
| **Tool returns `error` for places** | Missing `PLACES_API_BASE_URL`, nikola down, or network/firewall blocking `localhost`. |
| **nikola won’t sync** | `config/secrets.json` Places key missing or invalid; billing/API enabled for Places in Google Cloud. |
| **Agent exits at startup** | Missing or invalid `AI_agent/events.json`. |
| **No event pins / model ignores events** | Many rows have `lat`/`lng` null; only geocoded events are sent in the tool. Increase `EVENTS_TOOL_MAX_ITEMS` if you need a wider window (still sorted by `start_at`). |

---

## 6. Repo layout (this backend)

```
backend/
  nikola/          # FastAPI + SQLite + Google Places sync
  AI_agent/        # Express + OpenAI; places from nikola; events from events.json
    events.json    # snapshot: id, title, start_at, venue, lat/lng, url, source, …
  README.md        # this file
```

The agent does **not** embed place rows; it loads them from **`{PLACES_API_BASE_URL}/places`** when the model invokes `fetch_places_catalog`. Events are read from **`events.json`** at process start.
