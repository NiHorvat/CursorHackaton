#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v uv >/dev/null 2>&1; then
  echo "uv is required: https://docs.astral.sh/uv/installation/" >&2
  exit 1
fi

uv sync

if [[ ! -f "$ROOT/config/secrets.json" ]]; then
  cp "$ROOT/config/secrets.example.json" "$ROOT/config/secrets.json"
  echo "Created config/secrets.json from secrets.example.json — edit Google Places API key before sync."
fi

echo "Install complete. Run: ./scripts/run.sh"
