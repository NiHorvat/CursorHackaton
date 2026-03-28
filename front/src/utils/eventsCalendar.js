export function startOfLocalDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** First instant of the calendar month (local). */
export function startOfMonth(d) {
  const x = new Date(d)
  return new Date(x.getFullYear(), x.getMonth(), 1)
}

/** Stable key for comparing calendar tiles to events (local date). */
export function getDayKeyLocal(day) {
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
}

/**
 * First upcoming calendar day with an event, or earliest event day, or today.
 * @param {{ startAt: string }[]} events
 */
export function getDefaultSelectedDate(events) {
  const today = startOfLocalDay(new Date())
  const sorted = [...events].sort(
    (a, b) => new Date(a.startAt) - new Date(b.startAt),
  )
  const next = sorted.find((e) => {
    const d = startOfLocalDay(new Date(e.startAt))
    return d >= today
  })
  if (next) return startOfLocalDay(new Date(next.startAt))
  const first = sorted[0]
  return first ? startOfLocalDay(new Date(first.startAt)) : today
}

/** First day of month for the default selected date — calendar opens on that month. */
export function defaultCalendarActiveStart(events) {
  const d = getDefaultSelectedDate(events)
  return startOfMonth(d)
}

/** Monday 00:00 local (ISO week) for the week containing `d`. */
export function startOfWeekMonday(d) {
  const x = startOfLocalDay(new Date(d))
  const day = x.getDay()
  const diff = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + diff)
  return x
}

/** Monday of the week containing the default “next” event day (or today). */
export function defaultWeekStart(events) {
  return startOfWeekMonday(getDefaultSelectedDate(events))
}

/** Whether a calendar `date` (local midnight) falls in the week starting `weekStartMonday`. */
export function isDateInSelectedWeek(date, weekStartMonday) {
  const ws = startOfLocalDay(new Date(weekStartMonday))
  const we = new Date(ws)
  we.setDate(we.getDate() + 7)
  const t = startOfLocalDay(date).getTime()
  return t >= ws.getTime() && t < we.getTime()
}

/** Human-readable Mon–Sun range, e.g. "3 Mar – 9 Mar 2025". */
export function formatWeekRangeLabel(weekStartMonday, intlLocale) {
  const end = new Date(weekStartMonday)
  end.setDate(end.getDate() + 6)
  try {
    const fmt = new Intl.DateTimeFormat(intlLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    if (typeof fmt.formatRange === 'function') {
      return fmt.formatRange(weekStartMonday, end)
    }
  } catch {
    /* ignore */
  }
  const fmt = new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return `${fmt.format(weekStartMonday)} – ${fmt.format(end)}`
}
