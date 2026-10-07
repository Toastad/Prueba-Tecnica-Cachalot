import { type CSSProperties, type FormEvent, type MouseEvent, useState } from 'react'
import {
  contacts as initialContacts,
  dashboardStats,
  pipelineStages,
  weeklyActivity,
} from './data/crm-data'
import './App.css'

type NavigationIconName = 'dashboard' | 'contacts' | 'trend' | 'stack' | 'chart' | 'gear'

type NavigationItem = {
  label: string
  href: string
  active: boolean
  icon: NavigationIconName
}

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '#dashboard', active: true, icon: 'dashboard' },
  { label: 'Contacts', href: '#contacts', active: false, icon: 'contacts' },
  { label: 'Transactions', href: '#activity', active: false, icon: 'trend' },
  { label: 'Accounts', href: '#pipeline', active: false, icon: 'stack' },
  { label: 'Reports', href: '#contacts', active: false, icon: 'chart' },
  { label: 'Settings', href: '#contacts', active: false, icon: 'gear' },
]

const pipelineColors = ['#8b5cf6', '#0ea5e9', '#14b8a6', '#f97316']
const activityColors = ['#8b5cf6', '#0ea5e9', '#14b8a6', '#f97316', '#ec4899']

function NavigationIcon({ name }: { name: NavigationIconName }) {
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

function formatPercent(value: number, total: number) {
  if (total === 0) {
    return '0%'
  }

  return `${Math.round((value / total) * 100)}%`
}

function App() {
  const [contactList, setContactList] = useState(initialContacts)
  const [query, setQuery] = useState('')
  const [hoveredPipelineIndex, setHoveredPipelineIndex] = useState<number | null>(null)
  const [selectedContactId, setSelectedContactId] = useState(
    initialContacts[0]?.id ?? '',
  )
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
  })

  const normalizedQuery = query.trim().toLowerCase()
  const visibleContacts = contactList.filter((contact) => {
    if (!normalizedQuery) {
      return true
    }

    return (
      contact.name.toLowerCase().includes(normalizedQuery) ||
      contact.company.toLowerCase().includes(normalizedQuery)
    )
  })

  const selectedContact =
    visibleContacts.find((contact) => contact.id === selectedContactId) ??
    visibleContacts[0] ??
    contactList[0]

  const maxCalls = Math.max(...weeklyActivity.map((point) => point.calls))
  const maxEmails = Math.max(...weeklyActivity.map((point) => point.emails))
  const maxMeetings = Math.max(...weeklyActivity.map((point) => point.meetings))
  const pipelineTotal = pipelineStages.reduce((sum, stage) => sum + stage.value, 0)
  const activePipelineIndex = hoveredPipelineIndex ?? 1
  const activePipelineStage =
    pipelineStages[activePipelineIndex] ?? pipelineStages[0] ?? { stage: 'Sin datos', value: 0 }

  const donutSegments = pipelineStages.map((stage, index) => {
    const startPortion =
      pipelineStages
        .slice(0, index)
        .reduce((sum, previous) => sum + previous.value, 0) / pipelineTotal
    const portion = stage.value / pipelineTotal

    return {
      stage,
      index,
      startPortion,
      portion,
      color: pipelineColors[index % pipelineColors.length],
    }
  })

  function handleDonutHover(event: MouseEvent<HTMLDivElement>) {
    const targetRect = event.currentTarget.getBoundingClientRect()
    const centerX = targetRect.left + targetRect.width / 2
    const centerY = targetRect.top + targetRect.height / 2
    const dx = event.clientX - centerX
    const dy = event.clientY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const radius = Math.min(targetRect.width, targetRect.height) / 2
    const innerRadius = radius * 0.5
    const outerRadius = radius * 0.84

    if (distance < innerRadius || distance > outerRadius || pipelineTotal === 0) {
      setHoveredPipelineIndex(null)
      return
    }

    const angleDegrees = (Math.atan2(dy, dx) * 180) / Math.PI
    const normalizedDegrees = (angleDegrees + 90 + 360) % 360
    const normalizedPortion = normalizedDegrees / 360

    const segmentIndex = donutSegments.findIndex((segment) => {
      const segmentEnd = segment.startPortion + segment.portion

      return normalizedPortion >= segment.startPortion && normalizedPortion < segmentEnd
    })

    setHoveredPipelineIndex(segmentIndex >= 0 ? segmentIndex : null)
  }

  function handleCreateContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = {
      name: formValues.name.trim() ? '' : 'El nombre es obligatorio.',
      email: '',
    }

    if (!formValues.email.trim()) {
      nextErrors.email = 'El correo es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      nextErrors.email = 'Ingresa un correo con formato válido.'
    }

    setFormErrors(nextErrors)

    if (nextErrors.name || nextErrors.email) {
      return
    }

    const newContact = {
      id: `contact-${Date.now()}`,
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim() || 'Sin teléfono',
      company: formValues.company.trim() || 'Sin empresa',
      role: 'Nuevo contacto',
      status: 'Nuevo',
      photo: null,
      notes: [],
    }

    setContactList((currentContacts) => [newContact, ...currentContacts])
    setSelectedContactId(newContact.id)
    setQuery('')
    setFormValues({
      name: '',
      email: '',
      phone: '',
      company: '',
    })
    setFormErrors({
      name: '',
      email: '',
    })
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Navegación principal">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            B
          </div>
          <div>
            <strong>BankDash</strong>
            <span>CRM workspace</span>
          </div>
        </div>

        <nav className="side-nav">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={item.active ? 'nav-link is-active' : 'nav-link'}
              aria-current={item.active ? 'page' : undefined}
            >
              <span className="nav-dot" aria-hidden="true" />
              <span className="nav-icon" aria-hidden="true">
                <NavigationIcon name={item.icon} />
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="panel-kicker">Weekly target</p>
          <strong>87%</strong>
          <span>de actividades completadas</span>
        </div>
      </aside>

      <section className="content">
        <header className="topbar" id="dashboard">
          <div>
            <p className="eyebrow">CRM de clientes</p>
            <h1>Overview</h1>
          </div>

          <button type="button" className="topbar-chip">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="chip-icon">
              <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.5-1.5L20 20" />
            </svg>
            <span>Search for something</span>
          </button>
        </header>

        <section className="hero-card">
          <div className="hero-copy">
            <p className="lead">
              Una interfaz tipo app, pensada para celular y escritorio, con datos
              simulados, gráficos simples y acciones rápidas sobre cada cliente.
            </p>
          </div>

          <div className="hero-metrics" aria-label="Resumen del panel">
            {dashboardStats.map((stat) => (
              <article className="metric-card" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-grid">
          <section className="panel chart-panel" id="activity" aria-labelledby="activity-heading">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">Weekly Activity</p>
                <h2 id="activity-heading">Llamadas, correos y reuniones</h2>
              </div>
              <span className="panel-subtitle">Resumen de los últimos 5 días</span>
            </div>

            <div className="bar-chart" aria-label="Gráfico de actividad semanal">
              {weeklyActivity.map((point, index) => (
                <article
                  className="bar-chart-day"
                  key={point.day}
                  style={{ '--activity-accent': activityColors[index % activityColors.length] } as CSSProperties}
                >
                  <div className="bar-column" aria-hidden="true">
                    <span
                      className="bar bar-calls"
                      style={{ height: `${Math.max((point.calls / maxCalls) * 100, 12)}%` }}
                    />
                    <span
                      className="bar bar-emails"
                      style={{ height: `${Math.max((point.emails / maxEmails) * 100, 12)}%` }}
                    />
                    <span
                      className="bar bar-meetings"
                      style={{ height: `${Math.max((point.meetings / maxMeetings) * 100, 12)}%` }}
                    />
                  </div>
                  <div className="bar-chart-labels">
                    <strong>{point.day}</strong>
                    <span>{point.calls + point.emails + point.meetings} interacciones</span>
                  </div>
                </article>
              ))}
            </div>

            <ul className="chart-legend" aria-label="Leyenda del gráfico de actividad">
              <li><span className="legend-swatch calls" /> Llamadas</li>
              <li><span className="legend-swatch emails" /> Correos</li>
              <li><span className="legend-swatch meetings" /> Reuniones</li>
            </ul>
          </section>

          <section className="panel chart-panel" id="pipeline" aria-labelledby="pipeline-heading">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">Recent transactions</p>
                <h2 id="pipeline-heading">Distribución de oportunidades</h2>
              </div>
              <span className="panel-subtitle">{pipelineTotal} oportunidades</span>
            </div>

            <div className="pipeline-card">
              <div
                className="donut-chart"
                aria-label="Gráfico circular del pipeline"
                role="img"
                onMouseMove={handleDonutHover}
                onMouseLeave={() => setHoveredPipelineIndex(null)}
              >
                <svg viewBox="0 0 120 120" className="donut-chart-svg" aria-hidden="true">
                  <circle cx="60" cy="60" r="40" className="donut-track" />
                  {donutSegments.map((segment) => {
                    const circumference = 2 * Math.PI * 40

                    return (
                      <circle
                        key={segment.stage.stage}
                        cx="60"
                        cy="60"
                        r="40"
                        className={
                          segment.index === activePipelineIndex
                            ? 'donut-segment is-active'
                            : 'donut-segment'
                        }
                        style={{
                          stroke: segment.color,
                          strokeDasharray: `${segment.portion * circumference} ${circumference}`,
                          strokeDashoffset: `${-segment.startPortion * circumference}`,
                        }}
                        transform="rotate(-90 60 60)"
                      />
                    )
                  })}
                </svg>
                <div>
                  <strong>{formatPercent(activePipelineStage.value, pipelineTotal)}</strong>
                  <span>{activePipelineStage.stage}</span>
                  <small>{activePipelineStage.value} oportunidades</small>
                </div>
              </div>

              <ul className="pipeline-list">
                {pipelineStages.map((stage, index) => (
                  <li
                    key={stage.stage}
                    style={{ '--stage-accent': pipelineColors[index % pipelineColors.length] } as CSSProperties}
                    onMouseEnter={() => setHoveredPipelineIndex(index)}
                    onFocus={() => setHoveredPipelineIndex(index)}
                    onMouseLeave={() => setHoveredPipelineIndex(null)}
                    onBlur={() => setHoveredPipelineIndex(null)}
                    tabIndex={0}
                  >
                    <span className={`legend-swatch stage-${index}`} aria-hidden="true" />
                    <div>
                      <strong>{stage.stage}</strong>
                      <small>{stage.value} oportunidades</small>
                    </div>
                    <strong>{formatPercent(stage.value, pipelineTotal)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </section>

        <section className="workspace">
          <aside className="panel contact-list-panel" id="contacts" aria-labelledby="contacts-heading">
            <div className="panel-heading stacked-mobile">
              <div>
                <p className="panel-kicker">Directorio</p>
                <h2 id="contacts-heading">Contacts</h2>
              </div>

              <label className="search-field" htmlFor="contact-search">
                <span className="sr-only">Buscar por nombre o empresa</span>
                <input
                  id="contact-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name or company"
                />
              </label>
            </div>

            <form className="contact-form" onSubmit={handleCreateContact} noValidate>
              <div className="contact-form-header">
                <div>
                  <p className="panel-kicker">Add card</p>
                  <h3>Agregar cliente</h3>
                </div>
                <p>Se guarda en memoria local y se selecciona automáticamente.</p>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>Nombre *</span>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        name: event.target.value,
                      }))
                    }
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? 'name-error' : undefined}
                    placeholder="Ej. Laura Gómez"
                  />
                  {formErrors.name ? (
                    <small id="name-error" className="field-error">
                      {formErrors.name}
                    </small>
                  ) : null}
                </label>

                <label className="field">
                  <span>Correo *</span>
                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        email: event.target.value,
                      }))
                    }
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                    placeholder="Ej. laura@empresa.com"
                  />
                  {formErrors.email ? (
                    <small id="email-error" className="field-error">
                      {formErrors.email}
                    </small>
                  ) : null}
                </label>

                <label className="field">
                  <span>Teléfono</span>
                  <input
                    type="tel"
                    value={formValues.phone}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="Ej. +34 600 123 456"
                  />
                </label>

                <label className="field">
                  <span>Empresa</span>
                  <input
                    type="text"
                    value={formValues.company}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        company: event.target.value,
                      }))
                    }
                    placeholder="Ej. Norte Digital"
                  />
                </label>
              </div>

              <button type="submit" className="submit-button">
                Guardar contacto
              </button>
            </form>

            {visibleContacts.length === 0 ? (
              <div className="empty-state" role="status">
                <h3>No hay coincidencias</h3>
                <p>Prueba con otro nombre de cliente o empresa.</p>
              </div>
            ) : (
              <ul className="contact-list" aria-label="Lista de contactos">
                {visibleContacts.map((contact) => {
                  const isSelected = contact.id === selectedContact?.id
                  const hasPhoto = Boolean(contact.photo)

                  return (
                    <li key={contact.id}>
                      <button
                        type="button"
                        className={isSelected ? 'contact-card is-selected' : 'contact-card'}
                        onClick={() => setSelectedContactId(contact.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="contact-avatar" aria-hidden="true">
                          {hasPhoto ? (
                            <img src={contact.photo ?? undefined} alt="" />
                          ) : (
                            <span className="avatar-fallback">
                              {contact.name
                                .split(' ')
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join('')}
                            </span>
                          )}
                        </span>

                        <span className="contact-card-copy">
                          <strong>{contact.name}</strong>
                          <span>{contact.company}</span>
                          <small>{contact.email}</small>
                        </span>

                        <span className="contact-status">{contact.status}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </aside>

          <section className="panel detail-panel" aria-labelledby="contact-detail-heading">
            {selectedContact ? (
              <>
                <div className="panel-heading stacked-mobile">
                  <div>
                    <p className="panel-kicker">Detalle del contacto</p>
                    <h2 id="contact-detail-heading">{selectedContact.name}</h2>
                  </div>
                  <span className="detail-badge">{selectedContact.status}</span>
                </div>

                <dl className="detail-grid">
                  <div>
                    <dt>Correo</dt>
                    <dd>{selectedContact.email}</dd>
                  </div>
                  <div>
                    <dt>Teléfono</dt>
                    <dd>{selectedContact.phone}</dd>
                  </div>
                  <div>
                    <dt>Empresa</dt>
                    <dd>{selectedContact.company}</dd>
                  </div>
                  <div>
                    <dt>Área</dt>
                    <dd>{selectedContact.role}</dd>
                  </div>
                </dl>

                <section className="notes-section" aria-labelledby="notes-heading">
                  <div className="section-title">
                    <h3 id="notes-heading">Notas guardadas</h3>
                    <span>{selectedContact.notes.length} nota(s)</span>
                  </div>

                  {selectedContact.notes.length > 0 ? (
                    <ul className="notes-list">
                      {selectedContact.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-state compact" role="status">
                      <h3>Aún no hay notas</h3>
                      <p>En el siguiente paso agregaremos el formulario para crearlas.</p>
                    </div>
                  )}
                </section>
              </>
            ) : (
              <div className="empty-state" role="status">
                <h3>No hay contacto seleccionado</h3>
                <p>Elige un cliente desde la lista para ver su información.</p>
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  )
}

export default App