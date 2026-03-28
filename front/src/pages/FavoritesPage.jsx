import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { TabSwitcher } from '../components/TabSwitcher'
import { EventCard } from '../components/EventCard'
import { moreEvents } from '../data/eventsFromData'
import { useFavorites } from '../favorites/FavoritesContext'
import { useLanguage } from '../i18n/LanguageContext'

export function FavoritesPage() {
  const { t } = useLanguage()
  const { favoriteIds } = useFavorites()

  const events = useMemo(() => {
    const set = new Set(favoriteIds)
    return moreEvents
      .filter((e) => set.has(e.id))
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
  }, [favoriteIds])

  return (
    <>
      <TabSwitcher />
      <section
        className="ze-events-page ze-favorites-page"
        aria-labelledby="favorites-heading"
      >
        <header className="ze-events-page__head">
          <h2 id="favorites-heading" className="ze-section-title">
            {t('favorites.title')}
          </h2>
          <p className="ze-section-sub">{t('favorites.intro')}</p>
          <p className="ze-favorites-page__back">
            <Link to="/eventovi" className="ze-favorites-page__link">
              {t('favorites.backToAll')}
            </Link>
          </p>
        </header>

        {events.length === 0 ? (
          <p className="ze-empty ze-empty--left">{t('favorites.empty')}</p>
        ) : (
          <div className="ze-card-row ze-card-row--wrap ze-card-row--events-day">
            {events.map((e) => (
              <EventCard key={e.id} {...e} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
