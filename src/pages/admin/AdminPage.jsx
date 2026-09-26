import { useState, useEffect } from 'react'
import AdminLogin from './AdminLogin.jsx'
import AdminDashboard from './AdminDashboard.jsx'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [csrfToken, setCsrfToken] = useState('')
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let ignore = false
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/content.php')
        if (!ignore && res.ok) {
          const json = await res.json()
          if (!ignore && json.success) {
            setIsAuthenticated(true)
            setCsrfToken(json.csrf || '')
          }
        }
      } catch {
        // Not authenticated
      } finally {
        if (!ignore) {
          setIsChecking(false)
        }
      }
    }

    checkSession()
    return () => {
      ignore = true
    }
  }, [])

  const handleLoginSuccess = (csrf) => {
    setIsAuthenticated(true)
    setCsrfToken(csrf)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout.php', { method: 'POST' })
    } finally {
      setIsAuthenticated(false)
      setCsrfToken('')
    }
  }

  if (isChecking) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner" aria-hidden="true" />
        <p>Ověřuji přístup…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return <AdminDashboard onLogout={handleLogout} csrfToken={csrfToken} />
}
