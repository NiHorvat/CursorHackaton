import { NavLink } from 'react-router-dom'

export function TabSwitcher() {
  return (
    <div className="ze-tabs" role="tablist" aria-label="Lokacije i eventovi">
      <NavLink
        to="/lokacije"
        role="tab"
        className={({ isActive }) =>
          `ze-tabs__seg${isActive ? ' ze-tabs__seg--active' : ''}`
        }
      >
        Lokacije
      </NavLink>
      <NavLink
        to="/eventovi"
        role="tab"
        className={({ isActive }) =>
          `ze-tabs__seg${isActive ? ' ze-tabs__seg--active' : ''}`
        }
      >
        Eventovi
      </NavLink>
    </div>
  )
}
