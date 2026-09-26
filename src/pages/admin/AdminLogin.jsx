import { useState } from 'react'

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        onLoginSuccess(data.csrf)
      } else {
        setError(data.error || 'Přihlášení se nezdařilo.')
      }
    } catch {
      setError('Chyba komunikace se serverem. Zkontrolujte připojení.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="brand" style={{ justifyContent: 'center', marginBottom: '24px' }}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 42 34">
              <ellipse cx="21" cy="17" rx="21" ry="17" fill="currentColor" />
              <path
                d="M10 9h8v16h-8m1-8h7m6-8v16m0-16h8m-8 8h8m-8 8h8"
                fill="none"
                stroke="#d8be4b"
                strokeWidth="1.6"
              />
            </svg>
          </span>
          <span>
            <strong>EmHa Elektro</strong>
            <small>SPRÁVA WEBU (CMS)</small>
          </span>
        </div>

        <h2>Přihlášení do administrace</h2>
        <p className="admin-login-lead">
          Bezpečná správa textů, SEO, případových studií a klientských recenzí.
        </p>

        {error && (
          <div className="field-error" style={{ padding: '12px', background: '#ffebee', borderRadius: '6px', marginBottom: '16px' }} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <label htmlFor="admin-user">
            Uživatelské jméno
            <input
              id="admin-user"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <br></br>
          

          <label htmlFor="admin-pass">
            Heslo
            <br></br>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="button yellow" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
            {isLoading ? 'Ověřuji…' : 'Přihlásit se do správy ↗'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'underline' }}>
            ← Zpět na veřejný web EmHa Elektro
          </a>
        </div>
      </div>
    </div>
  )
}
