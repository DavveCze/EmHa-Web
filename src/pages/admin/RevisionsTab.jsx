import { useState, useEffect, useCallback } from 'react'

export default function RevisionsTab({ onRestoreSuccess, csrfToken }) {
  const [revisions, setRevisions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadRevisions = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/revisions.php')
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
        const res = await fetch('/api/admin/revisions.php')
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
    if (!window.confirm(`Opravdu si přejete vrátit stav webu k verzi z: ${dateFormatted}? Současný stav bude před obnovou bezpečně zazálohován.`)) {
      return
    }

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
        alert('Verze byla úspěšně obnovena na web.')
        onRestoreSuccess(json.data)
        loadRevisions()
      } else {
        alert(json.error || 'Obnova verze selhala.')
      }
    } catch {
      alert('Chyba při obnově verze.')
    }
  }

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h3>Historie verzí a automatické zálohy (Rollback)</h3>
          <p>
            Před každým uložením systém vytvoří bezpečnostní snapshot. Kdykoliv můžete vrátit jakoukoliv předchozí verzi webu jedním kliknutím.
          </p>
        </div>
        <button type="button" className="button outline" onClick={loadRevisions} disabled={isLoading}>
          Obnovit seznam ↻
        </button>
      </div>

      {error && <div className="field-error" style={{ padding: '12px', background: '#ffebee', borderRadius: '6px' }}>{error}</div>}

      {revisions.length === 0 ? (
        <div className="admin-empty-state">
          <p>Zatím nebyly uloženy žádné předchozí verze (první záloha se vytvoří při vašem prvním uložení obsahu).</p>
        </div>
      ) : (
        <div className="revisions-list">
          {revisions.map((rev) => (
            <div key={rev.id} className="revision-row">
              <div>
                <strong>{rev.dateFormatted}</strong>
                <span className="revision-meta">
                  · Snapshot: {rev.id} ({Math.round(rev.size / 1024)} kB)
                </span>
              </div>
              <button
                type="button"
                className="button outline"
                style={{ padding: '8px 14px', fontSize: '13px' }}
                onClick={() => handleRestore(rev.id, rev.dateFormatted)}
              >
                Vrátit tuto verzi ↺
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
