import rawEvents from './data.js'

const Q = 'w=640&q=80'

/** Unsplash images keyed by `category` slug from data.js */
const CATEGORY_IMAGES = {
  kultura: `https://images.unsplash.com/photo-1503095396549-807759245b35?${Q}`,
  glazba: `https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?${Q}`,
  film: `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?${Q}`,
  umjetnost: `https://images.unsplash.com/photo-1541961017774-22349e4a1262?${Q}`,
  edukacija: `https://images.unsplash.com/photo-1524178232363-1fb2b075b655?${Q}`,
  obiteljski: `https://images.unsplash.com/photo-1511895426328-dc8714191300?${Q}`,
  odmor: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?${Q}`,
  sajam: `https://images.unsplash.com/photo-1540575467063-027aef7f9f1b?${Q}`,
  sport: `https://images.unsplash.com/photo-1461896836934-ffe607ba8211?${Q}`,
}

const DEFAULT_IMAGE = `https://images.unsplash.com/photo-1459749411175-04bf5292ceea?${Q}`

function imageForCategory(category) {
  if (category == null || String(category).trim() === '') return DEFAULT_IMAGE
  const key = String(category).trim().toLowerCase()
  return CATEGORY_IMAGES[key] ?? DEFAULT_IMAGE
}

/** Uses `category` from data.js (e.g. kultura, glazba) for tags and search. */
function categoryLabel(category) {
  if (category == null || String(category).trim() === '') return 'Događaj'
  const s = String(category).trim().toLowerCase()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function normalize(e) {
  const rawUrl = e.url
  const url =
    rawUrl != null && String(rawUrl).trim() !== ''
      ? String(rawUrl).trim()
      : null

  return {
    id: String(e.id),
    title: e.title,
    startAt: e.start_at,
    image: imageForCategory(e.category),
    category: categoryLabel(e.category),
    url,
  }
}

const withStart = rawEvents.filter((e) => e.start_at && e.title)

const sorted = [...withStart].sort(
  (a, b) => new Date(a.start_at) - new Date(b.start_at),
)

const now = new Date()

const future = sorted.filter((e) => new Date(e.start_at) >= now)

/** First three upcoming; if fewer than three, fill from earliest in dataset. */
export const upcomingEvents = (
  future.length >= 3 ? future.slice(0, 3) : sorted.slice(0, 3)
).map(normalize)

/** All events with a start time, for calendar and search. */
export const moreEvents = sorted.map(normalize)
