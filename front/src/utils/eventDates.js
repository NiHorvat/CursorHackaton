/** Same calendar day in local timezone */
export function isSameCalendarDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Event falls in the same calendar month as `monthAnchor` (any date in that month). */
export function isEventInMonth(iso, monthAnchor) {
  const d = new Date(iso)
  return (
    d.getFullYear() === monthAnchor.getFullYear() &&
    d.getMonth() === monthAnchor.getMonth()
  )
}

/** @param {string} iso @param {string} intlLocale e.g. `hr-HR` or `en-GB` */
export function formatEventDateOnly(iso, intlLocale = 'hr-HR') {
  return new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

/** @param {string} iso @param {string} intlLocale */
export function formatEventDateTime(iso, intlLocale = 'hr-HR') {
  return new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
