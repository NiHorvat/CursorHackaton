const EARTH_RADIUS_M = 6371000

function toRad(deg) {
  return (deg * Math.PI) / 180
}

/** Great-circle distance in meters (WGS84 sphere). */
export function haversineMeters(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}

/** @param {{ lat: number, lng: number }[]} venues */
export function filterVenuesWithinKm(venues, userLat, userLng, km) {
  const maxM = km * 1000
  return venues.filter(
    (v) => haversineMeters(userLat, userLng, v.lat, v.lng) <= maxM,
  )
}
