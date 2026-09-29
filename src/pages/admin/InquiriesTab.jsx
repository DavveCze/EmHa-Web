import { useState, useEffect, useCallback } from 'react'

const STATUS_LABELS = {
  new: { label: 'Nová', bg: '#dfbf55', color: '#133528' },
  in_progress: { label: 'V řešení', bg: '#2563eb', color: '#ffffff' },
  quoted: { label: 'Naceněno', bg: '#7c3aed', color: '#ffffff' },
  completed: { label: 'Dokončeno', bg: '#16a34a', color: '#ffffff' },
  archived: { label: 'Archivováno', bg: '#64748b', color: '#ffffff' },
}

export default function InquiriesTab({ csrfToken, onCountChange }) {
  const [inquiries, setInquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [noteInputs, setNoteInputs] = useState({})
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' })
  const [expandedId, setExpandedId] = useState(null)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  const reload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const res = await fetch('/api/admin/inquiries.php')
        const json = await res.json()
        if (!ignore) {
          if (res.ok && json.success) {
            setInquiries(json.data || [])
            if (onCountChange) {
              onCountChange(json.newCount || 0)
            }
          } else {
            setActionMessage({ type: 'error', text: json.error || 'Chyba při načítání poptávek.' })
          }
          setIsLoading(false)
        }
      } catch {
        if (!ignore) {
          setActionMessage({ type: 'error', text: 'Nepodařilo se připojit k serveru pro načtení poptávek.' })
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [reloadTrigger, onCountChange])

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/inquiries.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ id, status: newStatus }),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        )
        setActionMessage({ type: 'success', text: `Stav poptávky změněn na „${STATUS_LABELS[newStatus]?.label || newStatus}“.` })
        setTimeout(() => setActionMessage({ type: '', text: '' }), 4000)
        reload()
      } else {
        setActionMessage({ type: 'error', text: json.error || 'Změna stavu selhala.' })
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Chyba sítě při změně stavu.' })
    }
  }

  const handleAddNote = async (id) => {
    const text = noteInputs[id]?.trim()
    if (!text) return

    try {
      const res = await fetch('/api/admin/inquiries.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ id, addNote: text }),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? json.inquiry : item))
        )
        setNoteInputs((prev) => ({ ...prev, [id]: '' }))
        setActionMessage({ type: 'success', text: 'Interní poznámka byla uložena.' })
        setTimeout(() => setActionMessage({ type: '', text: '' }), 4000)
      } else {
        setActionMessage({ type: 'error', text: json.error || 'Uložení poznámky selhalo.' })
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Chyba sítě při ukládání poznámky.' })
    }
  }

  const handleDelete = async (id, surname) => {
    if (!window.confirm(`Opravdu chcete smazat poptávku od zákazníka „${surname || id}“?`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/inquiries.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id))
        setActionMessage({ type: 'success', text: 'Poptávka byla trvale smazána.' })
        setTimeout(() => setActionMessage({ type: '', text: '' }), 4000)
      } else {
        setActionMessage({ type: 'error', text: json.error || 'Smazání selhalo.' })
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Chyba sítě při mazání poptávky.' })
    }
  }

  const filteredInquiries = inquiries.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const inSurname = (item.surname || '').toLowerCase().includes(q)
      const inContact = (item.contact || '').toLowerCase().includes(q)
      const inMessage = (item.message || '').toLowerCase().includes(q)
      const inService = (item.serviceLabel || item.service || '').toLowerCase().includes(q)
      return inSurname || inContact || inMessage || inService
    }
    return true
  })

  const newCount = inquiries.filter((i) => (i.status || 'new') === 'new').length

  const formatDate = (isoStr) => {
    if (!isoStr) return ''
    try {
      const d = new Date(isoStr)
      return d.toLocaleString('cs-CZ', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoStr
    }
  }

  if (isLoading) {
    return (
      <div className="admin-tab-loading">
        <div className="admin-spinner" aria-hidden="true" />
        <p>Načítám evidenci poptávek…</p>
      </div>
    )
  }

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h3>📥 Evidence a správa poptávek (CRM)</h3>
          <p>
            Poptávky z webového formuláře jsou bezpečně evidovány zde v administraci. Máte kompletní
            historii kontaktů, možnost měnit stav zakázky, připisovat interní poznámky a exportovat
            data do Excelu.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="/api/admin/inquiries.php?export=csv"
            className="button outline"
            style={{ padding: '8px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            download
          >
            📊 Exportovat do Excelu (CSV)
          </a>
          <button
            type="button"
            className="button outline"
            style={{ padding: '8px 14px', fontSize: '13px' }}
            onClick={reload}
          >
            Obnovit ↻
          </button>
        </div>
      </div>

      {actionMessage.text && (
        <div className={`admin-status-toast ${actionMessage.type}`} role="alert" style={{ marginBottom: '20px' }}>
          {actionMessage.text}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="admin-filter-bar"
        style={{
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '24px',
          background: 'var(--bg)',
          padding: '14px 18px',
          borderRadius: '8px',
          border: '1px solid var(--line)',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className={`admin-filter-chip ${filterStatus === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Všechny ({inquiries.length})
          </button>
          <button
            type="button"
            className={`admin-filter-chip ${filterStatus === 'new' ? 'is-active' : ''}`}
            onClick={() => setFilterStatus('new')}
            style={newCount > 0 ? { borderColor: 'var(--yellow)', color: 'var(--green)', fontWeight: 'bold' } : {}}
          >
            Nové ({newCount})
          </button>
          <button
            type="button"
            className={`admin-filter-chip ${filterStatus === 'in_progress' ? 'is-active' : ''}`}
            onClick={() => setFilterStatus('in_progress')}
          >
            V řešení ({inquiries.filter((i) => i.status === 'in_progress').length})
          </button>
          <button
            type="button"
            className={`admin-filter-chip ${filterStatus === 'quoted' ? 'is-active' : ''}`}
            onClick={() => setFilterStatus('quoted')}
          >
            Naceněno ({inquiries.filter((i) => i.status === 'quoted').length})
          </button>
          <button
            type="button"
            className={`admin-filter-chip ${filterStatus === 'completed' ? 'is-active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Dokončeno ({inquiries.filter((i) => i.status === 'completed').length})
          </button>
          <button
            type="button"
            className={`admin-filter-chip ${filterStatus === 'archived' ? 'is-active' : ''}`}
            onClick={() => setFilterStatus('archived')}
          >
            Archiv ({inquiries.filter((i) => i.status === 'archived').length})
          </button>
        </div>

        <div style={{ marginLeft: 'auto', minWidth: '240px', flex: '1 1 280px' }}>
          <input
            type="search"
            placeholder="🔍 Hledat podle jména, telefonu, textu…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 14px',
              fontSize: '14px',
              borderRadius: '6px',
              background: 'var(--input)',
              border: '1px solid #b2bcaf',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      {/* Inquiry List */}
      {filteredInquiries.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'var(--bg)',
            borderRadius: '8px',
            border: '1px dashed var(--line)',
          }}
        >
          <p style={{ fontSize: '1.1rem', margin: '0 0 6px 0', color: 'var(--text)', fontWeight: 500 }}>
            {searchQuery || filterStatus !== 'all' ? 'Nebyly nalezeny žádné poptávky odpovídající zadanému filtru.' : 'Zatím zde nejsou žádné zaznamenané poptávky.'}
          </p>
          <small style={{ color: 'var(--muted)', fontSize: '13px' }}>
            Každá nově odeslaná poptávka z webového formuláře se automaticky zobrazí na tomto místě.
          </small>
        </div>
      ) : (
        <div className="inquiries-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredInquiries.map((inq) => {
            const isEmail = inq.contact && inq.contact.includes('@')
            const isPhone = inq.contact && /[0-9+ ]{9,}/.test(inq.contact)
            const cleanPhone = (inq.contact || '').replace(/[^\d+]/g, '')
            const isExpanded = expandedId === inq.id
            const st = STATUS_LABELS[inq.status] || STATUS_LABELS.new

            return (
              <article
                key={inq.id}
                className="inquiry-card"
                style={{
                  background: 'var(--bg)',
                  border: inq.status === 'new' ? '2px solid var(--yellow)' : '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '18px 22px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: st.bg,
                          color: st.color,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {st.label}
                      </span>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--text)' }}>
                        {inq.surname || 'Bez příjmení'}
                      </strong>
                      <span
                        style={{
                          fontSize: '13px',
                          background: 'var(--form)',
                          color: 'var(--text)',
                          border: '1px solid var(--line)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {inq.serviceLabel || inq.service}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                      Doručeno: {formatDate(inq.receivedAt)} · ID: <code>{inq.id}</code>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong>Stav:</strong>
                      <select
                        value={inq.status || 'new'}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '4px',
                          background: 'var(--input)',
                          color: 'var(--text)',
                          border: '1px solid #b2bcaf',
                          fontSize: '13px',
                        }}
                      >
                        <option value="new">Nová</option>
                        <option value="in_progress">V řešení</option>
                        <option value="quoted">Naceněno</option>
                        <option value="completed">Dokončeno</option>
                        <option value="archived">Archivováno</option>
                      </select>
                    </label>

                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() => handleDelete(inq.id, inq.surname)}
                      title="Smazat poptávku"
                    >
                      Smazat 🗑
                    </button>
                  </div>
                </div>

                {/* Contact and message details */}
                <div style={{ margin: '16px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
                      Kontakt:
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--green)' }}>
                        {inq.contact}
                      </span>
                      {isPhone && (
                        <a
                          href={`tel:${cleanPhone}`}
                          className="button yellow"
                          style={{ padding: '4px 10px', fontSize: '12px', textDecoration: 'none' }}
                        >
                          Zavolat 📞
                        </a>
                      )}
                      {isEmail && (
                        <a
                          href={`mailto:${inq.contact}?subject=Poptávka%20elektroinstalace%20–%20EmHa%20Elektro`}
                          className="button outline"
                          style={{ padding: '4px 10px', fontSize: '12px', textDecoration: 'none' }}
                        >
                          Napsat e-mail ✉
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
                      Zpráva od zákazníka:
                    </div>
                    <div
                      style={{
                        background: 'var(--form)',
                        border: '1px solid var(--line)',
                        padding: '12px 14px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: 'var(--text)',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {inq.message || '(Bez zprávy)'}
                    </div>
                  </div>
                </div>

                {/* Internal notes section */}
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--green)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{isExpanded ? '▼ Skrýt interní poznámky' : '▶ Interní poznámky'} ({inq.notes?.length || 0})</span>
                  </button>

                  {isExpanded && (
                    <div style={{ marginTop: '12px', padding: '14px', background: 'var(--form)', borderRadius: '6px', border: '1px solid var(--line)' }}>
                      {(!inq.notes || inq.notes.length === 0) ? (
                        <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 10px 0' }}>
                          Žádné interní poznámky k tomuto zákazníkovi.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                          {inq.notes.map((note) => (
                            <div
                              key={note.id}
                              style={{
                                fontSize: '13px',
                                background: 'var(--bg)',
                                border: '1px solid var(--line)',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                color: 'var(--text)',
                              }}
                            >
                              <span style={{ color: 'var(--muted)', fontSize: '12px', marginRight: '8px' }}>
                                {formatDate(note.timestamp)}:
                              </span>
                              <span>{note.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Přidat poznámku (např. termín prohlídky, dohodnuté body)…"
                          value={noteInputs[inq.id] || ''}
                          onChange={(e) => setNoteInputs({ ...noteInputs, [inq.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddNote(inq.id)
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            fontSize: '13px',
                            borderRadius: '4px',
                            background: 'var(--input)',
                            border: '1px solid #b2bcaf',
                            color: 'var(--text)',
                          }}
                        />
                        <button
                          type="button"
                          className="button yellow"
                          style={{ padding: '8px 14px', fontSize: '13px' }}
                          onClick={() => handleAddNote(inq.id)}
                        >
                          Uložit poznámku
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
