import { useMemo, useState } from 'react'
import { contacts as contactsSeed } from '../data/crm-data'
import type { Contact } from '../data/crm-data'

type ContactFormState = {
  name: string
  role: string
  email: string
  phone: string
  company: string
  status: string
  photo: string
}

const initialFormState: ContactFormState = {
  name: '',
  role: '',
  email: '',
  phone: '',
  company: '',
  status: 'Nuevo',
  photo: '',
}

const statusOptions = ['Nuevo', 'Activo', 'En seguimiento'] as const

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(contactsSeed)
  const [selectedContactId, setSelectedContactId] = useState(contactsSeed[0]?.id ?? 1)
  const [brokenPhotoIds, setBrokenPhotoIds] = useState<Set<string>>(new Set())
  const [formState, setFormState] = useState<ContactFormState>(initialFormState)
  const [formError, setFormError] = useState<string | null>(null)
  const [editingContactId, setEditingContactId] = useState<string | null>(null)

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.id === selectedContactId) ?? contacts[0],
    [contacts, selectedContactId],
  )

  const getPhotoStyle = (contact: Contact): React.CSSProperties => ({
    objectFit: contact.photoFit ?? 'cover',
    objectPosition: contact.photoPosition ?? '50% 30%',
    transform: `scale(${contact.photoScale ?? 1})`,
  })

  const handleCreateContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = formState.name.trim()
    const trimmedEmail = formState.email.trim()
    const trimmedCompany = formState.company.trim()
    const trimmedPhoto = formState.photo.trim()

    if (!trimmedName || !trimmedEmail) {
      setFormError('Name y email son obligatorios.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(trimmedEmail)) {
      setFormError('Ingresa un email valido.')
      return
    }

    const isDataImage = /^data:image\/[a-zA-Z+.-]+;base64,/.test(trimmedPhoto)
    const isHttpUrl = /^https?:\/\/.+/.test(trimmedPhoto)
    if (trimmedPhoto && !isDataImage && !isHttpUrl) {
      setFormError('La foto debe ser una URL http(s) o una imagen en formato data:image.')
      return
    }

    const contactDraft: Contact = {
      id: editingContactId ?? `contact-${Date.now()}`,
      name: trimmedName,
      role: formState.role.trim() || 'Nuevo contacto',
      email: trimmedEmail,
      phone: formState.phone.trim() || '- -',
      company: trimmedCompany || 'Sin empresa',
      status: formState.status,
      notes: [
        editingContactId
          ? 'Contacto actualizado desde el formulario.'
          : 'Contacto creado desde el formulario.',
      ],
      photo: trimmedPhoto || null,
    }

    setContacts((previous) => {
      if (!editingContactId) {
        return [contactDraft, ...previous]
      }

      return previous.map((contact) =>
        contact.id === editingContactId
          ? {
              ...contact,
              ...contactDraft,
              notes: contact.notes.length > 0 ? contact.notes : contactDraft.notes,
            }
          : contact,
      )
    })
    setSelectedContactId(contactDraft.id)
    setEditingContactId(null)
    setFormState(initialFormState)
    setFormError(null)
  }

  const handleEditContact = () => {
    if (!selectedContact) {
      return
    }

    setEditingContactId(selectedContact.id)
    setFormState({
      name: selectedContact.name,
      role: selectedContact.role,
      email: selectedContact.email,
      phone: selectedContact.phone,
      company: selectedContact.company,
      status: selectedContact.status,
      photo: selectedContact.photo ?? '',
    })
    setFormError(null)
  }

  const handleDeleteContact = () => {
    if (!selectedContact) {
      return
    }

    const remainingContacts = contacts.filter((contact) => contact.id !== selectedContact.id)
    setContacts(remainingContacts)
    setSelectedContactId(remainingContacts[0]?.id ?? '')
    if (editingContactId === selectedContact.id) {
      setEditingContactId(null)
      setFormState(initialFormState)
    }
  }

  const handleCancelEdit = () => {
    setEditingContactId(null)
    setFormState(initialFormState)
    setFormError(null)
  }

  return (
    <section className="content-grid" aria-label="Gestion de contactos">
      <article className="panel contacts-panel">
        <header>
          <p className="panel-kicker">Directory</p>
          <h2>Contacts</h2>
        </header>

        <div className="contact-list" role="list" aria-label="Listado de contactos">
          {contacts.map((contact) => {
            const isActive = contact.id === selectedContact?.id
            const showPhoto = Boolean(contact.photo) && !brokenPhotoIds.has(contact.id)
            const photoStyle = getPhotoStyle(contact)
            return (
              <button
                key={contact.id}
                type="button"
                className={`contact-item${isActive ? ' is-active' : ''}`}
                onClick={() => setSelectedContactId(contact.id)}
                aria-label={`${contact.name} ${contact.status}`}
              >
                <div className="avatar" aria-hidden="true">
                  {showPhoto ? (
                    <img
                      src={contact.photo ?? undefined}
                      alt=""
                      className="avatar-photo"
                      style={photoStyle}
                      onError={() =>
                        setBrokenPhotoIds((previous) => new Set(previous).add(contact.id))
                      }
                    />
                  ) : (
                    contact.name
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .slice(0, 2)
                  )}
                </div>
                <div>
                  <strong>{contact.name}</strong>
                  <span>{contact.status}</span>
                </div>
              </button>
            )
          })}
        </div>
      </article>

      <article className="panel detail-panel" aria-live="polite">
        {selectedContact ? (
          <>
            <header>
              <p className="panel-kicker">Contact detail</p>
              <h2>{selectedContact.name}</h2>
            </header>

            <div className="detail-actions">
              <button type="button" className="secondary-button" onClick={handleEditContact}>
                Edit contact
              </button>
              <button type="button" className="danger-button" onClick={handleDeleteContact}>
                Delete contact
              </button>
            </div>

            <section className="profile-card" aria-label="Carta de presentacion del contacto">
              <div className="profile-card-avatar" aria-hidden="true">
                {selectedContact.photo && !brokenPhotoIds.has(selectedContact.id) ? (
                  <img
                    src={selectedContact.photo}
                    alt=""
                    className="profile-card-photo"
                    style={getPhotoStyle(selectedContact)}
                    onError={() =>
                      setBrokenPhotoIds((previous) =>
                        new Set(previous).add(selectedContact.id),
                      )
                    }
                  />
                ) : (
                  selectedContact.name
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)
                )}
              </div>
              <div className="profile-card-copy">
                <strong>{selectedContact.name}</strong>
                <span>{selectedContact.role}</span>
                <small>{selectedContact.company}</small>
              </div>
            </section>

            <dl className="detail-list">
              <div>
                <dt>Role</dt>
                <dd>{selectedContact.role}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{selectedContact.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{selectedContact.phone}</dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>{selectedContact.company}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selectedContact.status}</dd>
              </div>
              <div>
                <dt>Last activity</dt>
                <dd>{selectedContact.notes[0] ?? 'Sin actividad reciente'}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="muted-copy">No hay contacto seleccionado.</p>
        )}
      </article>

      <article className="panel form-panel">
        <header>
          <p className="panel-kicker">New lead</p>
          <h2>{editingContactId ? 'Edit contact' : 'Create contact'}</h2>
        </header>

        <form className="contact-form" onSubmit={handleCreateContact} noValidate>
          <label>
            Name
            <input
              type="text"
              value={formState.name}
              onChange={(event) =>
                setFormState((current) => ({ ...current, name: event.target.value }))
              }
            />
          </label>

          <label>
            Role
            <input
              type="text"
              value={formState.role}
              onChange={(event) =>
                setFormState((current) => ({ ...current, role: event.target.value }))
              }
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={formState.email}
              onChange={(event) =>
                setFormState((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              value={formState.phone}
              onChange={(event) =>
                setFormState((current) => ({ ...current, phone: event.target.value }))
              }
            />
          </label>

          <label>
            Company
            <input
              type="text"
              value={formState.company}
              onChange={(event) =>
                setFormState((current) => ({ ...current, company: event.target.value }))
              }
            />
          </label>

          <label>
            Status
            <select
              value={formState.status}
              onChange={(event) =>
                setFormState((current) => ({ ...current, status: event.target.value }))
              }
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </label>

          <label>
            Photo URL
            <input
              type="url"
              placeholder="https://... o data:image/..."
              value={formState.photo}
              onChange={(event) =>
                setFormState((current) => ({ ...current, photo: event.target.value }))
              }
            />
          </label>

          {formError ? <p className="form-error">{formError}</p> : null}

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingContactId ? 'Update contact' : 'Save contact'}
            </button>
            {editingContactId ? (
              <button type="button" className="secondary-button" onClick={handleCancelEdit}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </article>
    </section>
  )
}
