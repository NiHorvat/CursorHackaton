import { Hero } from '../components/Hero'
import { EventCard } from '../components/EventCard'
import { upcomingEvents } from '../data/eventsFromData'
import { useLanguage } from '../i18n/LanguageContext'

export function HomePage() {
  const { t } = useLanguage()

  return (
    <>
      <Hero />
      <section
        className="ze-section ze-section--grid"
        aria-labelledby="upcoming-heading"
      >
        <h2 id="upcoming-heading" className="ze-section-heading">
          {t('home.upcoming')}
        </h2>
        <div className="ze-card-row">
          {upcomingEvents.map((e) => (
            <EventCard key={e.id} {...e} detailTime={false} />
          ))}
        </div>
      </section>
    </>
  )
}
