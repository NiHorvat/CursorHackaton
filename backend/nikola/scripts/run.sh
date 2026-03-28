#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f "$ROOT/config/secrets.json" ]]; then
  echo "Missing config/secrets.json. Run ./scripts/install.sh first." >&2
  exit 1
fi

exec uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
