import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { NavigationIcon, type NavigationIconName } from '../components/NavigationIcon'
import {
  getDashboardPreferences,
  saveDashboardPreferences,
  subscribeDashboardPreferences,
  type ThemeMode,
} from '../lib/preferences'

type NavigationItem = {
  label: string
  to: string
  icon: NavigationIconName
  keywords: string[]
}

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', to: '/', icon: 'dashboard', keywords: ['home', 'overview', 'stats'] },
  { label: 'Contacts', to: '/contacts', icon: 'contacts', keywords: ['clients', 'directory', 'people'] },
  { label: 'Transactions', to: '/transactions', icon: 'trend', keywords: ['activity', 'growth', 'weekly'] },
  { label: 'Accounts', to: '/accounts', icon: 'stack', keywords: ['pipeline', 'stages', 'funnel'] },
  { label: 'Reports', to: '/reports', icon: 'chart', keywords: ['analytics', 'insights', 'tables'] },
  { label: 'Settings', to: '/settings', icon: 'gear', keywords: ['preferences', 'theme', 'notifications'] },
]

const pageTitleByPath: Record<string, string> = {
  '/': 'Overview',
  '/contacts': 'Contacts',
  '/transactions': 'Transactions',
  '/accounts': 'Accounts',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = pageTitleByPath[location.pathname] ?? 'Overview'
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>(() => getDashboardPreferences().theme)

  useEffect(() => {
    const preferences = getDashboardPreferences()
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.compact = preferences.compactCards ? 'true' : 'false'
  }, [theme])

  useEffect(() => subscribeDashboardPreferences((preferences) => setTheme(preferences.theme)), [])

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
      saveDashboardPreferences({
        ...getDashboardPreferences(),
        theme: nextTheme,
      })
      return nextTheme
    })
  }

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) {
      return []
    }

    return navigationItems.filter((item) => {
      const haystack = [item.label, ...item.keywords].join(' ').toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [searchQuery])

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (searchResults.length === 0) {
      return
    }

    navigate(searchResults[0].to)
    setSearchQuery('')
    setMobileSearchOpen(false)
  }

  const handleSearchNavigation = (path: string) => {
    navigate(path)
    setSearchQuery('')
    setMobileSearchOpen(false)
  }

  return (
    <main className="app-shell">
      <header className="mobile-top-strip" aria-label="Barra superior movil">
        <div className="mobile-brand">
          <span className="brand-mark" aria-hidden="true">
            <img src="/logos/Bank.png" alt="" className="brand-logo" />
          </span>
          <div>
            <span>{title}</span>
          </div>
        </div>
        <button
          type="button"
          className="mobile-search"
          aria-label="Search"
          onClick={() => setMobileSearchOpen((current) => !current)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="chip-icon">
            <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.5-1.5L20 20" />
          </svg>
        </button>
        <button type="button" className="theme-toggle mobile-theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </header>

      {mobileSearchOpen ? (
        <form className="mobile-search-panel" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search sections"
            className="search-input"
          />
          {searchResults.length > 0 ? (
            <div className="search-results" role="listbox" aria-label="Search results">
              {searchResults.map((item) => (
                <button
                  key={`mobile-search-${item.to}`}
                  type="button"
                  className="search-result"
                  onClick={() => handleSearchNavigation(item.to)}
                >
                  <span>{item.label}</span>
                  <small>{item.keywords[0]}</small>
                </button>
              ))}
            </div>
          ) : null}
        </form>
      ) : null}

      <aside className="sidebar" aria-label="Navegacion principal">
        <div className="sidebar-inner">
          <div className="brand-block">
            <div className="brand-mark" aria-hidden="true">
              <img src="/logos/Bank.png" alt="" className="brand-logo" />
            </div>
            <div>
              <span>CRM workspace</span>
            </div>
          </div>

          <nav className="side-nav">
            {navigationItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'nav-link is-active' : 'nav-link'
                }
              >
                <span className="nav-dot" aria-hidden="true" />
                <span className="nav-icon" aria-hidden="true">
                  <NavigationIcon name={item.icon} />
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-card">
            <p className="panel-kicker">Weekly target</p>
            <strong>87%</strong>
            <span>de actividades completadas</span>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar" id="dashboard">
          <div>
            <p className="eyebrow">CRM de clientes</p>
            <h1>{title}</h1>
          </div>

          <div className="topbar-actions">
            <form className="search-shell" onSubmit={handleSearchSubmit}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="chip-icon">
                <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.5-1.5L20 20" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search sections"
                className="search-input"
                aria-label="Search sections"
              />

              {searchResults.length > 0 ? (
                <div className="search-results" role="listbox" aria-label="Search results">
                  {searchResults.map((item) => (
                    <button
                      key={item.to}
                      type="button"
                      className="search-result"
                      onClick={() => handleSearchNavigation(item.to)}
                    >
                      <span>{item.label}</span>
                      <small>{item.keywords[0]}</small>
                    </button>
                  ))}
                </div>
              ) : null}
            </form>

            <button type="button" className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </div>
        </header>

        <div key={location.pathname} className="page-transition-shell">
          <Outlet />
        </div>
      </section>

      <nav className="mobile-bottom-nav" aria-label="Navegacion inferior movil">
        {navigationItems.map((item) => (
          <NavLink
            key={`mobile-${item.label}`}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'mobile-nav-link is-active' : 'mobile-nav-link'
            }
          >
            <span className="nav-icon" aria-hidden="true">
              <NavigationIcon name={item.icon} />
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </main>
  )
}
