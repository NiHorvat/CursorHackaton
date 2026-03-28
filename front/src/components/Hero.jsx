import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=85'

export function Hero() {
  const navigate = useNavigate()
  const [tonightQuery, setTonightQuery] = useState('')
  const { t } = useLanguage()

  function handleTonightSubmit(e) {
    e.preventDefault()
    const q = tonightQuery.trim()
    if (!q) return
    navigate(`/eventovi/tonight?message=${encodeURIComponent(q)}`)
  }

  return (
    <section className="ze-hero" aria-labelledby="hero-heading">
      <div className="ze-hero__inner">
        <div className="ze-hero__visual">
          <img
            src={HERO_IMAGE}
            alt={t('hero.imgAlt')}
            className="ze-hero__img"
            width={640}
            height={400}
            loading="eager"
          />
        </div>
        <div className="ze-hero__content">
          <h1 id="hero-heading" className="ze-hero__title">
            {t('hero.title')}
          </h1>
          <form
            className="ze-hero-tonight"
            onSubmit={handleTonightSubmit}
            aria-label={t('hero.tonightAria')}
          >
            <label htmlFor="tonight-search" className="ze-hero-tonight__label">
              {t('hero.tonightLabel')}
            </label>
            <div className="ze-hero-tonight__row">
              <input
                id="tonight-search"
                type="search"
                className="ze-hero-tonight__input"
                placeholder={t('hero.tonightPlaceholder')}
                value={tonightQuery}
                onChange={(e) => setTonightQuery(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="ze-btn ze-btn--primary">
                {t('hero.search')}
              </button>
            </div>
          </form>
          <div className="ze-hero__actions">
            <Link to="/eventovi" className="ze-btn ze-btn--primary">
              {t('hero.popular')} <span aria-hidden="true">&gt;</span>
            </Link>
            <Link to="/eventovi" className="ze-btn ze-btn--secondary">
              {t('hero.upcoming')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
