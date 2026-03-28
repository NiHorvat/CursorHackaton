import { useEffect, useMemo } from 'react'
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { useLanguage } from '../i18n/LanguageContext'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const placePinIcon = L.divIcon({
  className: 'ze-leaflet-marker-place',
  html: '<span class="ze-leaflet-marker-place__pin" aria-hidden="true"></span>',
  iconSize: [32, 40],
  iconAnchor: [16, 38],
  popupAnchor: [0, -32],
})

const ZAGREB = [45.815, 15.9819]
const NEAR_RADIUS_M = 1000

function googleMapsVenueUrl(lat, lng) {
  const q = encodeURIComponent(`${lat},${lng}`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

function formatWhen(iso, intlLocale) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(intlLocale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return String(iso)
  }
}

function FitBounds({ bounds }) {
  const map = useMap()
  useEffect(() => {
    if (bounds?.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 })
    }
  }, [map, bounds])
  return null
}

function approximateCircleBounds(lat, lng, radiusM) {
  const dLat = radiusM / 111320
  const cosLat = Math.cos((lat * Math.PI) / 180)
  const dLng = cosLat > 1e-6 ? radiusM / (111320 * cosLat) : dLat
  return L.latLngBounds(
    [lat - dLat, lng - dLng],
    [lat + dLat, lng + dLng],
  )
}

function computeBounds(venues, places, userPosition, showUserRadius) {
  const points = []
  if (userPosition && showUserRadius) {
    const ring = approximateCircleBounds(
      userPosition.lat,
      userPosition.lng,
      NEAR_RADIUS_M,
    )
    points.push(ring.getSouthWest(), ring.getNorthEast())
  }
  for (const v of venues) {
    points.push([v.lat, v.lng])
  }
  for (const p of places) {
    points.push([p.lat, p.lng])
  }
  if (!points.length) return null
  const b = L.latLngBounds(points[0], points[0])
  for (let i = 1; i < points.length; i++) {
    b.extend(points[i])
  }
  return b.isValid() ? b : null
}

function formatPlaceTypes(types) {
  if (!types?.length) return ''
  return types
    .slice(0, 5)
    .map((t) => String(t).replace(/_/g, ' '))
    .join(', ')
}

export function LeafletMap({
  venues,
  places = [],
  userPosition = null,
  showNearMeOverlay = false,
}) {
  const { t, intlLocale } = useLanguage()

  const bounds = useMemo(
    () => computeBounds(venues, places, userPosition, showNearMeOverlay),
    [venues, places, userPosition, showNearMeOverlay],
  )

  const hasPins = venues.length > 0 || places.length > 0
  const showMap =
    hasPins || (showNearMeOverlay && userPosition != null)

  if (!showMap) {
    return (
      <div className="ze-leaflet-fallback">{t('map.leafletNoCoords')}</div>
    )
  }

  const containerProps = bounds
    ? { bounds, boundsOptions: { padding: [36, 36], maxZoom: 16 } }
    : { center: ZAGREB, zoom: 13 }

  return (
    <MapContainer
      className="ze-leaflet-map"
      {...containerProps}
      scrollWheelZoom
      style={{ height: '100%', minHeight: '360px', width: '100%' }}
    >
      {bounds ? <FitBounds bounds={bounds} /> : null}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {showNearMeOverlay && userPosition ? (
        <>
          <Circle
            center={[userPosition.lat, userPosition.lng]}
            radius={NEAR_RADIUS_M}
            pathOptions={{
              color: '#142a4a',
              weight: 2,
              fillColor: '#142a4a',
              fillOpacity: 0.08,
            }}
          />
          <CircleMarker
            center={[userPosition.lat, userPosition.lng]}
            radius={9}
            pathOptions={{
              color: '#142a4a',
              weight: 3,
              fillColor: '#ffffff',
              fillOpacity: 1,
            }}
          />
        </>
      ) : null}
      {venues.map((v) => (
        <Marker key={v.id} position={[v.lat, v.lng]}>
          <Popup>
            <div className="ze-leaflet-popup">
              <span className="ze-leaflet-popup__badge ze-leaflet-popup__badge--event">
                {t('map.popupBadgeEvent')}
              </span>
              <strong className="ze-leaflet-popup__title">{v.venue}</strong>
              {v.address ? (
                <span className="ze-leaflet-popup__addr">{v.address}</span>
              ) : null}
              {v.reason ? (
                <p className="ze-leaflet-popup__reason">{v.reason}</p>
              ) : null}
              <a
                className="ze-leaflet-popup__gmaps"
                href={googleMapsVenueUrl(v.lat, v.lng)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('map.openGoogleMaps')}
              </a>
              <span className="ze-leaflet-popup__count">
                {v.eventCount}{' '}
                {v.eventCount === 1
                  ? t('map.popupEvents1')
                  : t('map.popupEventsN')}
              </span>
              <ul className="ze-leaflet-popup__list">
                {v.events.slice(0, 5).map((ev, i) => (
                  <li key={i}>
                    {ev.title}
                    {ev.startAt ? (
                      <span className="ze-leaflet-popup__when">
                        {' '}
                        · {formatWhen(ev.startAt, intlLocale)}
                      </span>
                    ) : null}
                  </li>
                ))}
                {v.events.length > 5 ? (
                  <li className="ze-leaflet-popup__more">
                    {t('map.popupMore', { n: v.events.length - 5 })}
                  </li>
                ) : null}
              </ul>
            </div>
          </Popup>
        </Marker>
      ))}
      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={placePinIcon}
          zIndexOffset={500}
        >
          <Popup>
            <div className="ze-leaflet-popup ze-leaflet-popup--place">
              <span className="ze-leaflet-popup__badge ze-leaflet-popup__badge--place">
                {t('map.popupBadgePlace')}
              </span>
              <strong className="ze-leaflet-popup__title">{p.venue}</strong>
              {p.address ? (
                <span className="ze-leaflet-popup__addr">{p.address}</span>
              ) : null}
              {p.reason ? (
                <p className="ze-leaflet-popup__reason">{p.reason}</p>
              ) : null}
              {p.rating != null ? (
                <span className="ze-leaflet-popup__rating">
                  {t('map.popupPlaceRating', {
                    rating: Number(p.rating).toFixed(1),
                    n: p.userRatingsTotal ?? 0,
                  })}
                </span>
              ) : null}
              {formatPlaceTypes(p.types) ? (
                <span className="ze-leaflet-popup__types">
                  {formatPlaceTypes(p.types)}
                </span>
              ) : null}
              <a
                className="ze-leaflet-popup__gmaps ze-leaflet-popup__gmaps--place"
                href={googleMapsVenueUrl(p.lat, p.lng)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('map.openGoogleMaps')}
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
