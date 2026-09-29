import { useNavigation } from '../context/navigation-core.js'
import { useContent } from '../context/content-core.js'
import defaultContent from '../data/defaultContent.json'

export default function Footer() {
  const { navigate } = useNavigation()
  const { content } = useContent()
  const b = content?.business || defaultContent.business

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
            <picture>
              <source srcSet="/assets/logo-light.svg" type="image/svg+xml" />
              <source srcSet="/assets/logo-light.webp" type="image/webp" />
              <img
                src="/assets/logo-light.svg"
                alt="EmHa Elektro"
                className="brand-logo"
                width="224"
                height="48"
              />
            </picture>
          </a>
          <p>
            Elektroinstalace pro váš <em>domov.</em>
          </p>
          <a href="#top" onClick={handleScrollTop}>
            Zpět nahoru ↗
          </a>
        </div>
        <div className="footer-bottom">
          <nav className="footer-nav" aria-label="Navigace v zápatí">
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
            <a href="/zasady-ochrany-osobnich-udaju" onClick={(e) => handleLinkClick(e, '/zasady-ochrany-osobnich-udaju')}>
              Ochrana osobních údajů
            </a>
            <button
              type="button"
              className="footer-cookie-btn"
              onClick={handleOpenCookieSettings}
            >
              Nastavení cookies
            </button>
          </nav>

          <div className="footer-meta-row">
            <div className="footer-operator">
              <span><strong>{b.legalName || 'Martin Hořčica'}</strong> · {b.name || 'EmHa Elektro'}</span>
              <span> · IČO: {b.taxID || '14216132'} ({b.isVatPayer ? 'Plátce DPH' : 'neplátce DPH'})</span>
              <span> · <a href={`tel:${b.phoneRaw || '+420731833605'}`}>{b.phone || '+420 731 833 605'}</a></span>
              <div><small>{b.registration || 'Fyzická osoba zapsaná v živnostenském rejstříku (ŽÚ Ostrava).'}{b.street ? ` Sídlo: ${b.street}, ${b.city || 'Ostrava'}.` : ''}</small></div>
            </div>
            <span className="footer-copyright">© 2026 EmHa Elektro</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
