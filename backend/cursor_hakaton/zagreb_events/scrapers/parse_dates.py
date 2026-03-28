import re
from datetime import date, datetime

_RE_DDMMYYYY = re.compile(
    r"(?P<d>\d{1,2})\.(?P<m>\d{1,2})\.(?P<y>\d{4})\."
)
_RE_TIME = re.compile(r"(?P<h>\d{1,2})[.:](?P<min>\d{2})\s*h?", re.I)


def parse_hr_event_line(line: str) -> tuple[str | None, str | None]:
    """Extract optional ISO start time and venue-ish tail from labels like '01.04.2026. 20:00h Arena'."""
    line = (line or "").replace("\n", " ").strip()
    if not line:
        return None, None
    m = _RE_DDMMYYYY.search(line)
    if not m:
        return None, line
    d, mo, y = int(m.group("d")), int(m.group("m")), int(m.group("y"))
    rest = line[m.end() :].strip()
    h, minute = 12, 0
    tm = _RE_TIME.search(rest)
    if tm:
        h, minute = int(tm.group("h")), int(tm.group("min"))
        rest = (rest[: tm.start()] + rest[tm.end() :]).strip()
        rest = re.sub(r"^[h:\s.-]+", "", rest, flags=re.I).strip()
    try:
        dt = datetime(y, mo, d, h, minute)
        iso = dt.isoformat()
    except ValueError:
        iso = None
    venue = rest if rest else None
    return iso, venue


def format_api_day(d: date) -> str:
    return f"{d.day:02d}.{d.month:02d}.{d.year}"
