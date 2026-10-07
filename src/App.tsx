import { type FormEvent, useState } from 'react'
import {
  contacts as initialContacts,
  dashboardStats,
  pipelineStages,
  weeklyActivity,
} from './data/crm-data'
import './App.css'

const statusColors = ['#f97316', '#0ea5e9', '#8b5cf6', '#14b8a6']

function formatPercent(value: number, total: number) {
  if (total === 0) {
    return '0%'
  }

  return `${Math.round((value / total) * 100)}%`
}

function App() {
  const [contactList, setContactList] = useState(initialContacts)
  const [query, setQuery] = useState('')
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
  const donutGradient = pipelineStages
    .map((stage, index) => {
      const start =
        (pipelineStages
          .slice(0, index)
          .reduce((sum, previous) => sum + previous.value, 0) /
          pipelineTotal) *
        100
      const end = ((start + stage.value / pipelineTotal * 100) * 3.6).toFixed(2)
      const startAngle = (start * 3.6).toFixed(2)

      return `${statusColors[index % statusColors.length]} ${startAngle}deg ${end}deg`
    })
    .join(', ')

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
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">CRM de clientes</p>
          <h1>Panel ligero para seguir contactos, actividad y oportunidades</h1>
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
        <section className="panel chart-panel" aria-labelledby="activity-heading">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Actividad semanal</p>
              <h2 id="activity-heading">Llamadas, correos y reuniones</h2>
            </div>
            <span className="panel-subtitle">Resumen de los últimos 5 días</span>
          </div>

          <div className="bar-chart" aria-label="Gráfico de actividad semanal">
            {weeklyActivity.map((point) => (
              <article className="bar-chart-day" key={point.day}>
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

        <section className="panel chart-panel" aria-labelledby="pipeline-heading">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Pipeline</p>
              <h2 id="pipeline-heading">Distribución de oportunidades</h2>
            </div>
            <span className="panel-subtitle">{pipelineTotal} oportunidades</span>
          </div>

          <div className="pipeline-card">
            <div
              className="donut-chart"
              aria-label="Gráfico circular del pipeline"
              role="img"
              style={{ backgroundImage: `conic-gradient(${donutGradient})` }}
            >
              <div>
                <strong>{formatPercent(pipelineStages[1]?.value ?? 0, pipelineTotal)}</strong>
                <span>Demo</span>
              </div>
            </div>

            <ul className="pipeline-list">
              {pipelineStages.map((stage, index) => (
                <li key={stage.stage}>
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
        <aside className="panel contact-list-panel" aria-labelledby="contacts-heading">
          <div className="panel-heading stacked-mobile">
            <div>
              <p className="panel-kicker">Directorio</p>
              <h2 id="contacts-heading">Contactos</h2>
            </div>

            <label className="search-field" htmlFor="contact-search">
              <span className="sr-only">Buscar por nombre o empresa</span>
              <input
                id="contact-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar nombre o empresa"
              />
            </label>
          </div>

          <form className="contact-form" onSubmit={handleCreateContact} noValidate>
            <div className="contact-form-header">
              <div>
                <p className="panel-kicker">Nuevo contacto</p>
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

                return (
                  <li key={contact.id}>
                    <button
                      type="button"
                      className={isSelected ? 'contact-card is-selected' : 'contact-card'}
                      onClick={() => setSelectedContactId(contact.id)}
                      aria-pressed={isSelected}
                    >
                      <span className="contact-avatar" aria-hidden="true">
                        {contact.name
                          .split(' ')
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join('')}
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
    </main>
  )
}

export default App