import { useState, useEffect, useRef } from 'react'
import { useNavigation } from '../context/navigation-core.js'

export default function Header() {
  const { currentPath, navigate } = useNavigation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem('emha-theme') === 'dark' || document.documentElement.classList.contains('dark')
    } catch {
      return false
    }
  })

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const dropdownRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try {
      localStorage.setItem('emha-theme', isDark ? 'dark' : 'light')
    } catch {
      // storage unavailable
    }
  }, [isDark])

  // Close menus on outside click or escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
      if (navRef.current && !e.target.closest('.site-header')) {
        setMenuOpen(false)
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (servicesOpen) {
          setServicesOpen(false)
        } else if (menuOpen) {
          setMenuOpen(false)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [servicesOpen, menuOpen])

  // Close menu on screen resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 760) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isServicePage = [
    '/elektroinstalace',
    '/rekonstrukce',
    '/zabezpeceni-a-automatizace',
    '/na-co-myslet-pri-rekonstrukcich',
    '/opravy-a-servis',
    '/data-a-slaboproud',
    '/zabezpeceni',
    '/automatizace',
  ].includes(currentPath)

  const handleLinkClick = (path) => {
    setMenuOpen(false)
    setServicesOpen(false)
    navigate(path)
  }

  return (
    <>
      <a className="skip" href="#main">
        Přejít na obsah
      </a>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} id="top">
        <a
          className="brand"
          href="/"
          aria-label="EmHa Elektro – úvodní stránka"
          onClick={(e) => {
            e.preventDefault()
            handleLinkClick('/')
          }}
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

        <button
          className="menu-toggle round"
          aria-expanded={menuOpen}
          aria-controls="navigation"
          aria-label={menuOpen ? 'Zavřít navigaci' : 'Otevřít navigaci'}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="navigation"
          ref={navRef}
          className={menuOpen ? 'is-open' : ''}
          aria-label="Hlavní navigace"
        >
          <a
            href="/"
            aria-current={currentPath === '/' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('/')
            }}
          >
            Domů
          </a>

          <div className="dropdown" ref={dropdownRef}>
            <button
              className="services-toggle"
              aria-expanded={servicesOpen}
              aria-controls="service-menu"
              aria-current={isServicePage ? 'page' : undefined}
              onClick={() => setServicesOpen((prev) => !prev)}
            >
              Služby <span>{servicesOpen ? '−' : '+'}</span>
            </button>
            <div
              id="service-menu"
              className="service-menu"
              hidden={!servicesOpen}
            >
              <a
                href="/elektroinstalace"
                aria-current={currentPath === '/elektroinstalace' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick('/elektroinstalace')
                }}
              >
                Elektroinstalace
              </a>
              <a
                href="/rekonstrukce"
                aria-current={currentPath === '/rekonstrukce' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick('/rekonstrukce')
                }}
              >
                Rekonstrukce
              </a>
              <a
                href="/zabezpeceni-a-automatizace"
                aria-current={currentPath === '/zabezpeceni-a-automatizace' || currentPath === '/zabezpeceni' || currentPath === '/automatizace' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick('/zabezpeceni-a-automatizace')
                }}
              >
                Zabezpečení a automatizace
              </a>
              <a
                href="/na-co-myslet-pri-rekonstrukcich"
                aria-current={currentPath === '/na-co-myslet-pri-rekonstrukcich' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick('/na-co-myslet-pri-rekonstrukcich')
                }}
              >
                Na co myslet při rekonstrukcích
              </a>
              <a
                href="/opravy-a-servis"
                aria-current={currentPath === '/opravy-a-servis' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick('/opravy-a-servis')
                }}
              >
                Opravy a servis
              </a>
              <a
                href="/data-a-slaboproud"
                aria-current={currentPath === '/data-a-slaboproud' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick('/data-a-slaboproud')
                }}
              >
                Data a slaboproud
              </a>
            </div>
          </div>

          <a
            href="/jak-pracujeme"
            aria-current={currentPath === '/jak-pracujeme' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('/jak-pracujeme')
            }}
          >
            Jak pracujeme
          </a>
          <a
            href="/reference"
            aria-current={currentPath === '/reference' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('/reference')
            }}
          >
            Reference
          </a>
          <a
            href="/kontakt"
            aria-current={currentPath === '/kontakt' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('/kontakt')
            }}
          >
            Kontakt
          </a>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle round"
            aria-label={isDark ? 'Přepnout světlý vzhled' : 'Přepnout tmavý vzhled'}
            aria-pressed={isDark}
            onClick={() => setIsDark((prev) => !prev)}
          >
            ◐
          </button>
          <a
            className="button"
            href="#poptavka"
            onClick={(e) => {
              e.preventDefault()
              navigate('#poptavka')
            }}
          >
            Probrat projekt <span>↗</span>
          </a>
        </div>
      </header>
    </>
  )
}
