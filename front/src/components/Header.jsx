import { NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export function Header() {
  const { pathname } = useLocation()
  const { t, toggleLocale } = useLanguage()

  const eventsNavActive =
    pathname.startsWith('/eventovi') && !pathname.startsWith('/eventovi/favoriti')
  const favoritesNavActive = pathname.startsWith('/eventovi/favoriti')

  return (
    <header className="ze-header">
      <NavLink to="/" className="ze-logo" end>
        Zagreb Events
      </NavLink>
      <nav className="ze-nav" aria-label={t('nav.aria')}>
        <NavLink
          to="/"
          className={() =>
            `ze-nav__link${pathname === '/' ? ' ze-nav__link--active' : ''}`
          }
          end
        >
          {t('nav.home')}
        </NavLink>
        <NavLink
          to="/lokacije"
          className={() =>
            `ze-nav__link${pathname.startsWith('/lokacije') ? ' ze-nav__link--active' : ''}`
          }
        >
          {t('nav.locations')}
        </NavLink>
        <NavLink
          to="/eventovi"
          className={() =>
            `ze-nav__link${eventsNavActive ? ' ze-nav__link--active' : ''}`
          }
        >
          {t('nav.events')}
        </NavLink>
        <NavLink
          to="/eventovi/favoriti"
          className={() =>
            `ze-nav__link${favoritesNavActive ? ' ze-nav__link--active' : ''}`
          }
        >
          {t('nav.favorites')}
        </NavLink>
      </nav>
      <button
        type="button"
        className="ze-lang"
        onClick={toggleLocale}
        title={t('nav.langTitle')}
        aria-label={t('nav.langTitle')}
      >
        {t('nav.langButton')}
      </button>
    </header>
  )
}
