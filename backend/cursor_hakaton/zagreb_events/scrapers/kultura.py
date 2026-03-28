"""kultura.zagreb.hr is a Next.js client-rendered listing — scrape in Chromium."""

from __future__ import annotations

from urllib.parse import urlparse

from zagreb_events.scrapers.parse_dates import parse_hr_event_line


def _extract_dom_playwright() -> list[dict[str, str]]:
    from playwright.sync_api import sync_playwright

    base = "https://kultura.zagreb.hr/dogadanja"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            page = browser.new_page()
            page.set_default_timeout(120_000)
            page.goto(base, wait_until="domcontentloaded")
            page.wait_for_function(
                """() => {
                  const has = [...document.querySelectorAll('a')]
                    .some(a => a.href.includes('/dogadanja/') &&
                      !a.href.replace(/\\/$/, '').endsWith('/dogadanja'));
                  return has;
                }""",
                timeout=90_000,
            )
            rows = page.evaluate(
                """() => {
                  const out = [];
                  const seen = new Set();
                  document.querySelectorAll('a[href*="/dogadanja/"]').forEach((a) => {
                    const u = a.href;
                    if (!u.includes('kultura.zagreb.hr')) return;
                    if (u.replace(/\\/$/, '').endsWith('/dogadanja')) return;
                    if (seen.has(u)) return;
                    seen.add(u);
                    const card = a.closest('article') || a.closest('[class*="card"]') || a.parentElement;
                    const titleEl = card?.querySelector('h1,h2,h3,h4') || a;
                    const title = (titleEl?.textContent || '').trim().split('\\n')[0].trim();
                    const blurb = (a.textContent || '').trim();
                    if (title) out.push({ href: u, title, blurb });
                  });
                  return out;
                }"""
            )
        finally:
            browser.close()
    return rows


def fetch_kultura_events() -> list[dict]:
    raw = _extract_dom_playwright()
    out: list[dict] = []
    for row in raw:
        href = row.get("href") or ""
        title = (row.get("title") or "").strip()
        blurb = row.get("blurb") or ""
        if not href or not title:
            continue
        parsed = urlparse(href)
        external_key = f"kultura:{parsed.path.rstrip('/')}"
        start_at, extra_venue = parse_hr_event_line(blurb)
        venue = extra_venue
        out.append(
            {
                "source": "kultura",
                "external_key": external_key,
                "title": title,
                "url": href,
                "start_at": start_at,
                "end_at": None,
                "venue": venue,
                "address": None,
                "lat": None,
                "lng": None,
            }
        )
    return out
