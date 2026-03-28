"""Dedupe event rows and assign a coarse ``category`` label (HR) for JSON/UI."""

from __future__ import annotations

import re
import unicodedata
from urllib.parse import urlparse

CATEGORIES = (
    "umjetnost",
    "kultura",
    "zabava",
    "sport",
    "odmor",
    "hrana",
    "glazba",
    "film",
    "sajam",
    "obiteljski",
    "edukacija",
    "ostalo",
)

_INFOZAGREB_PATH_HINTS: list[tuple[str, str]] = [
    ("sportska-dogadanja", "sport"),
    ("koncerti-i-glazbena-dogadanja", "glazba"),
    ("kazalisne-predstave", "kultura"),
    ("izlozbe", "umjetnost"),
    ("sajmovi-i-kongresi", "sajam"),
    ("kulturna-i-tradicionalna-dogadanja", "kultura"),
    ("zagreb-za-djecu", "obiteljski"),
    ("ostala-dogadanja", "kultura"),
]

_KEYWORD_WEIGHTS: list[tuple[str, tuple[str, ...]]] = [
    (
        "sport",
        (
            "sport",
            "utakmic",
            "maraton",
            "trail",
            "mma",
            "fight",
            "nogomet",
            "košark",
            "kosark",
            "plivanj",
            "bicikl",
            "gimnastic",
            "utrka",
            "prvenstvo",
            "superkup",
            "medvednic",
            "golden fight",
            "inmusic",
            "trail ",
            "liga",
            "nogometn",
        ),
    ),
    (
        "hrana",
        (
            "gastro",
            "food festival",
            "coffee festival",
            "gr8 coffee",
            "sajam hrane",
            " vinski",
            " vino",
            "wine",
            " opg",
            "kuhanj",
            " gastronom",
            "brunch",
        ),
    ),
    ("film", (" film", " kino", "dokumentir", "premijera", "filmski ", "filmski klub", "kino")),
    (
        "glazba",
        (
            "koncert",
            " glazb",
            "pjevanj",
            "pjevač",
            "pjevac",
            " band",
            "orkestar",
            "dj ",
            "muzič",
            "muzic",
            "glazben",
        ),
    ),
    ("zabava", ("stand-up", "stand up", "comedy", "humor", " party", " cabaret", "zabavn")),
    ("umjetnost", ("izložb", "izlozb", "likovn", "galerij", "slikar", "skulptur", " umjetn", "mural")),
    ("edukacija", ("radionic", "predavanj", "znanost", "tjedan znanosti", " seminar", "tribin", "edukac", "muzej učenik")),
    ("odmor", ("wellness", " odmor", "izlet", " piknik", " šetnj", " setnj", "odmor u gradu")),
    ("obiteljski", (" za djec", " djecu", " obitelj", "obiteljsk", "family", " djeca")),
    ("sajam", ("sajam", "kongres", "velesajam", "interliber", "floraart", "kongresni")),
    (
        "kultura",
        (
            "kazališ",
            "kazalis",
            "predstava",
            "balet",
            "opera",
            "tradicij",
            "folklor",
            "pasion",
            " knjiž",
            " knjiz",
            "čitanic",
            "citanic",
            "knjižnic",
            "knjiznic",
            "muzej",
        ),
    ),
]


def _fold(s: str) -> str:
    if not s:
        return ""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.lower()


def _norm_url(u: str) -> str:
    if not u:
        return ""
    p = urlparse(u.strip())
    path = (p.path or "").rstrip("/").lower()
    netloc = (p.netloc or "").lower()
    return f"{netloc}{path}"


def _category_from_infozagreb_path(url: str) -> str | None:
    path = urlparse(url).path.lower()
    for segment, cat in _INFOZAGREB_PATH_HINTS:
        if f"/{segment}/" in path or path.rstrip("/").endswith(segment):
            return cat
    return None


def categorize_event(row: dict) -> str:
    url = str(row.get("url") or "")
    title = str(row.get("title") or "")
    venue = str(row.get("venue") or "")
    address = str(row.get("address") or "")
    blob = _fold(f"{title} {venue} {address} {url}")

    hint = _category_from_infozagreb_path(url)
    if hint:
        return hint

    scores: dict[str, float] = {c: 0.0 for c in CATEGORIES}
    for cat, kws in _KEYWORD_WEIGHTS:
        for kw in kws:
            kwf = _fold(kw.strip())
            if kwf and kwf in blob:
                scores[cat] += 1.0 + 0.1 * len(kwf)

    best = max(scores, key=lambda c: scores[c])
    if scores[best] <= 0:
        return "kultura"
    return best


def _row_quality(r: dict) -> float:
    q = 0.0
    if r.get("lat") is not None and r.get("lng") is not None:
        q += 10.0
    if r.get("address"):
        q += 5.0
    v = str(r.get("venue") or "").strip()
    if len(v) > 4 and not re.match(r"^\d{4}\.?$", v):
        q += 3.0
    if r.get("source") == "kultura":
        q += 2.0
    if r.get("end_at"):
        q += 0.5
    return q


def _norm_title_key(title: str) -> str:
    t = _fold(title.strip())
    t = re.sub(r"[^\w\s]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t[:120]


def dedupe_events(rows: list[dict]) -> list[dict]:
    by_url: dict[str, list[dict]] = {}
    no_url: list[dict] = []
    for r in rows:
        u = _norm_url(str(r.get("url") or ""))
        if u:
            by_url.setdefault(u, []).append(r)
        else:
            no_url.append(dict(r))

    stage1: list[dict] = [dict(max(g, key=_row_quality)) for g in by_url.values()]
    stage1.extend(no_url)

    by_title_date: dict[tuple[str, str], list[dict]] = {}
    for r in stage1:
        tk = _norm_title_key(str(r.get("title") or ""))
        d = str(r.get("start_at") or "")[:10]
        key = (tk or f"__u_{r.get('id')}", d)
        by_title_date.setdefault(key, []).append(r)

    return [dict(max(g, key=_row_quality)) for g in by_title_date.values()]


def enrich_events(rows: list[dict]) -> list[dict]:
    deduped = dedupe_events(rows)
    out: list[dict] = []
    for r in deduped:
        nr = dict(r)
        nr["category"] = categorize_event(nr)
        out.append(nr)
    out.sort(key=lambda x: (x.get("start_at") is None, x.get("start_at") or ""))
    return out
