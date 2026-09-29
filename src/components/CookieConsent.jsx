import { useState, useEffect, useRef } from 'react'
import { initAnalytics } from '../config/analytics.js'

const CONSENT_STORAGE_KEY = 'emha_cookie_consent_v1'

function getInitialConsent() {
  if (typeof window === 'undefined') {
    return { hasResolved: false, showBanner: true, analytics: false }
  }
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        hasResolved: true,
        showBanner: false,
        analytics: Boolean(parsed.analytics),
      }
    }
  } catch {
    // In case of restricted storage, show banner
  }
  return { hasResolved: false, showBanner: true, analytics: false }
}

export default function CookieConsent() {
  const [consent, setConsent] = useState(getInitialConsent)
  const [showModal, setShowModal] = useState(false)
  const [analyticsAllowed, setAnalyticsAllowed] = useState(() => consent.analytics)
  const modalRef = useRef(null)
  const lastActiveElementRef = useRef(null)

  useEffect(() => {
    if (consent.analytics) {
      initAnalytics()
    }

    const handleOpenSettings = () => {
      setShowModal(true)
    }

    window.addEventListener('emha:open-cookie-settings', handleOpenSettings)
    return () => {
      window.removeEventListener('emha:open-cookie-settings', handleOpenSettings)
    }
  }, [consent.analytics])

  useEffect(() => {
    if (showModal) {
      lastActiveElementRef.current = document.activeElement
      const timer = setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        firstFocusable?.focus()
      }, 50)

      const handleModalKeyDown = (e) => {
        if (e.key === 'Escape') {
          setShowModal(false)
          if (!consent.hasResolved) {
            setConsent((prev) => ({ ...prev, showBanner: true }))
          }
        }
        if (e.key === 'Tab' && modalRef.current) {
          const focusables = modalRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]')
          if (focusables.length === 0) return
          const first = focusables[0]
          const last = focusables[focusables.length - 1]
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }

      window.addEventListener('keydown', handleModalKeyDown)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('keydown', handleModalKeyDown)
        if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === 'function') {
          lastActiveElementRef.current.focus()
        }
      }
    }
  }, [showModal, consent.hasResolved])

  const saveConsent = (allowAnalytics) => {
    const consentData = {
      essential: true,
      analytics: Boolean(allowAnalytics),
      timestamp: new Date().toISOString(),
      version: 1,
    }

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData))
    } catch {
      // Storage unavailable fallback
    }

    setAnalyticsAllowed(Boolean(allowAnalytics))
    setConsent({
      hasResolved: true,
      showBanner: false,
      analytics: Boolean(allowAnalytics),
    })
    setShowModal(false)

    if (allowAnalytics) {
      initAnalytics()
    }
  }

  const handleAcceptAll = () => {
    saveConsent(true)
  }

  const handleRejectAll = () => {
    saveConsent(false)
  }

  const handleSavePreferences = () => {
    saveConsent(analyticsAllowed)
  }

  // If already resolved and modal not open, render nothing
  if (!consent.showBanner && !showModal) {
    return null
  }

  return (
    <>
      {/* 1. Spodní Cookie Banner */}
      {consent.showBanner && !showModal && (
        <aside
          className="cookie-banner"
          role="region"
          aria-label="Nastavení souhlasu s cookies"
          aria-live="polite"
        >
          <div className="container cookie-banner-content">
            <div className="cookie-banner-text">
              <strong>Nastavení ochrany soukromí a cookies</strong>
              <p>
                Tento web používá nezbytné technické cookies pro správné fungování stránek a poptávkových formulářů.
                S vaším svolením využíváme také anonymní analytické cookies (Google Analytics a Microsoft Clarity)
                pro vyhodnocování návštěvnosti a zkvalitňování našich řemeslných služeb. Více v{' '}
                <a
                  href="/zasady-ochrany-osobnich-udaju"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  Zásadách ochrany osobních údajů
                </a>.
              </p>
            </div>
            <div className="cookie-banner-actions">
              <button
                type="button"
                className="button yellow cookie-btn"
                onClick={handleAcceptAll}
              >
                Přijmout vše
              </button>
              <button
                type="button"
                className="button outline cookie-btn"
                onClick={handleRejectAll}
              >
                Pouze nezbytné
              </button>
              <button
                type="button"
                className="cookie-link-btn"
                onClick={() => setShowModal(true)}
              >
                Přizpůsobit <span>⚙</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Modální dialog pro detailní nastavení preferencí */}
      {showModal && (
        <div
          className="cookie-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
        >
          <div className="cookie-modal-card" ref={modalRef}>
            <div className="cookie-modal-header">
              <h2 id="cookie-modal-title">Předvolby souborů cookie</h2>
              <button
                type="button"
                className="cookie-modal-close"
                aria-label="Zavřít okno nastavení"
                onClick={() => {
                  setShowModal(false)
                  if (!consent.hasResolved) {
                    setConsent((prev) => ({ ...prev, showBanner: true }))
                  }
                }}
              >
                ✕
              </button>
            </div>

            <p className="cookie-modal-desc">
              Respektujeme vaše soukromí. Můžete si zvolit, které kategorie cookies nám dovolíte používat.
              Své rozhodnutí můžete kdykoliv změnit pomocí odkazu „Nastavení cookies“ v zápatí webu.
            </p>

            <div className="cookie-category-list">
              {/* Technické / Nezbytné cookies */}
              <div className="cookie-category-item">
                <div className="cookie-category-info">
                  <div className="cookie-category-title-row">
                    <strong>Nezbytné technické cookies</strong>
                    <span className="cookie-tag-required">Vždy aktivní</span>
                  </div>
                  <p>
                    Tyto soubory jsou nutné pro základní chod webu, bezpečnost, navigaci mezi stránkami a
                    spolehlivé odesílání poptávkových formulářů. Nelze je deaktivovat.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  aria-label="Nezbytné cookies jsou vždy aktivní"
                  className="cookie-checkbox"
                />
              </div>

              {/* Analytické cookies */}
              <div className="cookie-category-item">
                <div className="cookie-category-info">
                  <div className="cookie-category-title-row">
                    <strong>Analytické cookies (Google Analytics & MS Clarity)</strong>
                  </div>
                  <p>
                    Pomáhají nám anonymně měřit návštěvnost stránek, sledovat nefunkční prvky a zjišťovat,
                    které informace o elektroinstalacích vás nejvíce zajímají. Data nikdy neprodáváme třetím stranám
                    ani nepoužíváme pro cílenou reklamu.
                  </p>
                </div>
                <label className="cookie-toggle-label">
                  <input
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="cookie-checkbox"
                  />
                  <span className="sr-only">Povolit analytické cookies</span>
                </label>
              </div>
            </div>

            <div className="cookie-modal-actions">
              <button
                type="button"
                className="button yellow"
                onClick={handleAcceptAll}
              >
                Povolit vše
              </button>
              <button
                type="button"
                className="button outline"
                onClick={handleSavePreferences}
              >
                Uložit výběr
              </button>
              <button
                type="button"
                className="cookie-text-btn"
                onClick={handleRejectAll}
              >
                Odmítnout volitelné
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
