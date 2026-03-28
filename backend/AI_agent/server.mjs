import dotenv from "dotenv";
import cors from "cors";
import { readFileSync } from "fs";
import OpenAI from "openai";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

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

function resolvePlacesDataPath() {
  if (process.env.PLACES_DATA_PATH) {
    const p = process.env.PLACES_DATA_PATH.startsWith("/")
      ? process.env.PLACES_DATA_PATH
      : join(__dirname, process.env.PLACES_DATA_PATH);
    try {
      readFileSync(p);
    } catch (e) {
      throw new Error(`PLACES_DATA_PATH not readable: ${p} (${e.message})`);
    }
    return p;
  }
  const candidates = [
    join(__dirname, "places_data.json"),
    join(__dirname, "..", "nikola", "places_data.json"),
  ];
  for (const p of candidates) {
    try {
      readFileSync(p);
      return p;
    } catch {
      /* try next */
    }
  }
  throw new Error(
    "places_data.json not found. Put it in AI_agent/ or backend/nikola/, or set PLACES_DATA_PATH",
  );
}

let placesDataPathLogged = "";

function normalizePlaceRow(raw) {
  const types = Array.isArray(raw.types) ? raw.types : [];
  const loc = raw.location || {};
  const lat = raw.lat ?? loc.lat ?? loc.latitude;
  const lng = raw.lng ?? loc.lng ?? loc.longitude;
  return {
    ...raw,
    types,
    lat,
    lng,
    primary_type: types[0] ?? raw.primary_type ?? null,
  };
}

function loadAllPlacesFromFile() {
  const path = resolvePlacesDataPath();
  placesDataPathLogged = path;
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const arr = Array.isArray(raw) ? raw : raw.places;
  if (!Array.isArray(arr)) {
    throw new Error("places_data.json must be { places: [...] } or a bare array");
  }
  return arr.map(normalizePlaceRow);
}

let allPlaces;
let placeByIdFull;
try {
  allPlaces = loadAllPlacesFromFile();
  placeByIdFull = Object.fromEntries(allPlaces.map((p) => [p.id, p]));
} catch (e) {
  console.error("[AI_agent] Failed to load places data:", e.message);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

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
        "Loads places from the local places_data.json export (no HTTP). Each item: Google id, name, types, primary_type, query_id, lat/lng, address, rating, user_ratings_total, reviews (use review text for recommendations). Optional category filters by query_id or a value in types (e.g. nightclubs, night_club, bar, pub, cafe, restaurant). Optional q filters name substring.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Filter: match query_id (e.g. nightclubs, bars) OR any Google type in types[] (e.g. night_club, bar, pub).",
          },
          q: { type: "string", description: "Case-insensitive substring match on place name." },
        },
        additionalProperties: false,
      },
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
- For nightlife/clubbing, call fetch_places_catalog with category nightclubs, night_club, bars, bar, pubs, or pub.
- Prefer 2–5 concrete suggestions when recommending; mention area and why it fits the user's prompt; cite review themes when helpful.
- If something is not in the tool data, say you don't have it in the current catalogs instead of inventing.
- Keep answers readable; use short paragraphs or bullets.`;

const RECOMMEND_SYSTEM_PROMPT = `You are a Zagreb planning assistant for a map UI. Your job is to gather facts via tools, then (in a later step) produce structured picks.

Rules:
- Always call fetch_places_catalog and/or fetch_events_catalog before reasoning about specific venues or events. You have no catalog data until tools return.
- Places come from local places_data.json (tool response includes reviews); events from events.json. Combine them logically (e.g. clubbing → night_club/bar places; events optional).
- When you eventually choose pins, you may ONLY reference ids from those tool payloads: places use Google place_id strings (ChIJ…); events use stringified numeric ids from the events items (e.g. "37"). Never invent ids or coordinates.
- Prefer 2–6 strong matches; use ratings and review text from the tool to justify picks.
- If the user mentions a date or "tonight", prefer events that plausibly match; if none match, recommend relevant places only and say so in the summary later.`;

function filterPlacesCatalog(category, q) {
  let out = allPlaces;
  if (category) {
    out = out.filter(
      (p) =>
        p.query_id === category ||
        (Array.isArray(p.types) && p.types.includes(category)),
    );
  }
  if (q && typeof q === "string" && q.trim()) {
    const s = q.trim().toLowerCase();
    out = out.filter((p) => (p.name || "").toLowerCase().includes(s));
  }
  return out;
}

function slimPlaceForTool(p) {
  const maxR = Number(process.env.PLACES_TOOL_REVIEWS_PER_PLACE) || 6;
  const maxChars = Number(process.env.PLACES_TOOL_REVIEW_MAX_CHARS) || 600;
  const revs = (p.reviews || []).slice(0, maxR).map((r) => {
    const t = r.text;
    const text =
      typeof t === "string" && t.length > maxChars ? `${t.slice(0, maxChars)}…` : t;
    return {
      author: r.author,
      rating: r.rating,
      text,
      time: r.time,
    };
  });
  return {
    id: p.id,
    name: p.name,
    primary_type: p.primary_type,
    types: p.types,
    query_id: p.query_id,
    address: p.address,
    lat: p.lat,
    lng: p.lng,
    rating: p.rating,
    user_ratings_total: p.user_ratings_total,
    last_synced_at: p.last_synced_at,
    reviews: revs,
  };
}

function buildPlacesToolPayload(args = {}) {
  const category = typeof args.category === "string" ? args.category : undefined;
  const q = typeof args.q === "string" ? args.q : undefined;
  const filtered = filterPlacesCatalog(category, q);
  const withGeo = filtered.filter(
    (p) =>
      p.lat != null &&
      p.lng != null &&
      Number.isFinite(Number(p.lat)) &&
      Number.isFinite(Number(p.lng)),
  );
  const maxItems = Number(process.env.PLACES_TOOL_MAX_ITEMS) || 120;
  const truncated = withGeo.length > maxItems;
  const slice = truncated ? withGeo.slice(0, maxItems) : withGeo;
  const items = slice.map(slimPlaceForTool);
  return {
    source: "places_data.json",
    file: placesDataPathLogged,
    items,
    total_matching: withGeo.length,
    items_returned: items.length,
    truncated,
    filters: { category: category ?? null, q: q ?? null },
    total_in_file: allPlaces.length,
    hint:
      items.length === 0
        ? "No places matched filters. Try another category or omit filters for a capped sample (still truncated if huge)."
        : truncated
          ? `Capped at ${maxItems} rows. Narrow with category or q. Use reviews and ratings in items to justify recommendations.`
          : "Use reviews and ratings in items to justify recommendations. Only recommend ids from items.",
  };
}

function parseToolArgs(argumentsJson) {
  if (!argumentsJson || typeof argumentsJson !== "string") return {};
  try {
    const o = JSON.parse(argumentsJson);
    return o && typeof o === "object" && !Array.isArray(o) ? o : {};
  } catch {
    return {};
  }
}

async function runToolAsync(name, argumentsJson) {
  if (name === "fetch_places_catalog") {
    const args = parseToolArgs(argumentsJson);
    return JSON.stringify(buildPlacesToolPayload(args));
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
  const out = [];
  for (const pin of pins) {
    if (!pin || (pin.kind !== "place" && pin.kind !== "event")) continue;
    const key = String(pin.id);
    const row = pin.kind === "place" ? placeByIdFull[key] : eventById[key];
    if (!row) continue;
    const reason = typeof pin.reason === "string" ? pin.reason : "";
    const lat = row.lat ?? row.latitude ?? row.location?.lat;
    const lng = row.lng ?? row.longitude ?? row.location?.lng;
    const base = {
      kind: pin.kind,
      id: key,
      reason,
      latitude: lat,
      longitude: lng,
      address: row.address ?? null,
    };
    if (pin.kind === "place") {
      const typeLabel =
        row.primary_type ?? (Array.isArray(row.types) ? row.types[0] : null) ?? "place";
      out.push({
        ...base,
        lat,
        lng,
        name: row.name,
        type: typeLabel,
        primary_type: row.primary_type,
        types: row.types,
        query_id: row.query_id,
        rating: row.rating,
        user_ratings_total: row.user_ratings_total,
        last_synced_at: row.last_synced_at,
        reviews: row.reviews,
        area: row.area ?? null,
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
        category: row.category ?? null,
        start_at: row.start_at,
        end_at: row.end_at,
        url: row.url,
        source: row.source,
        external_key: row.external_key,
        date,
        time,
        area: row.area ?? null,
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
      const output = await runToolAsync(call.function.name, call.function.arguments);
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

function parseStructuredRecommendationContent(content) {
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Empty structured response from model");
  }
  const trimmed = content.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/im);
  const jsonStr = fence ? fence[1].trim() : trimmed;
  return JSON.parse(jsonStr);
}

function openAIErrorMessage(err) {
  if (!err) return "Unknown error";
  const apiMsg = err?.response?.data?.error?.message;
  if (typeof apiMsg === "string" && apiMsg.trim()) return apiMsg;
  if (typeof err.message === "string") return err.message;
  return String(err);
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
      const output = await runToolAsync(call.function.name, call.function.arguments);
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
      "Produce the final map recommendation JSON. summary: one or two sentences for the UI. pins: 2–6 entries. Each pin: kind \"place\" or \"event\", id copied exactly from the catalog tool responses you received, and a short reason tied to the user's request (for places, reasons can reflect reviews/ratings from the tool). Only ids that exist in those catalogs. If none match, return an empty pins array and explain in summary.",
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
  let parsed;
  try {
    parsed = parseStructuredRecommendationContent(content);
  } catch (parseErr) {
    throw new Error(
      `Invalid JSON from model: ${parseErr.message}. Raw (first 400 chars): ${String(content).slice(0, 400)}`,
    );
  }

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
  const pGeo = allPlaces.filter(
    (p) =>
      p.lat != null &&
      p.lng != null &&
      Number.isFinite(Number(p.lat)) &&
      Number.isFinite(Number(p.lng)),
  );
  res.json({
    ok: true,
    service: "zagreb-ai-agent",
    places: {
      file: placesDataPathLogged,
      loaded: allPlaces.length,
      with_coordinates: pGeo.length,
      max_sent_to_model: Number(process.env.PLACES_TOOL_MAX_ITEMS) || 120,
    },
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
      detail: openAIErrorMessage(err),
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
      detail: openAIErrorMessage(err),
    });
  }
});

const port = Number(process.env.PORT) || 3080;
app.listen(port, () => {
  console.log(`Zagreb AI agent listening on http://localhost:${port}`);
});
