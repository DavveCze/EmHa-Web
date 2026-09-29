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
        <div className="brand" style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <picture>
            <source srcSet="/assets/logo.svg" type="image/svg+xml" />
            <source srcSet="/assets/logo.webp" type="image/webp" />
            <img
              src="/assets/logo.svg"
              alt="EmHa Elektro"
              className="brand-logo"
              width="224"
              height="48"
            />
          </picture>
          <small style={{ display: 'block', textAlign: 'center', marginTop: '6px', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--muted)' }}>SPRÁVA WEBU (CMS)</small>
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
