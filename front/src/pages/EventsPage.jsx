import { useMemo, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { TabSwitcher } from '../components/TabSwitcher'
import { EventCard } from '../components/EventCard'
import { moreEvents } from '../data/content'
import { isEventInMonth } from '../utils/eventDates'
import {
  defaultCalendarActiveStart,
  getDayKeyLocal,
  startOfLocalDay,
  startOfMonth,
} from '../utils/eventsCalendar'

export function EventsPage() {
  const [query, setQuery] = useState('')
  const [activeMonth, setActiveMonth] = useState(() =>
    defaultCalendarActiveStart(moreEvents),
  )

  const filteredBySearch = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return moreEvents
    return moreEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q),
    )
  }, [query])

  const eventDayKeys = useMemo(() => {
    const set = new Set()
    for (const e of filteredBySearch) {
      set.add(getDayKeyLocal(startOfLocalDay(new Date(e.startAt))))
    }
    return set
  }, [filteredBySearch])

  const eventsForSelectedMonth = useMemo(() => {
    return filteredBySearch
      .filter((e) => isEventInMonth(e.startAt, activeMonth))
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
  }, [filteredBySearch, activeMonth])

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat('hr-HR', {
      month: 'long',
      year: 'numeric',
    }).format(activeMonth)
  }, [activeMonth])

  return (
    <>
      <TabSwitcher />
      <section className="ze-events-page" aria-labelledby="events-list-heading">
        <header className="ze-events-page__head">
          <h2 id="events-list-heading" className="ze-section-title">
            Svi Eventovi
          </h2>
          <p className="ze-section-sub">
            Pomiči kalendar ili odaberi dan — prikazuju se svi događaji u tom
            mjesecu, poredani po datumu i vremenu. Dani s događajima označeni su
            na kalendaru.
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

        <div className="ze-events-layout">
          <div className="ze-events-layout__cal">
            <Calendar
              className="ze-calendar"
              locale="hr-HR"
              calendarType="iso8601"
              minDetail="month"
              maxDetail="month"
              activeStartDate={activeMonth}
              onActiveStartDateChange={({ activeStartDate }) => {
                setActiveMonth(startOfMonth(activeStartDate))
              }}
              value={null}
              onChange={(v) => {
                const d = Array.isArray(v) ? v[0] : v
                if (d) setActiveMonth(startOfMonth(d))
              }}
              tileClassName={({ date, view }) => {
                if (view !== 'month') return null
                return eventDayKeys.has(getDayKeyLocal(date))
                  ? 'ze-calendar__tile--has-event'
                  : null
              }}
            />
          </div>

          <div className="ze-events-layout__list">
            <h3 className="ze-events-month-title" id="events-month-label">
              {monthLabel}
            </h3>
            {eventsForSelectedMonth.length === 0 ? (
              <p className="ze-empty ze-empty--left">
                Nema događaja u ovom mjesecu za trenutni upit.
              </p>
            ) : (
              <div className="ze-card-row ze-card-row--wrap ze-card-row--events-day">
                {eventsForSelectedMonth.map((e) => (
                  <EventCard key={e.id} {...e} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
