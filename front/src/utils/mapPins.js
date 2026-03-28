import { haversineMeters } from './geo'

/** Hide event-venue pins when a place pin is this close (meters). */
const OVERLAP_RADIUS_M = 45

/**
 * Drop venue pins that overlap places; place pins are kept.
 * @param {{ lat: number, lng: number }[]} venues
 * @param {{ lat: number, lng: number }[]} places
 */
export function mergeMapPins(venues, places) {
  const filteredVenues = venues.filter(
    (v) => !places.some((p) => haversineMeters(v.lat, v.lng, p.lat, p.lng) <= OVERLAP_RADIUS_M),
  )
  return { venues: filteredVenues, places }
}
