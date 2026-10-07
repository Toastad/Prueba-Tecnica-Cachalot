import { useEffect, useState } from 'react'
import {
  getDashboardPreferences,
  saveDashboardPreferences,
  subscribeDashboardPreferences,
  type DashboardPreferences,
} from '../lib/preferences'

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<DashboardPreferences>(() =>
    getDashboardPreferences(),
  )

  useEffect(() => {
    return subscribeDashboardPreferences((nextPreferences) => {
      setPreferences(nextPreferences)
    })
  }, [])

  const updatePreferences = (nextPreferences: DashboardPreferences) => {
    setPreferences(nextPreferences)
    saveDashboardPreferences(nextPreferences)
  }

  const togglePreference = (
    key: 'notifications' | 'compactCards' | 'weeklyDigest',
  ) => {
    updatePreferences({
      ...preferences,
      [key]: !preferences[key],
    })
  }

  const toggleTheme = () => {
    updatePreferences({
      ...preferences,
      theme: preferences.theme === 'dark' ? 'light' : 'dark',
    })
  }

  const themeLabel = preferences.theme === 'dark' ? 'Dark' : 'Light'

  return (
    <section className="content-grid" aria-label="Settings workspace">
      <article className="panel settings-panel">
        <header>
          <p className="panel-kicker">Appearance</p>
          <h2>Workspace preferences</h2>
        </header>

        <p className="muted-copy settings-intro">
          Ajusta la experiencia visual del dashboard y controla como se presenta la
          informacion en pantallas densas.
        </p>

        <div className="settings-list">
          <button type="button" className="settings-item settings-toggle" onClick={toggleTheme}>
            <div className="settings-item-copy">
              <strong>Theme</strong>
              <span>Switch instantly between light and dark workspace mode</span>
            </div>
            <div className="settings-item-meta">
              <small className="settings-note">Applied across the whole dashboard</small>
              <span className="settings-badge">{themeLabel}</span>
              <span
                className={`settings-switch${preferences.theme === 'dark' ? ' is-on' : ''}`}
                aria-hidden="true"
              >
                <span className="settings-switch-thumb" />
              </span>
            </div>
          </button>

          <button
            type="button"
            className="settings-item settings-toggle"
            onClick={() => togglePreference('compactCards')}
          >
            <div className="settings-item-copy">
              <strong>Compact cards</strong>
              <span>Reduce spacing on dense dashboards</span>
            </div>
            <div className="settings-item-meta">
              <span className="settings-badge">
                {preferences.compactCards ? 'Enabled' : 'Disabled'}
              </span>
              <span
                className={`settings-switch${preferences.compactCards ? ' is-on' : ''}`}
                aria-hidden="true"
              >
                <span className="settings-switch-thumb" />
              </span>
            </div>
          </button>
        </div>
      </article>

      <article className="panel settings-panel">
        <header>
          <p className="panel-kicker">Alerts</p>
          <h2>Notification center</h2>
        </header>

        <p className="muted-copy settings-intro">
          Define que avisos deben mantenerse activos para el equipo y cuales pueden
          resumirse en el digest semanal.
        </p>

        <div className="settings-list">
          <button
            type="button"
            className="settings-item settings-toggle"
            onClick={() => togglePreference('notifications')}
          >
            <div className="settings-item-copy">
              <strong>Push notifications</strong>
              <span>Alerts for new contact activity</span>
            </div>
            <div className="settings-item-meta">
              <span className="settings-badge">{preferences.notifications ? 'On' : 'Off'}</span>
              <span
                className={`settings-switch${preferences.notifications ? ' is-on' : ''}`}
                aria-hidden="true"
              >
                <span className="settings-switch-thumb" />
              </span>
            </div>
          </button>

          <button
            type="button"
            className="settings-item settings-toggle"
            onClick={() => togglePreference('weeklyDigest')}
          >
            <div className="settings-item-copy">
              <strong>Weekly digest</strong>
              <span>Receive a report summary every Friday</span>
            </div>
            <div className="settings-item-meta">
              <span className="settings-badge">{preferences.weeklyDigest ? 'On' : 'Off'}</span>
              <span
                className={`settings-switch${preferences.weeklyDigest ? ' is-on' : ''}`}
                aria-hidden="true"
              >
                <span className="settings-switch-thumb" />
              </span>
            </div>
          </button>
        </div>
      </article>
    </section>
  )
}
