import dotenv from "dotenv";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });
import cors from "cors";
import OpenAI from "openai";

const EVENTS_PATH = join(__dirname, "events.json");

function loadAllEvents() {
  try {
    const raw = readFileSync(EVENTS_PATH, "utf8");
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) throw new Error("events.json must be a JSON array");
    return arr;
  } catch (e) {
    console.error("[AI_agent] Failed to load events.json:", e.message);
    process.exit(1);
  }
}

const allEvents = loadAllEvents();
const eventById = Object.fromEntries(allEvents.map((e) => [String(e.id), e]));

const app = express();
app.use(cors());
app.use(express.json());

/** Last successful `fetch_places_catalog` items from nikola (GET …/places). */
let latestPlacesItems = [];

function slimEventForTool(e) {
  return {
    id: String(e.id),
    title: e.title,
    start_at: e.start_at,
    end_at: e.end_at,
    venue: e.venue,
    address: e.address,
    lat: e.lat,
    lng: e.lng,
    url: e.url,
    source: e.source,
  };
}

function buildEventsToolPayload() {
  const maxItems = Number(process.env.EVENTS_TOOL_MAX_ITEMS) || 250;
  const withGeo = allEvents.filter(
    (e) =>
      e.lat != null &&
      e.lng != null &&
      Number.isFinite(Number(e.lat)) &&
      Number.isFinite(Number(e.lng)),
  );
  const sorted = [...withGeo].sort((a, b) => {
    const ta = Date.parse(a.start_at);
    const tb = Date.parse(b.start_at);
    return (Number.isFinite(ta) ? ta : 0) - (Number.isFinite(tb) ? tb : 0);
  });
  const slice = sorted.slice(0, maxItems);
  const items = slice.map(slimEventForTool);
  return {
    source: "events-backend",
    items,
    total_in_file: allEvents.length,
    total_with_coordinates: withGeo.length,
    items_returned: items.length,
    truncated: withGeo.length > maxItems,
    hint:
      "Event ids are stringified numbers (e.g. \"37\"). Only recommend events listed in `items`. Entries without coordinates are omitted from this list.",
  };
}

let openaiClient;
function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

const tools = [
  {
    type: "function",
    function: {
      name: "fetch_places_catalog",
      description:
        "Fetches places from the nikola backend (GET /api/v1/places). Each item: Google place id, name, primary_type, lat/lng, address, rating, reviews. Required for any place recommendations.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "fetch_events_catalog",
      description:
        "Returns Zagreb events from the local events.json snapshot: id (string number), title, start_at/end_at, venue, address, lat/lng, url, source. Sorted by start time; only events with coordinates; list may be truncated (see hint in response). Use for timed activities, exhibitions, concerts.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
];

const MAP_RECOMMENDATION_JSON_SCHEMA = {
  name: "map_recommendation",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      summary: { type: "string" },
      pins: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            kind: { type: "string", enum: ["place", "event"] },
            id: { type: "string" },
            reason: { type: "string" },
          },
          required: ["kind", "id", "reason"],
        },
      },
    },
    required: ["summary", "pins"],
  },
};

const SYSTEM_PROMPT = `You are a concise Zagreb city guide assistant. You help visitors combine places to visit with events to attend.

Rules:
- You do NOT have live data until you call the tools. Always call fetch_places_catalog and/or fetch_events_catalog when you need facts.
- The places and events systems are independent; synthesize answers yourself from tool outputs.
- Prefer 2–5 concrete suggestions when recommending; mention area and why it fits the user's prompt.
- If something is not in the tool data, say you don't have it in the current catalogs instead of inventing.
- Keep answers readable; use short paragraphs or bullets.`;

const RECOMMEND_SYSTEM_PROMPT = `You are a Zagreb planning assistant for a map UI. Your job is to gather facts via tools, then (in a later step) produce structured picks.

Rules:
- Always call fetch_places_catalog and/or fetch_events_catalog before reasoning about specific venues or events. You have no catalog data until tools return.
- Places and events live in separate systems; combine them logically for the user's request (e.g. evening party → nightlife places + same-night events if any).
- When you eventually choose pins, you may ONLY reference ids from those tool payloads: places use Google place_id strings (ChIJ…); events use stringified numeric ids from the events items (e.g. "37"). Never invent ids or coordinates.
- Prefer 2–6 strong matches; skip weak fits.
- If the user mentions a date or "tonight", prefer events that plausibly match; if none match, recommend relevant places only and say so in the summary later.`;

async function fetchPlacesFromNikolaRoute() {
  const base = process.env.PLACES_API_BASE_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("PLACES_API_BASE_URL is not set (nikola api root, e.g. http://127.0.0.1:8000/api/v1)");
  }
  const url = `${base}/places`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.items)) {
    throw new Error("places response missing items array");
  }
  return data.items;
}

async function runToolAsync(name) {
  if (name === "fetch_places_catalog") {
    try {
      const items = await fetchPlacesFromNikolaRoute();
      latestPlacesItems = items;
      const payload = {
        source: "places-backend",
        items,
        total: items.length,
      };
      if (items.length === 0) {
        payload.hint =
          "No rows in nikola DB yet. Trigger sync: GET or POST /api/v1/sync on the places service.";
      }
      return JSON.stringify(payload);
    } catch (e) {
      console.warn("[AI_agent] places fetch failed:", e.message);
      latestPlacesItems = [];
      return JSON.stringify({
        source: "places-backend",
        error: e.message,
        items: [],
        total: 0,
      });
    }
  }
  if (name === "fetch_events_catalog") {
    return JSON.stringify(buildEventsToolPayload());
  }
  return JSON.stringify({ error: "unknown_tool", name });
}

/**
 * @param {{ kind: string, id: string, reason: string }[]} pins
 * @returns {object[]}
 */
function enrichPins(pins) {
  if (!Array.isArray(pins)) return [];
  const placeById = Object.fromEntries(latestPlacesItems.map((p) => [p.id, p]));
  const out = [];
  for (const pin of pins) {
    if (!pin || (pin.kind !== "place" && pin.kind !== "event")) continue;
    const key = String(pin.id);
    const row = pin.kind === "place" ? placeById[key] : eventById[key];
    if (!row) continue;
    const reason = typeof pin.reason === "string" ? pin.reason : "";
    const lat = row.lat ?? row.latitude;
    const lng = row.lng ?? row.longitude;
    const base = {
      kind: pin.kind,
      id: key,
      reason,
      latitude: lat,
      longitude: lng,
      address: row.address ?? null,
    };
    if (pin.kind === "place") {
      out.push({
        ...base,
        lat,
        lng,
        name: row.name,
        primary_type: row.primary_type,
        rating: row.rating,
        user_ratings_total: row.user_ratings_total,
        last_synced_at: row.last_synced_at,
        reviews: row.reviews,
      });
    } else {
      if (lat == null || lng == null) continue;
      let date = null;
      let time = null;
      if (typeof row.start_at === "string" && row.start_at.includes("T")) {
        const [d, rest] = row.start_at.split("T");
        date = d;
        time = rest?.slice(0, 5) ?? null;
      }
      out.push({
        ...base,
        lat,
        lng,
        title: row.title,
        venue: row.venue,
        start_at: row.start_at,
        end_at: row.end_at,
        url: row.url,
        source: row.source,
        external_key: row.external_key,
        date,
        time,
      });
    }
  }
  return out;
}

function sanitizeHistory(history) {
  return Array.isArray(history)
    ? history
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string"
        )
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content }))
    : [];
}

async function runAgentTurn(userMessage, history = []) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userMessage },
  ];

  const openai = getOpenAI();
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  let response = await openai.chat.completions.create({
    model,
    messages,
    tools,
    tool_choice: "auto",
  });

  let choice = response.choices[0];
  const maxSteps = 6;

  for (let step = 0; step < maxSteps; step++) {
    const msg = choice.message;
    messages.push(msg);

    const toolCalls = msg.tool_calls;
    if (!toolCalls?.length) {
      return {
        reply: msg.content || "",
        finishReason: choice.finish_reason,
      };
    }

    for (const call of toolCalls) {
      const output = await runToolAsync(call.function.name);
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: output,
      });
    }

    response = await getOpenAI().chat.completions.create({
      model,
      messages,
      tools,
      tool_choice: "auto",
    });
    choice = response.choices[0];
  }

  return {
    reply: choice.message?.content || "Sorry, too many tool steps; try a simpler question.",
    finishReason: choice.finish_reason,
  };
}

async function runRecommendTurn(userMessage, history = []) {
  const messages = [
    { role: "system", content: RECOMMEND_SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userMessage },
  ];

  const openai = getOpenAI();
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  let response = await openai.chat.completions.create({
    model,
    messages,
    tools,
    tool_choice: "auto",
  });

  let choice = response.choices[0];
  const maxSteps = 6;

  for (let step = 0; step < maxSteps; step++) {
    const msg = choice.message;
    messages.push(msg);

    const toolCalls = msg.tool_calls;
    if (!toolCalls?.length) {
      break;
    }

    for (const call of toolCalls) {
      const output = await runToolAsync(call.function.name);
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: output,
      });
    }

    response = await openai.chat.completions.create({
      model,
      messages,
      tools,
      tool_choice: "auto",
    });
    choice = response.choices[0];
  }

  messages.push({
    role: "user",
    content:
      "Produce the final map recommendation JSON. summary: one or two sentences for the UI. pins: 2–6 entries. Each pin: kind \"place\" or \"event\", id copied exactly from the catalog tool responses you received, and a short reason tied to the user's request. Only ids that exist in those catalogs. If none match, return an empty pins array and explain in summary.",
  });

  const jsonResponse = await openai.chat.completions.create({
    model,
    messages,
    response_format: {
      type: "json_schema",
      json_schema: MAP_RECOMMENDATION_JSON_SCHEMA,
    },
  });

  const content = jsonResponse.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty structured response from model");
  }

  const parsed = JSON.parse(content);
  const pins = enrichPins(parsed.pins);
  return {
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
    pins,
    droppedInvalidPins:
      Array.isArray(parsed.pins) && parsed.pins.length > pins.length,
  };
}

app.get("/health", (_req, res) => {
  const maxItems = Number(process.env.EVENTS_TOOL_MAX_ITEMS) || 250;
  const withGeo = allEvents.filter(
    (e) =>
      e.lat != null &&
      e.lng != null &&
      Number.isFinite(Number(e.lat)) &&
      Number.isFinite(Number(e.lng)),
  );
  res.json({
    ok: true,
    service: "zagreb-ai-agent",
    events: {
      loaded: allEvents.length,
      with_coordinates: withGeo.length,
      max_sent_to_model: maxItems,
    },
  });
});

app.post("/chat", async (req, res) => {
  const { message, history } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Body must include a string \"message\"." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set." });
  }

  const safeHistory = sanitizeHistory(history);

  try {
    const { reply, finishReason } = await runAgentTurn(message, safeHistory);
    res.json({ reply, finishReason });
  } catch (err) {
    console.error(err);
    res.status(502).json({
      error: "OpenAI request failed",
      detail: err.message,
    });
  }
});

app.post("/recommend", async (req, res) => {
  const { message, history } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Body must include a string \"message\"." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set." });
  }

  const safeHistory = sanitizeHistory(history);

  try {
    const { summary, pins, droppedInvalidPins } = await runRecommendTurn(message, safeHistory);
    res.json({ summary, pins, droppedInvalidPins });
  } catch (err) {
    console.error(err);
    res.status(502).json({
      error: "OpenAI request failed",
      detail: err.message,
    });
  }
});

const port = Number(process.env.PORT) || 3080;
app.listen(port, () => {
  console.log(`Zagreb AI agent listening on http://localhost:${port}`);
});
