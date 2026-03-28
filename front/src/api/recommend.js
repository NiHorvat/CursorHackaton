/**
 * POST /recommend — AI suggestions for what to do (e.g. tonight).
 * @param {string} message User question or intent
 * @param {AbortSignal} [signal] Optional abort signal (e.g. timeout)
 * @returns {Promise<RecommendResponse>}
 */
export async function fetchRecommend(message, signal) {
  const base = import.meta.env.VITE_API_BASE_URL
  const url = base
    ? `${String(base).replace(/\/$/, '')}/recommend`
    : '/api/recommend'

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
    signal,
  })

  const text = await res.text()
  let parsed = null
  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = null
  }

  if (!res.ok) {
    const detail = parsed?.detail
    const errMsg = parsed?.error
    const msg =
      (typeof detail === 'string' && detail) ||
      (typeof errMsg === 'string' && errMsg) ||
      (typeof parsed?.message === 'string' && parsed.message) ||
      text ||
      `Request failed (${res.status})`
    throw new Error(msg)
  }

  if (parsed == null || typeof parsed !== 'object') {
    throw new Error('Empty or invalid JSON from recommend endpoint')
  }

  return parsed
}
