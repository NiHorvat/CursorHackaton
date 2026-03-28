/**
 * Map /recommend API pins into LeafletMap `venues` + `places` shapes.
 */
export function recommendPinsToLeafletInputs(pins) {
  const venues = []
  const places = []
  if (!Array.isArray(pins)) return { venues, places }

  for (const pin of pins) {
    const lat = pin.lat ?? pin.latitude
    const lng = pin.lng ?? pin.longitude
    if (
      lat == null ||
      lng == null ||
      !Number.isFinite(Number(lat)) ||
      !Number.isFinite(Number(lng))
    ) {
      continue
    }

    const reason = typeof pin.reason === 'string' ? pin.reason : ''

    if (pin.kind === 'event') {
      venues.push({
        id: `rec-event-${pin.id}`,
        lat: Number(lat),
        lng: Number(lng),
        venue: pin.venue?.trim() || pin.title || 'Event',
        address: typeof pin.address === 'string' ? pin.address : '',
        reason,
        events: [
          {
            title: pin.title || '',
            startAt: pin.start_at ?? null,
          },
        ],
        eventCount: 1,
      })
    } else if (pin.kind === 'place') {
      places.push({
        id: `rec-place-${pin.id}`,
        lat: Number(lat),
        lng: Number(lng),
        venue: pin.name?.trim() || 'Place',
        address: typeof pin.address === 'string' ? pin.address : '',
        reason,
        rating: pin.rating,
        userRatingsTotal: pin.user_ratings_total,
        types: pin.types,
      })
    }
  }

  return { venues, places }
}
