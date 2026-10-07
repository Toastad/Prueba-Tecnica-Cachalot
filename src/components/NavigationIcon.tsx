export type NavigationIconName =
  | 'dashboard'
  | 'contacts'
  | 'trend'
  | 'stack'
  | 'chart'
  | 'gear'

export function NavigationIcon({ name }: { name: NavigationIconName }) {
  switch (name) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 12h6V4H4zm0 8h6v-6H4zm10 0h6V11h-6zm0-16v6h6V4z" />
        </svg>
      )
    case 'contacts':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 7a5 5 0 1 1 10 0 5 5 0 0 1-10 0Zm-3 13c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      )
    case 'trend':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 17 10 11l4 4 6-8" />
          <path d="M14 7h6v6" />
        </svg>
      )
    case 'stack':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 3 8l9 5 9-5-9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        </svg>
      )
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19h16" />
          <path d="M7 15v-5" />
          <path d="M12 15V7" />
          <path d="M17 15v-3" />
        </svg>
      )
    case 'gear':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="m19 12 2-1-1-3-2 .5a7 7 0 0 0-1.4-1.4L17 4l-3-1-1 2a7 7 0 0 0-2 0l-1-2-3 1 .4 2.1A7 7 0 0 0 5 8.5L3 8l-1 3 2 1a7 7 0 0 0 0 2l-2 1 1 3 2-.5a7 7 0 0 0 1.4 1.4L7 20l3 1 1-2a7 7 0 0 0 2 0l1 2 3-1-.4-2.1A7 7 0 0 0 18 15.5l2 .5 1-3-2-1a7 7 0 0 0 0-2Z" />
        </svg>
      )
  }
}
