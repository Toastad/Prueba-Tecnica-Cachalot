import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import AppLayout from './layout/AppLayout.tsx'
import AccountsPage from './pages/AccountsPage.tsx'
import ContactsPage from './pages/ContactsPage.tsx'
import HomePage from './pages/HomePage.tsx'
import ReportsPage from './pages/ReportsPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import TransactionsPage from './pages/TransactionsPage.tsx'
import './styles/app.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'accounts', element: <AccountsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/app',
    element: <App />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
