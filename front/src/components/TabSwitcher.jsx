import { NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export function TabSwitcher() {
  const { pathname } = useLocation()
  const { t } = useLanguage()

  return (
    <div className="ze-tabs" role="tablist" aria-label={t('tabs.aria')}>
      <NavLink
        to="/lokacije"
        role="tab"
        className={() =>
          `ze-tabs__seg${pathname.startsWith('/lokacije') ? ' ze-tabs__seg--active' : ''}`
        }
      >
        {t('nav.locations')}
      </NavLink>
      <NavLink
        to="/eventovi"
        role="tab"
        className={() =>
          `ze-tabs__seg${pathname.startsWith('/eventovi') ? ' ze-tabs__seg--active' : ''}`
        }
      >
        {t('nav.events')}
      </NavLink>
    </div>
  )
}
