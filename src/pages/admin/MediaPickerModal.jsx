import { useState } from 'react'

export default function MediaPickerModal({ isOpen, onClose, onSelect, csrfToken }) {
  const [mediaList, setMediaList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const loadMedia = async () => {
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

  // Load when opening
  const handleOpen = () => {
    loadMedia()
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
        await loadMedia()
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
          <h3>Knihovna fotografií a médií</h3>
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
            <p className="admin-empty-state">Načítám knihovnu médií…</p>
          ) : mediaList.length === 0 ? (
            <div className="admin-empty-state">
              <p>Zatím nebyly nahrány žádné obrázky.</p>
              <p className="muted">Nahrajte první fotografii pomocí tlačítka výše.</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  )
}
