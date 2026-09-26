import { useState, useEffect } from 'react'
import BusinessTab from './BusinessTab.jsx'
import SeoTab from './SeoTab.jsx'
import CaseStudiesTab from './CaseStudiesTab.jsx'
import ReviewsTab from './ReviewsTab.jsx'
import MediaTab from './MediaTab.jsx'
import RevisionsTab from './RevisionsTab.jsx'

export default function AdminDashboard({ onLogout, csrfToken }) {
  const [activeTab, setActiveTab] = useState('business')
  const [data, setData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    let ignore = false
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/content.php')
        const json = await res.json()
        if (!ignore) {
          if (res.ok && json.success) {
            setData(json.data)
            setOriginalData(JSON.parse(JSON.stringify(json.data)))
          } else {
            setStatusMessage({ type: 'error', text: json.error || 'Nepodařilo se načíst data.' })
          }
          setIsLoading(false)
        }
      } catch {
        if (!ignore) {
          setStatusMessage({ type: 'error', text: 'Chyba při komunikaci se serverem.' })
          setIsLoading(false)
        }
      }
    }
    fetchData()
    return () => {
      ignore = true
    }
  }, [])

  const hasUnsavedChanges = data && originalData && JSON.stringify(data) !== JSON.stringify(originalData)

  const handleSave = async () => {
    setIsSaving(true)
    setStatusMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/admin/content.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        setOriginalData(JSON.parse(JSON.stringify(json.data)))
        setData(json.data)
        setStatusMessage({ type: 'success', text: 'Změny byly úspěšně a bezpečně publikovány na web.' })
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000)
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Chyba při ukládání.' })
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Chyba sítě při ukládání na server.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    if (window.confirm('Opravdu chcete zahodit veškeré neuložené úpravy?')) {
      setData(JSON.parse(JSON.stringify(originalData)))
      setStatusMessage({ type: '', text: '' })
    }
  }

  const handleRestoreSuccess = (newData) => {
    setData(newData)
    setOriginalData(JSON.parse(JSON.stringify(newData)))
    setStatusMessage({ type: 'success', text: 'Verze byla úspěšně obnovena na web.' })
  }

  if (isLoading || !data) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner" aria-hidden="true" />
        <p>Načítám administraci EmHa CMS…</p>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      {/* Top Bar */}
      <header className="admin-header">
        <div className="admin-header-brand">
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
          <div>
            <strong>EmHa Elektro</strong>
            <small>SPRÁVA OBSAHU (CMS)</small>
          </div>
        </div>

        <div className="admin-header-actions">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-view-site-link">
            Zobrazit web ↗
          </a>
          <button type="button" className="button outline" onClick={onLogout} style={{ padding: '8px 14px', fontSize: '13px' }}>
            Odhlásit se
          </button>
        </div>
      </header>

      {/* Floating Unsaved Changes Notification (Loss Aversion & Behavioral Feedback) */}
      {hasUnsavedChanges && (
        <div className="admin-floating-bar" role="status">
          <div className="floating-bar-info">
            <span className="floating-dot" />
            <strong>Máte neuložené úpravy</strong>
            <small>Změny se na veřejném webu projeví až po kliknutí na tlačítko Uložit.</small>
          </div>
          <div className="floating-bar-btns">
            <button type="button" className="button outline" onClick={handleDiscard} disabled={isSaving}>
              Zahodit
            </button>
            <button type="button" className="button yellow" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Ukládám…' : 'Publikovat na web ↗'}
            </button>
          </div>
        </div>
      )}

      {statusMessage.text && (
        <div
          className={`admin-status-toast ${statusMessage.type}`}
          role="alert"
        >
          {statusMessage.text}
        </div>
      )}

      {/* Gestalt Tabs Navigation */}
      <nav className="admin-tabs" aria-label="Záložky správy">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'business' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('business')}
        >
          🏢 Kontakty a firma
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'seo' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('seo')}
        >
          🔍 SEO & Vyhledávače
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'cases' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('cases')}
        >
          🏗️ Případové studie ({data.caseStudies?.length || 0})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'reviews' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Recenze ({data.reviews?.length || 0})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'media' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          📸 Knihovna médií
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'revisions' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('revisions')}
        >
          🕒 Historie a zálohy
        </button>
      </nav>

      {/* Main Tab Panes */}
      <main className="admin-content-main">
        {activeTab === 'business' && (
          <BusinessTab
            data={data.business || {}}
            onChange={(b) => setData({ ...data, business: b })}
          />
        )}
        {activeTab === 'seo' && (
          <SeoTab
            data={data.seo || {}}
            onChange={(s) => setData({ ...data, seo: s })}
          />
        )}
        {activeTab === 'cases' && (
          <CaseStudiesTab
            data={data.caseStudies || []}
            onChange={(c) => setData({ ...data, caseStudies: c })}
            csrfToken={csrfToken}
          />
        )}
        {activeTab === 'reviews' && (
          <ReviewsTab
            data={data.reviews || []}
            onChange={(r) => setData({ ...data, reviews: r })}
          />
        )}
        {activeTab === 'media' && (
          <MediaTab
            csrfToken={csrfToken}
          />
        )}
        {activeTab === 'revisions' && (
          <RevisionsTab
            csrfToken={csrfToken}
            onRestoreSuccess={handleRestoreSuccess}
          />
        )}
      </main>
    </div>
  )
}
