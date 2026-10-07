import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactsPage from './ContactsPage'

describe('ContactsPage', () => {
  it('creates, edits and deletes a contact', async () => {
    const user = userEvent.setup()
    render(<ContactsPage />)

    await user.type(screen.getByLabelText('Name'), 'Laura Gomez')
    await user.type(screen.getByLabelText('Role'), 'Marketing')
    await user.type(screen.getByLabelText('Email'), 'laura@example.com')
    await user.type(screen.getByLabelText('Phone'), '+34 600 100 200')
    await user.type(screen.getByLabelText('Company'), 'Orbit Labs')
    await user.click(screen.getByRole('button', { name: 'Save contact' }))

    expect(screen.getByRole('button', { name: /Laura Gomez Nuevo/i })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /Laura Gomez Nuevo/i }))
    await user.click(screen.getByRole('button', { name: 'Edit contact' }))

    const nameInput = screen.getByLabelText('Name')
    await user.clear(nameInput)
    await user.type(nameInput, 'Laura Gomez Updated')
    await user.click(screen.getByRole('button', { name: 'Update contact' }))

    expect(
      screen.getByRole('button', { name: /Laura Gomez Updated Nuevo/i }),
    ).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /Laura Gomez Updated Nuevo/i }))
    await user.click(screen.getByRole('button', { name: 'Delete contact' }))

    expect(
      screen.queryByRole('button', { name: /Laura Gomez Updated Nuevo/i }),
    ).toBeNull()
  })
})
