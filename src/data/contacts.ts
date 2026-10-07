export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: string
  notes: string[]
}

export const contacts: Contact[] = [
  {
    id: 'ana-perez',
    name: 'Ana Pérez',
    email: 'ana.perez@solstice.io',
    phone: '+34 612 345 890',
    company: 'Solstice',
    role: 'Operaciones',
    status: 'Activo',
    notes: ['Llamada de seguimiento el 5 de octubre'],
  },
  {
    id: 'marco-ruiz',
    name: 'Marco Ruiz',
    email: 'marco@northpeak.mx',
    phone: '+52 55 9211 4008',
    company: 'North Peak',
    role: 'Compras',
    status: 'En seguimiento',
    notes: ['Pedir actualización de propuesta para el viernes'],
  },
  {
    id: 'luisa-ferrer',
    name: 'Luisa Ferrer',
    email: 'luisa@atelier.studio',
    phone: '+57 320 884 1122',
    company: 'Atelier Studio',
    role: 'Dirección',
    status: 'Nuevo',
    notes: [],
  },
  {
    id: 'diego-mora',
    name: 'Diego Mora',
    email: 'diego.mora@canopylabs.com',
    phone: '+1 305 555 0148',
    company: 'Canopy Labs',
    role: 'Ventas',
    status: 'Activo',
    notes: ['Enviar resumen de la demo antes del cierre de mes'],
  },
]