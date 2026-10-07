export type ThemeMode = 'light' | 'dark'

export type DashboardPreferences = {
  theme: ThemeMode
  notifications: boolean
  compactCards: boolean
  weeklyDigest: boolean
}

export const defaultPreferences: DashboardPreferences = {
  theme: 'light',
  notifications: true,
  compactCards: true,
  weeklyDigest: false,
}

const STORAGE_KEY = 'dashboard-preferences'
const THEME_KEY = 'app-theme'
const EVENT_NAME = 'dashboard-preferences-change'

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark'
}

export function getDashboardPreferences(): DashboardPreferences {
  if (typeof window === 'undefined') {
    return defaultPreferences
  }

  const rawTheme = window.localStorage.getItem(THEME_KEY)
  const parsedTheme = isThemeMode(rawTheme) ? rawTheme : defaultPreferences.theme
  const rawPreferences = window.localStorage.getItem(STORAGE_KEY)

  if (!rawPreferences) {
    return { ...defaultPreferences, theme: parsedTheme }
  }

  try {
    const parsed = JSON.parse(rawPreferences) as Partial<DashboardPreferences>
    return {
      theme: isThemeMode(parsed.theme) ? parsed.theme : parsedTheme,
      notifications:
        typeof parsed.notifications === 'boolean'
          ? parsed.notifications
          : defaultPreferences.notifications,
      compactCards:
        typeof parsed.compactCards === 'boolean'
          ? parsed.compactCards
          : defaultPreferences.compactCards,
      weeklyDigest:
        typeof parsed.weeklyDigest === 'boolean'
          ? parsed.weeklyDigest
          : defaultPreferences.weeklyDigest,
    }
  } catch {
    return { ...defaultPreferences, theme: parsedTheme }
  }
}

export function saveDashboardPreferences(preferences: DashboardPreferences) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  window.localStorage.setItem(THEME_KEY, preferences.theme)
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: preferences }))
}

export function subscribeDashboardPreferences(
  callback: (preferences: DashboardPreferences) => void,
) {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<DashboardPreferences>
    callback(customEvent.detail)
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === THEME_KEY) {
      callback(getDashboardPreferences())
    }
  }

  window.addEventListener(EVENT_NAME, handleCustomEvent)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(EVENT_NAME, handleCustomEvent)
    window.removeEventListener('storage', handleStorage)
  }
}