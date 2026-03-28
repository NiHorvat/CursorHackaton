/**
 * POST /recommend — AI suggestions for what to do (e.g. tonight).
 * @param {string} message User question or intent
 * @returns {Promise<RecommendResponse>}
 */
export async function fetchRecommend(message) {
  const base = import.meta.env.VITE_API_BASE_URL
  const url = base
    ? `${String(base).replace(/\/$/, '')}/recommend`
    : '/api/recommend'

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed (${res.status})`)
  }

  return res.json()
}
