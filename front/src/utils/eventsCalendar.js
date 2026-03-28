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
