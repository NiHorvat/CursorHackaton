import { useMemo, useState } from 'react'
import { TabSwitcher } from '../components/TabSwitcher'
import { EventCard } from '../components/EventCard'
import { moreEvents } from '../data/content'

export function EventsPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return moreEvents
    return moreEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <>
      <TabSwitcher />
      <section className="ze-events-page" aria-labelledby="events-list-heading">
        <header className="ze-events-page__head">
          <h2 id="events-list-heading" className="ze-section-title">
            Svi Eventovi
          </h2>
          <p className="ze-section-sub">
            Pretraži koncerte, festivale i kulturne događaje u gradu.
          </p>
          <div className="ze-search">
            <label htmlFor="event-search" className="ze-sr-only">
              Pretraga eventova
            </label>
            <input
              id="event-search"
              type="search"
              className="ze-search__input"
              placeholder="Pretraži po nazivu ili kategoriji..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
        </header>
        <div className="ze-card-row ze-card-row--wrap">
          {filtered.map((e) => (
            <EventCard key={e.id} {...e} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="ze-empty">Nema rezultata za taj upit.</p>
        ) : null}
      </section>
    </>
  )
}
