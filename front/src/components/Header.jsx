import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `ze-nav__link${isActive ? ' ze-nav__link--active' : ''}`

export function Header() {
  return (
    <header className="ze-header">
      <NavLink to="/" className="ze-logo" end>
        Zagreb Events
      </NavLink>
      <nav className="ze-nav" aria-label="Glavna navigacija">
        <NavLink to="/" className={linkClass} end>
          Početna
        </NavLink>
        <NavLink to="/lokacije" className={linkClass}>
          Lokacije
        </NavLink>
        <NavLink to="/eventovi" className={linkClass}>
          Eventovi
        </NavLink>
      </nav>
      <button type="button" className="ze-lang">
        Language
      </button>
    </header>
  )
}
