import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchRecommend } from '../api/recommend'
import { TabSwitcher } from '../components/TabSwitcher'
import { useLanguage } from '../i18n/LanguageContext'

function mapsHref(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

function EventPinCard({ pin }) {
  const { t } = useLanguage()
  return (
    <article className="ze-rec-card ze-rec-card--event">
      <span className="ze-rec-card__badge">{t('tonight.badgeEvent')}</span>
      <h3 className="ze-rec-card__title">{pin.title}</h3>
      <p className="ze-rec-card__venue">{pin.venue}</p>
      <p className="ze-rec-card__reason">{pin.reason}</p>
      <dl className="ze-rec-card__meta">
        <div>
          <dt>{t('tonight.dateTime')}</dt>
          <dd>
            {pin.date} · {pin.time}
          </dd>
        </div>
        <div>
          <dt>{t('tonight.category')}</dt>
          <dd>{pin.category ?? '—'}</dd>
        </div>
        <div>
          <dt>{t('tonight.area')}</dt>
          <dd>{pin.area ?? '—'}</dd>
        </div>
        <div>
          <dt>{t('tonight.address')}</dt>
          <dd>{pin.address ?? '—'}</dd>
        </div>
      </dl>
      <a
        className="ze-rec-card__map"
        href={mapsHref(pin.latitude, pin.longitude)}
        target="_blank"
        rel="noreferrer"
      >
        {t('tonight.openMap')}
      </a>
    </article>
  )
}

function PlacePinCard({ pin }) {
  const { t } = useLanguage()
  return (
    <article className="ze-rec-card ze-rec-card--place">
      <span className="ze-rec-card__badge ze-rec-card__badge--place">
        {t('tonight.badgePlace')}
      </span>
      <h3 className="ze-rec-card__title">{pin.name}</h3>
      <p className="ze-rec-card__reason">{pin.reason}</p>
      <dl className="ze-rec-card__meta">
        <div>
          <dt>{t('tonight.type')}</dt>
          <dd>
            {(pin.type ?? pin.primary_type ?? pin.types?.[0] ?? '—')
              .toString()
              .replace(/_/g, ' ')}
          </dd>
        </div>
        <div>
          <dt>{t('tonight.area')}</dt>
          <dd>{pin.area ?? '—'}</dd>
        </div>
        <div>
          <dt>{t('tonight.address')}</dt>
          <dd>{pin.address ?? '—'}</dd>
        </div>
      </dl>
      <a
        className="ze-rec-card__map"
        href={mapsHref(pin.latitude, pin.longitude)}
        target="_blank"
        rel="noreferrer"
      >
        {t('tonight.openMap')}
      </a>
    </article>
  )
}

export function TonightRecommendPage() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const message = searchParams.get('message')?.trim() ?? ''

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!message) {
      setData(null)
      setError(null)
      return
    }

    let cancelled = false
    const controller = new AbortController()
    const timeoutMs = 180000
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    setLoading(true)
    setError(null)
    setData(null)

    fetchRecommend(message, controller.signal)
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) {
          if (err?.name === 'AbortError') {
            setError(
              `Request timed out after ${timeoutMs / 1000}s. The AI server may be slow or unreachable.`,
            )
          } else {
            setError(
              err instanceof Error ? err.message : 'Request failed',
            )
          }
        }
      })
      .finally(() => {
        clearTimeout(timer)
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [message])

  return (
    <>
      <TabSwitcher />
      <section className="ze-tonight" aria-labelledby="tonight-heading">
        <header className="ze-tonight__head">
          <h2 id="tonight-heading" className="ze-section-title">
            {t('tonight.title')}
          </h2>
          <p className="ze-section-sub">{t('tonight.intro')}</p>
          {message ? (
            <p className="ze-tonight__query">
              <span className="ze-tonight__query-label">{t('tonight.queryLabel')}</span>{' '}
              {message}
            </p>
          ) : null}
        </header>

        {!message ? (
          <div className="ze-tonight__empty">
            <p>{t('tonight.noQuery')}</p>
            <Link to="/" className="ze-btn ze-btn--primary">
              {t('tonight.homeLink')}
            </Link>
          </div>
        ) : loading ? (
          <p className="ze-tonight__status" role="status" aria-live="polite">
            {t('tonight.loading')}
          </p>
        ) : error ? (
          <div className="ze-tonight__error" role="alert">
            <p>{error}</p>
            <p className="ze-tonight__hint">
              {t('tonight.hint')}{' '}
              <code>http://localhost:3080</code> {t('tonight.hintProxy')}{' '}
              <code>/api</code> {t('tonight.hintEnv')}{' '}
              <code>VITE_API_BASE_URL</code>.
            </p>
            <Link to="/" className="ze-btn ze-btn--secondary">
              {t('tonight.retryHome')}
            </Link>
          </div>
        ) : data ? (
          <div className="ze-tonight__results">
            {data.summary ? (
              <div className="ze-tonight__summary">
                <h3 className="ze-tonight__summary-title">{t('tonight.summary')}</h3>
                <p>{data.summary}</p>
              </div>
            ) : null}

            {data.droppedInvalidPins ? (
              <p className="ze-tonight__note">{t('tonight.droppedPins')}</p>
            ) : null}

            {Array.isArray(data.pins) && data.pins.length > 0 ? (
              <div className="ze-tonight__grid">
                {data.pins.map((pin) =>
                  pin.kind === 'event' ? (
                    <EventPinCard key={pin.id} pin={pin} />
                  ) : pin.kind === 'place' ? (
                    <PlacePinCard key={pin.id} pin={pin} />
                  ) : null,
                )}
              </div>
            ) : !data.summary ? (
              <p className="ze-empty ze-empty--left">{t('tonight.noResults')}</p>
            ) : null}
          </div>
        ) : null}
      </section>
    </>
  )
}
