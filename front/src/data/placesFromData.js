import raw from '../../../backend/nikola/places_data.json'

/** Places to visit (Google-style POIs); used on the map with distinct pins. */
export const placeLocations = raw.places
  .filter(
    (p) =>
      p.location != null &&
      Number.isFinite(Number(p.location.lat)) &&
      Number.isFinite(Number(p.location.lng)),
  )
  .map((p) => ({
    id: `place-${p.id}`,
    kind: 'place',
    lat: Number(p.location.lat),
    lng: Number(p.location.lng),
    venue: p.name,
    address: typeof p.address === 'string' ? p.address : '',
    rating: p.rating,
    userRatingsTotal: p.user_ratings_total,
    types: Array.isArray(p.types) ? p.types : [],
    events: [],
    eventCount: 0,
  }))
