# Backend: Zagreb places (nikola) + AI agent

This folder contains two services that work together:

| Service | Role | Default URL |
|--------|------|-------------|
| **nikola** | FastAPI app: loads places from Google Places into SQLite and serves them at `GET /api/v1/places`. | `http://127.0.0.1:8000` |
| **AI_agent** | Node/Express + OpenAI: answers prompts and returns map-friendly recommendations; **places** always come from nikola over HTTP. | `http://127.0.0.1:3080` |

Events in the agent are still **hardcoded** in `AI_agent/data.mjs` until you add a real events API.

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

The model calls the **places** tool (nikola) and the **events** tool (hardcoded). Pins for **places** use Google `id` values from nikola; coordinates are filled server-side from the same catalog.

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

---

## 6. Repo layout (this backend)

```
backend/
  nikola/          # FastAPI + SQLite + Google Places sync
  AI_agent/        # Express + OpenAI; fetches places from nikola
  README.md        # this file
```

The agent does **not** embed place rows; it always loads them from **`{PLACES_API_BASE_URL}/places`** when the model invokes `fetch_places_catalog`.
