import rawEvents from './data.js'

function coordKey(lat, lng) {
  return `${Number(lat).toFixed(5)},${Number(lng).toFixed(5)}`
}

const grouped = new Map()

for (const e of rawEvents) {
  if (e.lat == null || e.lng == null) continue
  const lat = Number(e.lat)
  const lng = Number(e.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue

  const k = coordKey(lat, lng)
  if (!grouped.has(k)) {
    grouped.set(k, {
      id: k,
      lat,
      lng,
      venue: e.venue?.trim() || 'Lokacija',
      address: e.address?.trim() || '',
      events: [],
    })
  }
  const row = grouped.get(k)
  if (e.title && e.start_at) {
    row.events.push({ title: e.title, startAt: e.start_at })
  } else if (e.title) {
    row.events.push({ title: e.title, startAt: null })
  }
}

/** Unique venues (by coordinates) with aggregated events from `data.js`. */
export const venueLocations = [...grouped.values()]
  .filter((v) => v.events.length > 0)
  .map((v) => ({
    ...v,
    eventCount: v.events.length,
  }))
