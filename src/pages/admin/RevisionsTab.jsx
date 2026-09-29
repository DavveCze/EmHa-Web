import { useState, useEffect, useCallback } from 'react'

export default function RevisionsTab({ onRestoreSuccess, csrfToken }) {
  const [revisions, setRevisions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [restoringId, setRestoringId] = useState(null)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })
  const [error, setError] = useState('')

  const loadRevisions = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/revisions.php?t=${Date.now()}`, {
        cache: 'no-store',
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setRevisions(json.revisions || [])
      } else {
        setError(json.error || 'Nepodařilo se načíst historii verzí.')
      }
    } catch {
      setError('Chyba při komunikaci se serverem.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    async function fetchRevisions() {
      try {
        const res = await fetch(`/api/admin/revisions.php?t=${Date.now()}`, {
          cache: 'no-store',
        })
        const json = await res.json()
        if (!ignore) {
          if (res.ok && json.success) {
            setRevisions(json.revisions || [])
          } else {
            setError(json.error || 'Nepodařilo se načíst historii verzí.')
          }
          setIsLoading(false)
        }
      } catch {
        if (!ignore) {
          setError('Chyba při komunikaci se serverem.')
          setIsLoading(false)
        }
      }
    }
    fetchRevisions()
    return () => {
      ignore = true
    }
  }, [])

  const handleRestore = async (revId, dateFormatted) => {
    if (!window.confirm(`Opravdu si přejete vrátit stav webu k verzi z: ${dateFormatted}? Současný stav bude před obnovou bezpečně zazálohován jako nový snapshot.`)) {
      return
    }

    setRestoringId(revId)
    setStatusMessage({ type: '', text: '' })
    setError('')

    try {
      const res = await fetch('/api/admin/revisions.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ revisionId: revId }),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        setStatusMessage({
          type: 'success',
          text: `✓ Verze ze dne ${dateFormatted} byla úspěšně obnovena na web a předchozí stav byl bezpečně zazálohován.`,
        })
        if (json.revisions) {
          setRevisions(json.revisions)
        } else {
          loadRevisions()
        }
        if (onRestoreSuccess) {
          onRestoreSuccess(json.data)
        }
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 6000)
      } else {
        setError(json.error || 'Obnova verze selhala.')
      }
    } catch {
      setError('Chyba při obnově verze (chyba sítě).')
    } finally {
      setRestoringId(null)
    }
  }

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h3>Historie verzí a automatické zálohy (Rollback)</h3>
          <p>
            Před každým uložením i každou obnovou verze systém vytvoří bezpečnostní snapshot. Kdykoliv můžete vrátit jakoukoliv předchozí verzi webu jedním kliknutím.
          </p>
        </div>
        <button type="button" className="button outline" onClick={loadRevisions} disabled={isLoading || restoringId !== null}>
          {isLoading ? 'Načítám… ↻' : 'Obnovit seznam ↻'}
        </button>
      </div>

      {statusMessage.text && (
        <div className={`admin-status-toast ${statusMessage.type}`} role="status" style={{ marginBottom: '20px' }}>
          {statusMessage.text}
        </div>
      )}

      {error && (
        <div className="admin-status-toast error" role="alert" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {revisions.length === 0 ? (
        <div className="admin-empty-state">
          <p>Zatím nebyly uloženy žádné předchozí verze (první záloha se vytvoří při vašem prvním uložení obsahu).</p>
        </div>
      ) : (
        <div className="revisions-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {revisions.map((rev, idx) => (
            <div
              key={rev.id}
              className="revision-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '14px 18px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>
                    {rev.dateFormatted}
                  </strong>
                  {idx === 0 && (
                    <span
                      style={{
                        background: 'var(--sage)',
                        color: 'var(--green)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Nejnovější snapshot
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                  Soubor: <code>{rev.id}</code> · Velikost: {Math.round(rev.size / 1024)} kB
                </div>
              </div>

              <button
                type="button"
                className="button outline"
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={() => handleRestore(rev.id, rev.dateFormatted)}
                disabled={restoringId !== null}
              >
                {restoringId === rev.id ? 'Obnovuji… ⏳' : 'Vrátit tuto verzi ↺'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
