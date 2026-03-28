import { NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export function Header() {
  const { pathname } = useLocation()
  const { t, toggleLocale } = useLanguage()

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
            `ze-nav__link${pathname.startsWith('/eventovi') ? ' ze-nav__link--active' : ''}`
          }
        >
          {t('nav.events')}
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
