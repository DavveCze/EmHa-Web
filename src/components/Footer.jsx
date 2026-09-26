import { useNavigation } from '../context/navigation-core.js'

export default function Footer() {
  const { navigate } = useNavigation()

  const handleLinkClick = (e, path) => {
    e.preventDefault()
    navigate(path)
  }

  const handleScrollTop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname)
    }
  }

  const handleOpenCookieSettings = (e) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('emha:open-cookie-settings'))
    }
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a
            className="brand"
            href="/"
            aria-label="EmHa Elektro – úvodní stránka"
            onClick={(e) => handleLinkClick(e, '/')}
          >
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
              <small>ELEKTROINSTALACE</small>
            </span>
          </a>
          <p>
            Elektroinstalace pro váš <em>domov.</em>
          </p>
          <a href="#top" onClick={handleScrollTop}>
            Zpět nahoru ↗
          </a>
        </div>
        <div className="footer-bottom">
          <div className="footer-operator" style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            <span><strong>Martin Hořčica</strong> · EmHa Elektro</span>
            <span> · IČO: 14216132 (neplátce DPH)</span>
            <span> · <a href="tel:+420731833605" style={{ color: 'inherit', textDecoration: 'underline' }}>+420 731 833 605</a></span>
            <div><small>Fyzická osoba zapsaná v živnostenském rejstříku (ŽÚ Ostrava). Sídlo: Tlapákova 1242/15, Ostrava.</small></div>
          </div>
          <nav aria-label="Navigace v zápatí">
            <a href="/elektroinstalace" onClick={(e) => handleLinkClick(e, '/elektroinstalace')}>
              Elektroinstalace
            </a>
            <a href="/rekonstrukce" onClick={(e) => handleLinkClick(e, '/rekonstrukce')}>
              Rekonstrukce
            </a>
            <a href="/zabezpeceni-a-automatizace" onClick={(e) => handleLinkClick(e, '/zabezpeceni-a-automatizace')}>
              Zabezpečení a automatizace
            </a>
            <a href="/na-co-myslet-pri-rekonstrukcich" onClick={(e) => handleLinkClick(e, '/na-co-myslet-pri-rekonstrukcich')}>
              Na co myslet při rekonstrukcích
            </a>
            <button
              type="button"
              className="footer-cookie-btn"
              onClick={handleOpenCookieSettings}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                font: 'inherit',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Nastavení cookies
            </button>
          </nav>
          <span>© 2026 EmHa Elektro</span>
        </div>
      </div>
    </footer>
  )
}
