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

function computeBounds(venues, userPosition, showUserRadius) {
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
  if (!points.length) return null
  const b = L.latLngBounds(points[0], points[0])
  for (let i = 1; i < points.length; i++) {
    b.extend(points[i])
  }
  return b.isValid() ? b : null
}

export function LeafletMap({
  venues,
  userPosition = null,
  showNearMeOverlay = false,
}) {
  const { t, intlLocale } = useLanguage()

  const bounds = useMemo(
    () => computeBounds(venues, userPosition, showNearMeOverlay),
    [venues, userPosition, showNearMeOverlay],
  )

  const showMap =
    venues.length > 0 || (showNearMeOverlay && userPosition != null)

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
              <strong className="ze-leaflet-popup__title">{v.venue}</strong>
              {v.address ? (
                <span className="ze-leaflet-popup__addr">{v.address}</span>
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
    </MapContainer>
  )
}
