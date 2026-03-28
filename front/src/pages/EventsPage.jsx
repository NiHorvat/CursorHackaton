import { useEffect, useMemo, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { TabSwitcher } from '../components/TabSwitcher'
import { EventCard } from '../components/EventCard'
import { moreEvents } from '../data/eventsFromData'
import { useLanguage } from '../i18n/LanguageContext'
import { isEventInWeek } from '../utils/eventDates'
import {
  defaultWeekStart,
  formatWeekRangeLabel,
  getDayKeyLocal,
  isDateInSelectedWeek,
  startOfLocalDay,
  startOfMonth,
  startOfWeekMonday,
} from '../utils/eventsCalendar'

export function EventsPage() {
  const { t, intlLocale } = useLanguage()
  const [query, setQuery] = useState('')
  const [activeWeekStart, setActiveWeekStart] = useState(() =>
    defaultWeekStart(moreEvents),
  )
  const [calendarViewMonth, setCalendarViewMonth] = useState(() =>
    startOfMonth(defaultWeekStart(moreEvents)),
  )

  useEffect(() => {
    setCalendarViewMonth(startOfMonth(activeWeekStart))
  }, [activeWeekStart])

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

  const eventsForSelectedWeek = useMemo(() => {
    return filteredBySearch
      .filter((e) => isEventInWeek(e.startAt, activeWeekStart))
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
  }, [filteredBySearch, activeWeekStart])

  const weekLabel = useMemo(() => {
    return formatWeekRangeLabel(activeWeekStart, intlLocale)
  }, [activeWeekStart, intlLocale])

  const calLocale = intlLocale === 'en-GB' ? 'en-GB' : 'hr-HR'

  const navigateWeek = (deltaDays) => {
    setActiveWeekStart((w) => {
      const d = new Date(w)
      d.setDate(d.getDate() + deltaDays)
      return startOfWeekMonday(d)
    })
  }

  return (
    <>
      <TabSwitcher />
      <section className="ze-events-page" aria-labelledby="events-list-heading">
        <header className="ze-events-page__head">
          <h2 id="events-list-heading" className="ze-section-title">
            {t('events.title')}
          </h2>
          <p className="ze-section-sub">{t('events.intro')}</p>
          <div className="ze-search">
            <label htmlFor="event-search" className="ze-sr-only">
              {t('events.searchLabel')}
            </label>
            <input
              id="event-search"
              type="search"
              className="ze-search__input"
              placeholder={t('events.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
        </header>

        <div className="ze-events-layout">
          <div className="ze-events-layout__cal">
            <div className="ze-week-nav">
              <button
                type="button"
                className="ze-week-nav__btn"
                onClick={() => navigateWeek(-7)}
                aria-label={t('events.weekPrev')}
              >
                ‹
              </button>
              <span className="ze-week-nav__label">{weekLabel}</span>
              <button
                type="button"
                className="ze-week-nav__btn"
                onClick={() => navigateWeek(7)}
                aria-label={t('events.weekNext')}
              >
                ›
              </button>
            </div>
            <Calendar
              className="ze-calendar"
              locale={calLocale}
              calendarType="iso8601"
              minDetail="month"
              maxDetail="month"
              activeStartDate={calendarViewMonth}
              onActiveStartDateChange={({ activeStartDate }) => {
                setCalendarViewMonth(startOfMonth(activeStartDate))
              }}
              value={null}
              onChange={(v) => {
                const d = Array.isArray(v) ? v[0] : v
                if (d) setActiveWeekStart(startOfWeekMonday(d))
              }}
              tileClassName={({ date, view }) => {
                if (view !== 'month') return null
                const parts = []
                if (eventDayKeys.has(getDayKeyLocal(date))) {
                  parts.push('ze-calendar__tile--has-event')
                }
                if (isDateInSelectedWeek(date, activeWeekStart)) {
                  parts.push('ze-calendar__tile--in-week')
                }
                return parts.length ? parts.join(' ') : null
              }}
            />
          </div>

          <div className="ze-events-layout__list">
            <h3 className="ze-events-week-title" id="events-week-label">
              {weekLabel}
            </h3>
            {eventsForSelectedWeek.length === 0 ? (
              <p className="ze-empty ze-empty--left">{t('events.emptyWeek')}</p>
            ) : (
              <div className="ze-card-row ze-card-row--wrap ze-card-row--events-week">
                {eventsForSelectedWeek.map((e) => (
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
