"""Meet in Zagreb embeds Info Zagreb listings in the DOM; needs a real browser."""

from __future__ import annotations

from urllib.parse import urlparse

from zagreb_events.scrapers.parse_dates import parse_hr_event_line


def _extract_dom_playwright() -> list[dict[str, str]]:
    from playwright.sync_api import sync_playwright

    url = "https://www.meetinzagreb.hr/dogadanja"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            page = browser.new_page()
            page.set_default_timeout(120_000)
            page.goto(url, wait_until="domcontentloaded")
            page.wait_for_selector("h4", timeout=90_000)
            # cookie banner
            btn = page.locator("text=Prihvaćam").first
            if btn.count():
                try:
                    btn.click(timeout=5000)
                except Exception:
                    pass
            rows = page.evaluate(
                """() => {
                  const out = [];
                  document.querySelectorAll('h4').forEach((h4) => {
                    const title = (h4.textContent || '').trim();
                    if (!title) return;
                    let a = null;
                    let n = h4.nextElementSibling;
                    for (let i = 0; i < 5 && n && !a; n = n.nextElementSibling, i++) {
                      if (n.tagName === 'A' && n.href.includes('infozagreb.hr')) a = n;
                      else if (n.querySelector)
                        a = n.querySelector('a[href*="infozagreb.hr"]');
                    }
                    if (a && a.href) out.push({
                      title,
                      href: a.href,
                      blurb: (a.textContent || '').trim()
                    });
                  });
                  return out;
                }"""
            )
        finally:
            browser.close()
    return rows


def fetch_meetinzagreb_events() -> list[dict]:
    raw = _extract_dom_playwright()
    out: list[dict] = []
    for row in raw:
        href = row.get("href") or ""
        title = (row.get("title") or "").strip()
        blurb = row.get("blurb") or ""
        if not href or not title:
            continue
        path = urlparse(href).path.rstrip("/") or href
        external_key = f"meet:{path}"
        start_at, venue_blurb = parse_hr_event_line(blurb)
        out.append(
            {
                "source": "meetinzagreb",
                "external_key": external_key,
                "title": title,
                "url": href,
                "start_at": start_at,
                "end_at": None,
                "venue": venue_blurb,
                "address": None,
                "lat": None,
                "lng": None,
            }
        )
    return out
