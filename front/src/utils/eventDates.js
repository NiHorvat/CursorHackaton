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

const dateOnlyFmt = new Intl.DateTimeFormat('hr-HR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const dateTimeFmt = new Intl.DateTimeFormat('hr-HR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** @param {string} iso */
export function formatEventDateOnly(iso) {
  return dateOnlyFmt.format(new Date(iso))
}

/** @param {string} iso */
export function formatEventDateTime(iso) {
  return dateTimeFmt.format(new Date(iso))
}
