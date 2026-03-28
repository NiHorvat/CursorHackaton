import { categoryCards } from '../data/content'
import { CategoryIcon } from './CategoryIcon'

const PINS = [
  { id: 'p1', left: '18%', top: '42%', icon: 'masks' },
  { id: 'p2', left: '55%', top: '28%', icon: 'music' },
  { id: 'p3', left: '72%', top: '58%', icon: 'food' },
  { id: 'p4', left: '38%', top: '62%', icon: 'star' },
]

function PinIcon({ type }) {
  switch (type) {
    case 'masks':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 2C7 4 4 8 4 12c0 4 3.5 8 8 10 4.5-2 8-6 8-10 0-4-3-8-8-10zm-3 9.5c.8 0 1.5-.7 1.5-1.5S9.8 8.5 9 8.5 7.5 9.2 7.5 10s.7 1.5 1.5 1.5zm6 0c.8 0 1.5-.7 1.5-1.5S14.8 8.5 14 8.5s-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm-7.2 3.3c.9 1.4 2.3 2.2 4.2 2.2s3.3-.8 4.2-2.2c.2-.3 0-.7-.4-.8-1.3-.4-2.6-.6-3.8-.6s-2.5.2-3.8.6c-.4.1-.6.5-.4.8z" />
        </svg>
      )
    case 'music':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      )
    case 'food':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M8.1 13.34l2.83-2.83L3 3v2.83l5.1 5.51zM21.59 11.41l-4.99-5-4.99 5L11 12.9 3 3v2.83l6.99 7.5L3 21h18l-3.81-3.81 1.4-1.41L21 18.17V21h2v-7.17l-1.41-1.42z" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      )
  }
}

export function MapSection() {
  return (
    <section className="ze-map-block" aria-labelledby="map-heading">
      <header className="ze-map-block__head">
        <h2 id="map-heading" className="ze-section-title">
          Karta Događanja
        </h2>
        <p className="ze-section-sub">
          Pronađi događaje i lokacije u Zagrebu.
        </p>
      </header>
      <div className="ze-map-block__grid">
        <div className="ze-map-block__cats">
          {categoryCards.map((c) => (
            <article key={c.id} className="ze-cat-card">
              <div className="ze-cat-card__icon" aria-hidden>
                <CategoryIcon name={c.icon} />
              </div>
              <h3 className="ze-cat-card__title">{c.title}</h3>
              <p className="ze-cat-card__text">{c.description}</p>
            </article>
          ))}
        </div>
        <div className="ze-map-wrap">
          <div className="ze-map" role="img" aria-label="Stilizirana karta Zagreba s označenim mjestima">
            <svg
              className="ze-map__svg"
              viewBox="0 0 400 280"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="mapWater" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#dbe8f5" />
                  <stop offset="100%" stopColor="#c9daf0" />
                </linearGradient>
                <linearGradient id="mapPark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b8d4a8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#9bc4a0" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <rect width="400" height="280" fill="url(#mapWater)" rx="20" />
              <path
                d="M0 180 Q80 160 140 175 T280 165 T400 175 V280 H0 Z"
                fill="#a8c5e8"
                opacity="0.35"
              />
              <ellipse cx="320" cy="210" rx="45" ry="28" fill="url(#mapPark)" />
              <g fill="none" stroke="#8eb3d9" strokeWidth="2.2" strokeLinecap="round">
                <path d="M40 220 L120 100 L200 140 L280 60" />
                <path d="M20 140 L100 200 L260 120 L360 200" />
                <path d="M200 20 L220 260" opacity="0.7" />
              </g>
              <g fill="#cfe0f4" stroke="#9bb9da" strokeWidth="1.2">
                <rect x="95" y="115" width="42" height="32" rx="6" transform="rotate(-12 116 131)" />
                <rect x="210" y="95" width="38" height="28" rx="5" transform="rotate(8 229 109)" />
                <rect x="165" y="175" width="50" height="36" rx="6" />
              </g>
            </svg>
            <div className="ze-map__controls" aria-hidden>
              <button type="button" tabIndex={-1}>
                +
              </button>
              <button type="button" tabIndex={-1}>
                −
              </button>
            </div>
            {PINS.map((p) => (
              <div
                key={p.id}
                className="ze-pin"
                style={{ left: p.left, top: p.top }}
              >
                <span className="ze-pin__dot">
                  <PinIcon type={p.icon} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
