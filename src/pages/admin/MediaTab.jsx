import { useState, useEffect, useCallback } from 'react'

export default function MediaTab({ csrfToken }) {
  const [mediaList, setMediaList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })
  const [editingItem, setEditingItem] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const loadMedia = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/media.php')
      const json = await res.json()
      if (res.ok && json.success) {
        setMediaList(json.media || [])
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Nepodařilo se načíst média.' })
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Chyba při komunikaci se serverem.' })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    async function fetchInit() {
      try {
        const res = await fetch('/api/admin/media.php')
        const json = await res.json()
        if (!ignore) {
          if (res.ok && json.success) {
            setMediaList(json.media || [])
          } else {
            setStatusMessage({ type: 'error', text: json.error || 'Nepodařilo se načíst média.' })
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
    fetchInit()
    return () => {
      ignore = true
    }
  }, [])

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    setStatusMessage({ type: '', text: '' })

    let uploadedCount = 0
    let failedCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', file.name.replace(/\.[^/.]+$/, ''))
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''))

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
          uploadedCount++
        } else {
          failedCount++
        }
      } catch {
        failedCount++
      }
    }

    setIsUploading(false)
    await loadMedia()

    if (failedCount === 0) {
      setStatusMessage({
        type: 'success',
        text: `Úspěšně ${uploadedCount === 1 ? 'nahrán 1 obrázek' : `nahráno ${uploadedCount} obrázků`}.`,
      })
    } else {
      setStatusMessage({
        type: 'warning',
        text: `Nahráno ${uploadedCount}, selhalo ${failedCount} souborů.`,
      })
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Opravdu si přejete smazat fotografii „${title}“? Pokud je použita na webu, přestane se zobrazovat.`)) {
      return
    }

    try {
      const res = await fetch('/api/admin/media.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ id }),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        setStatusMessage({ type: 'success', text: 'Obrázek byl úspěšně smazán.' })
        setMediaList((prev) => prev.filter((m) => m.id !== id))
        if (editingItem?.id === id) {
          setEditingItem(null)
        }
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Smazání selhalo.' })
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Chyba při mazání obrázku.' })
    }
  }

  const handleSaveMetadata = async (e) => {
    e.preventDefault()
    if (!editingItem) return

    try {
      const res = await fetch('/api/admin/media.php', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          id: editingItem.id,
          alt: editingItem.alt,
          title: editingItem.title,
        }),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        setStatusMessage({ type: 'success', text: 'Popisky obrázku byly uloženy.' })
        setMediaList((prev) =>
          prev.map((m) => (m.id === editingItem.id ? { ...m, alt: editingItem.alt, title: editingItem.title } : m))
        )
        setEditingItem(null)
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Uložení selhalo.' })
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Chyba při ukládání popisků.' })
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert(`URL zkopírována do schránky:\n${text}`)
  }

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h3>Knihovna fotografií a médií (CRUD)</h3>
          <p>
            Nahrávejte fotografie z realizací, spravujte jejich alternativní texty (ALT) pro vyhledávače a přístupnost.
          </p>
        </div>

        <label className="button primary admin-file-upload-btn">
          {isUploading ? 'Nahrávám…' : '⬆ Nahrát fotografie'}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={(e) => handleFileUpload(e.target.files)}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {statusMessage.text && (
        <div className={`admin-msg-box ${statusMessage.type}`} style={{ marginBottom: '20px' }}>
          {statusMessage.text}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        className={`admin-dropzone ${isDragOver ? 'is-dragover' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
          handleFileUpload(e.dataTransfer.files)
        }}
      >
        <span className="admin-dropzone-icon" aria-hidden="true">📸</span>
        <p className="admin-dropzone-title">Přetáhněte fotografie sem nebo klikněte na tlačítko nahoře</p>
        <p className="admin-dropzone-hint">
          Podporované formáty: WebP, JPEG, PNG, SVG (max. 8 MB na soubor)
        </p>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="admin-loading-screen" style={{ minHeight: '200px' }}>
          <div className="admin-spinner" aria-hidden="true" />
          <p>Načítám média…</p>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="admin-empty-state">
          <p>V knihovně zatím nejsou žádné nahrané obrázky.</p>
          <p className="muted">Přetáhněte sem fotografie ze svých zakázek pro použití v případových studiích.</p>
        </div>
      ) : (
        <div className="admin-media-grid">
          {mediaList.map((item) => (
            <div key={item.id} className="admin-media-card">
              <div className="admin-media-thumb-wrap">
                <img src={item.url} alt={item.alt || item.title} loading="lazy" />
                <div className="admin-media-badge-dims">
                  {item.width ? `${item.width}×${item.height}` : 'SVG'}
                </div>
              </div>

              <div className="admin-media-card-body">
                <h4 className="admin-media-card-title" title={item.title}>
                  {item.title || item.filename}
                </h4>

                <p className="admin-media-alt-preview">
                  <strong>ALT:</strong> {item.alt ? `„${item.alt}“` : <em className="muted">Chybí ALT popisek</em>}
                </p>

                <div className="admin-media-card-meta">
                  <span>{Math.round((item.size || 0) / 1024)} kB</span>
                  <span>{new Date(item.uploadedAt * 1000).toLocaleDateString('cs-CZ')}</span>
                </div>

                <div className="admin-media-card-actions">
                  <button
                    type="button"
                    className="button outline small"
                    onClick={() => setEditingItem({ ...item })}
                  >
                    ✏️ Upravit popisek
                  </button>

                  <button
                    type="button"
                    className="button outline small"
                    onClick={() => copyToClipboard(item.url)}
                    title="Zkopírovat URL adresu"
                  >
                    🔗 URL
                  </button>

                  <button
                    type="button"
                    className="button outline small danger"
                    onClick={() => handleDelete(item.id, item.title || item.filename)}
                    title="Smazat soubor"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingItem && (
        <div className="admin-modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Upravit popisek fotografie</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setEditingItem(null)}
                aria-label="Zavřít"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMetadata} className="admin-modal-body">
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <img
                  src={editingItem.url}
                  alt={editingItem.alt}
                  style={{ maxHeight: '180px', borderRadius: '8px', objectFit: 'cover' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-title">Název / Titulek</label>
                <input
                  id="edit-title"
                  type="text"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-alt">Alternativní text (ALT)</label>
                <input
                  id="edit-alt"
                  type="text"
                  value={editingItem.alt || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, alt: e.target.value })}
                  placeholder="Popište přesně, co je na fotografii (např. Rozvaděč Hager s popsanými jističi)"
                />
                <span className="field-hint">
                  Důležité pro vyhledávače (Google SEO) a čtečky obrazovky pro nevidomé uživatele.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="button outline" onClick={() => setEditingItem(null)}>
                  Zrušit
                </button>
                <button type="submit" className="button primary">
                  Uložit změny
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
