import { useEffect, useMemo, useState } from 'react'
import { placeLocations } from '../data/placesFromData'
import { venueLocations } from '../data/venueLocations'
import { useLanguage } from '../i18n/LanguageContext'
import { filterVenuesWithinKm } from '../utils/geo'
import { mergeMapPins } from '../utils/mapPins'
import { CategoryIcon } from './CategoryIcon'
import { LeafletMap } from './LeafletMap'

const NEAR_KM = 1

export function MapSection() {
  const { t } = useLanguage()
  const [nearMe, setNearMe] = useState(false)
  const [userPos, setUserPos] = useState(null)
  const [geoErrorKey, setGeoErrorKey] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)

  const categoryCards = useMemo(
    () => [
      {
        id: 'c1',
        title: t('map.cat1Title'),
        description: t('map.cat1Desc'),
        icon: 'music',
      },
      {
        id: 'c2',
        title: t('map.cat2Title'),
        description: t('map.cat2Desc'),
        icon: 'museum',
      },
    ],
    [t],
  )

  useEffect(() => {
    if (!nearMe) {
      setUserPos(null)
      setGeoErrorKey(null)
      setGeoLoading(false)
      return
    }

    if (!navigator.geolocation) {
      setGeoErrorKey('unsupported')
      setNearMe(false)
      return
    }

    setGeoLoading(true)
    setGeoErrorKey(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setGeoLoading(false)
      },
      (err) => {
        setGeoErrorKey(err.code === 1 ? 'denied' : 'failed')
        setGeoLoading(false)
        setUserPos(null)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 },
    )
  }, [nearMe])

  const { venues: baseVenues, places: basePlaces } = useMemo(
    () => mergeMapPins(venueLocations, placeLocations),
    [],
  )

  const displayedVenues = useMemo(() => {
    if (!nearMe || !userPos) return baseVenues
    return filterVenuesWithinKm(baseVenues, userPos.lat, userPos.lng, NEAR_KM)
  }, [nearMe, userPos, baseVenues])

  const displayedPlaces = useMemo(() => {
    if (!nearMe || !userPos) return basePlaces
    return filterVenuesWithinKm(basePlaces, userPos.lat, userPos.lng, NEAR_KM)
  }, [nearMe, userPos, basePlaces])

  const pinCountInRadius = displayedVenues.length + displayedPlaces.length

  const showNearMeOverlay = Boolean(nearMe && userPos)

  const geoErrorMessage =
    geoErrorKey === 'unsupported'
      ? t('map.geoUnsupported')
      : geoErrorKey === 'denied'
        ? t('map.geoDenied')
        : geoErrorKey === 'failed'
          ? t('map.geoFailed')
          : null

  return (
    <section className="ze-map-block" aria-labelledby="map-heading">
      <header className="ze-map-block__head">
        <h2 id="map-heading" className="ze-section-title">
          {t('map.title')}
        </h2>
        <p className="ze-section-sub">{t('map.intro')}</p>
      </header>
      <div className="ze-map-block__grid">
        <div className="ze-map-block__cats">
          {categoryCards.map((c) => (
            <article key={c.id} className="ze-cat-card">
              <div className="ze-cat-card__icon" aria-hidden>
                <CategoryIcon name={c.icon} />
              </div>
              <h3 className="ze-cat-card__title">{c.title}</h3>
              <p className="ze-cat-card__text">{c.description}</p>
            </article>
          ))}
        </div>
        <div className="ze-map-wrap ze-map-wrap--leaflet">
          <div className="ze-map-toolbar">
            <label className="ze-map-toolbar__toggle">
              <input
                type="checkbox"
                className="ze-map-toolbar__checkbox"
                checked={nearMe}
                onChange={(e) => setNearMe(e.target.checked)}
                disabled={geoLoading}
              />
              <span className="ze-map-toolbar__label">{t('map.nearMe')}</span>
              <span className="ze-map-toolbar__hint">
                {t('map.nearHint', { km: NEAR_KM })}
              </span>
            </label>
            {geoLoading ? (
              <span className="ze-map-toolbar__status" role="status">
                {t('map.geoLoading')}
              </span>
            ) : null}
            {geoErrorMessage ? (
              <span className="ze-map-toolbar__error" role="alert">
                {geoErrorMessage}
              </span>
            ) : null}
            {showNearMeOverlay && !geoLoading ? (
              <span className="ze-map-toolbar__status">
                {t('map.nearCount', { n: displayedVenues.length })}
              </span>
            ) : null}
          </div>
          {nearMe && userPos && pinCountInRadius === 0 ? (
            <p className="ze-map-near-banner" role="status">
              {t('map.nearEmpty', { km: NEAR_KM })}
            </p>
          ) : null}
          <div
            className="ze-map ze-map--leaflet"
            aria-label={t('map.mapAria')}
          >
            <LeafletMap
              venues={displayedVenues}
              places={displayedPlaces}
              userPosition={userPos}
              showNearMeOverlay={showNearMeOverlay}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
