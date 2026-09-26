export default function ReviewsTab({ data, onChange }) {
  const handleItemChange = (idx, field, val) => {
    const next = [...data]
    next[idx] = {
      ...next[idx],
      [field]: val,
    }
    onChange(next)
  }

  const handleToggleActive = (idx) => {
    const next = [...data]
    next[idx] = {
      ...next[idx],
      active: !next[idx].active,
    }
    onChange(next)
  }

  const handleDelete = (idx) => {
    if (window.confirm('Opravdu chcete tuto recenzi smazat?')) {
      const next = data.filter((_, i) => i !== idx)
      onChange(next)
    }
  }

  const handleAddNew = () => {
    const newId = 'recenze-' + Date.now().toString(36)
    const newRev = {
      id: newId,
      name: 'Nový zákazník',
      locality: 'Ostrava a okolí',
      project: 'Rekonstrukce elektroinstalace',
      rating: 5,
      text: 'Text hodnocení spokojeného zákazníka...',
      badge: 'Ověřená reference',
      active: true,
    }
    onChange([newRev, ...data])
  }

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h3>Hodnocení a recenze zákazníků</h3>
          <p>
            Správa recenzí zobrazených na stránce Reference. Můžete sem vkládat reálná hodnocení ze Seznamu, Google Maps nebo přímo od klientů.
          </p>
        </div>
        <button type="button" className="button yellow" onClick={handleAddNew}>
          + Přidat recenzi ↗
        </button>
      </div>

      <div className="reviews-editor-list">
        {data.map((item, idx) => (
          <div key={item.id} className={`admin-review-card ${!item.active ? 'is-inactive' : ''}`}>
            <div className="admin-case-header">
              <div className="admin-case-title-row">
                <span className="review-stars-preview">{'★'.repeat(item.rating || 5)}</span>
                <h4>{item.name}</h4>
                <small>({item.locality} · {item.project})</small>
                {!item.active && <span className="admin-status-draft">Skryto</span>}
              </div>

              <div className="admin-item-actions">
                <button
                  type="button"
                  className={`admin-toggle-btn ${item.active ? 'active' : ''}`}
                  onClick={() => handleToggleActive(idx)}
                >
                  {item.active ? 'Zobrazeno' : 'Skryto (Zobrazit)'}
                </button>
                <button
                  type="button"
                  className="admin-delete-btn"
                  onClick={() => handleDelete(idx)}
                  title="Smazat recenzi"
                >
                  Smazat
                </button>
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label>
                  <strong>Jméno zákazníka:</strong>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    placeholder="Např. Marek K."
                  />
                </label>
              </div>

              <div className="admin-field">
                <label>
                  <strong>Lokalita:</strong>
                  <input
                    type="text"
                    value={item.locality}
                    onChange={(e) => handleItemChange(idx, 'locality', e.target.value)}
                    placeholder="Např. Ostrava – Poruba"
                  />
                </label>
              </div>

              <div className="admin-field">
                <label>
                  <strong>Typ zakázky:</strong>
                  <input
                    type="text"
                    value={item.project}
                    onChange={(e) => handleItemChange(idx, 'project', e.target.value)}
                    placeholder="Např. Rekonstrukce bytu 3+1"
                  />
                </label>
              </div>

              <div className="admin-field">
                <label>
                  <strong>Počet hvězdiček:</strong>
                  <select
                    value={item.rating || 5}
                    onChange={(e) => handleItemChange(idx, 'rating', parseInt(e.target.value, 10))}
                    className="admin-select"
                  >
                    <option value={5}>5 hvězdiček (★★★★★)</option>
                    <option value={4}>4 hvězdičky (★★★★☆)</option>
                    <option value={3}>3 hvězdičky (★★★☆☆)</option>
                  </select>
                </label>
              </div>

              <div className="admin-field full-width">
                <label>
                  <strong>Text recenze:</strong>
                  <textarea
                    rows={3}
                    value={item.text}
                    onChange={(e) => handleItemChange(idx, 'text', e.target.value)}
                    placeholder="Autentický text klientského hodnocení..."
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
