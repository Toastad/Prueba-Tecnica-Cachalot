import { type FormEvent, useState } from 'react'
import { contacts } from './data/contacts'
import './App.css'

function App() {
  const [contactList, setContactList] = useState(contacts)
  const [query, setQuery] = useState('')
  const [selectedContactId, setSelectedContactId] = useState(contactList[0]?.id ?? '')
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

  const visibleContacts = contactList.filter((contact) => {
    const normalizedQuery = query.trim().toLowerCase()

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
    <main className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">CRM de contactos</p>
          <h1>Lista inicial de clientes importados</h1>
          <p className="lead">
            Esta primera entrega muestra contactos simulados, búsqueda por nombre
            o empresa y una vista de detalle para revisar la información básica.
          </p>
        </div>

        <div className="hero-stats" aria-label="Resumen del panel">
          <div>
            <strong>{contacts.length}</strong>
            <span>contactos cargados</span>
          </div>
          <div>
            <strong>{visibleContacts.length}</strong>
            <span>coincidencias visibles</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="panel contact-list-panel" aria-labelledby="contacts-heading">
          <div className="panel-header">
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
              <p>Se guardará solo en esta sesión usando datos simulados.</p>
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
              <div className="panel-header detail-header">
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