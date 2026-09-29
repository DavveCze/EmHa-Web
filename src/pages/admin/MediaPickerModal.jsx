import { useState, useEffect } from 'react'

const DEFAULT_PROJECT_ASSETS = [
  { id: 'def-renovation', url: '/assets/renovation.jpg', alt: 'Nové měděné rozvody v bytě Ostrava', title: 'Rekonstrukce bytu' },
  { id: 'def-newbuild', url: '/assets/new-build.jpg', alt: 'Elektroinstalace rodinného domu v Moravskoslezském kraji', title: 'Novostavba RD' },
  { id: 'def-panel', url: '/assets/panel-detail.jpg', alt: 'Nový přehledně popsaný rozvaděč s jističi a chrániči', title: 'Bytový rozvaděč' },
  { id: 'def-switch', url: '/assets/switch-detail.jpg', alt: 'Kompletace designových vypínačů a zásuvek', title: 'Vypínače a zásuvky' },
  { id: 'def-electrician', url: '/assets/electrician.jpg', alt: 'Elektrikář při práci na instalaci', title: 'Elektrikář při práci' },
  { id: 'def-ceiling', url: '/assets/ceiling-worker.jpg', alt: 'Příprava elektroinstalace v podhledu', title: 'Osvětlení a podhledy' },
  { id: 'def-hero', url: '/assets/hero-v2.jpg', alt: 'Úvodní fotografie elektroinstalace', title: 'Hlavní úvodní foto' },
  { id: 'def-smarthome', url: '/assets/smart-home-v2.jpg', alt: 'Zabezpečovací systém Ajax a automatizace', title: 'Ajax a automatizace' },
]

export default function MediaPickerModal({ isOpen = true, onClose, onSelect, csrfToken }) {
  const [mediaList, setMediaList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const fetchMedia = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/media.php')
      const json = await res.json()
      if (res.ok && json.success) {
        setMediaList(json.media || [])
      } else {
        setError(json.error || 'Nepodařilo se načíst média.')
      }
    } catch {
      setError('Chyba komunikace se serverem.')
    } finally {
      setIsLoading(false)
    }
  }

  // Load automatically when opening modal
  useEffect(() => {
    if (!isOpen) return
    let ignore = false

    async function loadInitial() {
      try {
        const res = await fetch('/api/admin/media.php')
        const json = await res.json()
        if (!ignore && res.ok && json.success) {
          setMediaList(json.media || [])
        }
      } catch {
        // silent fallback, user can click Obnovit
      }
    }

    loadInitial()
    return () => {
      ignore = true
    }
  }, [isOpen])

  const handleOpen = () => {
    fetchMedia()
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', file.name.replace(/\.[^/.]+$/, ''))

    try {
      const res = await fetch('/api/admin/media.php', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        body: formData,
      })

      const json = await res.json()
      if (res.ok && json.success) {
        await fetchMedia()
        if (json.item) {
          onSelect(json.item.url, json.item.alt)
          onClose()
        }
      } else {
        setError(json.error || 'Nahrávání selhalo.')
      }
    } catch {
      setError('Chyba při odesílání souboru.')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>🖼️ Výběr fotografie z knihovny médií</h3>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Zavřít">
            ✕
          </button>
        </div>

        <div className="admin-modal-body">
          <div className="admin-picker-actions">
            <button
              type="button"
              className="button outline"
              onClick={handleOpen}
              disabled={isLoading}
            >
              Obnovit ↻
            </button>

            <label className="button primary admin-file-upload-btn">
              {isUploading ? 'Nahrávám…' : '⬆ Nahrát novou fotku'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleUpload}
                disabled={isUploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {error && <div className="admin-msg-box error" style={{ margin: '12px 0' }}>{error}</div>}

          {isLoading ? (
            <div className="admin-empty-state">
              <p>Načítám knihovnu médií…</p>
            </div>
          ) : (
            <>
              {mediaList.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--green)' }}>
                    📂 Nahrané vlastní fotografie ({mediaList.length}):
                  </h4>
                  <div className="admin-media-picker-grid">
                    {mediaList.map((item) => (
                      <div
                        key={item.id}
                        className="admin-media-picker-item"
                        onClick={() => {
                          onSelect(item.url, item.alt)
                          onClose()
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onSelect(item.url, item.alt)
                            onClose()
                          }
                        }}
                      >
                        <img src={item.url} alt={item.alt || item.title} loading="lazy" />
                        <div className="admin-media-picker-info">
                          <span className="admin-media-picker-name">{item.title || item.filename}</span>
                          <span className="admin-media-picker-meta">
                            {item.width ? `${item.width}×${item.height} px · ` : ''}
                            {Math.round((item.size || 0) / 1024)} kB
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--green)' }}>
                  🏛️ Připravené fotografie webu:
                </h4>
                {mediaList.length === 0 && (
                  <div className="admin-empty-state" style={{ marginBottom: '16px' }}>
                    <p>Zatím nebyly nahrány žádné vlastní soubory.</p>
                    <p className="muted">Můžete nahrát vlastní fotku tlačítkem výše, nebo rovnou vybrat ze stávajících fotografií webu:</p>
                  </div>
                )}
                <div className="admin-media-picker-grid">
                  {DEFAULT_PROJECT_ASSETS.map((item) => (
                    <div
                      key={item.id}
                      className="admin-media-picker-item"
                      onClick={() => {
                        onSelect(item.url, item.alt)
                        onClose()
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onSelect(item.url, item.alt)
                          onClose()
                        }
                      }}
                    >
                      <img src={item.url} alt={item.alt || item.title} loading="lazy" />
                      <div className="admin-media-picker-info">
                        <span className="admin-media-picker-name">{item.title}</span>
                        <span className="admin-media-picker-meta">Základní foto webu</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
