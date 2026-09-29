import { useState } from 'react'
import MediaPickerModal from './MediaPickerModal.jsx'

export default function CaseStudiesTab({ data, onChange, csrfToken }) {
  const [pickerCaseIdx, setPickerCaseIdx] = useState(null)

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

  const handleMove = (idx, dir) => {
    const next = [...data]
    const targetIdx = idx + dir
    if (targetIdx < 0 || targetIdx >= next.length) return
    const temp = next[idx]
    next[idx] = next[targetIdx]
    next[targetIdx] = temp
    onChange(next)
  }

  const handleDelete = (idx) => {
    if (window.confirm('Opravdu chcete tuto případovou studii smazat?')) {
      const next = data.filter((_, i) => i !== idx)
      onChange(next)
    }
  }

  const handleAddNew = () => {
    const newId = 'studie-' + Date.now().toString(36)
    const newCase = {
      id: newId,
      title: 'Nová realizace elektroinstalace',
      badge: 'Rekonstrukce · Byt',
      image: '/assets/renovation.jpg',
      imageAlt: 'Elektroinstalace Ostrava',
      locality: 'Ostrava a okolí',
      scope: 'Kompletní nové rozvody a rozvaděč',
      originalState: 'Původní stav elektroinstalace...',
      solution: 'Popis našeho odborného řešení a postupu...',
      duration: '3–5 dní',
      status: 'Předáno s revizní zprávou',
      active: true,
    }
    onChange([newCase, ...data])
  }

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h3>Případové studie a ukázky realizací</h3>
          <p>
            Správa konkrétních projektů zobrazených na stránce Reference. Můžete přidávat nové realizace, upravovat texty nebo měnit jejich pořadí.
          </p>
        </div>
        <button type="button" className="button yellow" onClick={handleAddNew}>
          + Přidat novou studii ↗
        </button>
      </div>

      <div className="case-studies-editor-list">
        {data.map((item, idx) => (
          <div key={item.id} className={`admin-case-card ${!item.active ? 'is-inactive' : ''}`}>
            <div className="admin-case-header">
              <div className="admin-case-title-row">
                <span className="drag-index">#{idx + 1}</span>
                <h4>{item.title || 'Nepojmenovaná studie'}</h4>
                {!item.active && <span className="admin-status-draft">Skryto (Koncept)</span>}
              </div>

              <div className="admin-item-actions">
                <button
                  type="button"
                  className="icon-btn"
                  title="Posunout nahoru"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  title="Posunout dolů"
                  disabled={idx === data.length - 1}
                  onClick={() => handleMove(idx, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={`admin-toggle-btn ${item.active ? 'active' : ''}`}
                  onClick={() => handleToggleActive(idx)}
                >
                  {item.active ? 'Aktivní na webu' : 'Zobrazit na webu'}
                </button>
                <button
                  type="button"
                  className="admin-delete-btn"
                  onClick={() => handleDelete(idx)}
                  title="Smazat realizaci"
                >
                  Smazat
                </button>
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label>
                  <strong>Název realizace:</strong>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                    placeholder="Např. Rekonstrukce bytu 3+1"
                  />
                </label>
              </div>

              <div className="admin-field">
                <label>
                  <strong>Štítek / Kategorie:</strong>
                  <input
                    type="text"
                    value={item.badge}
                    onChange={(e) => handleItemChange(idx, 'badge', e.target.value)}
                    placeholder="Např. Panelový byt · Rekonstrukce"
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
                  <strong>Doba realizace:</strong>
                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                    placeholder="Např. 4 dny hrubé rozvody + 1 den kompletace"
                  />
                </label>
              </div>

              <div className="admin-field full-width">
                <label>
                  <strong>Rozsah prací:</strong>
                  <input
                    type="text"
                    value={item.scope}
                    onChange={(e) => handleItemChange(idx, 'scope', e.target.value)}
                    placeholder="Např. Kompletní výměna rozvodů, nový bytový rozvaděč, datové kabely"
                  />
                </label>
              </div>

              <div className="admin-field full-width">
                <label>
                  <strong>Původní stav (před zásahem):</strong>
                  <textarea
                    rows={2}
                    value={item.originalState}
                    onChange={(e) => handleItemChange(idx, 'originalState', e.target.value)}
                    placeholder="Popište problémy (např. starý hliník, přetěžované okruhy, padající jističe)..."
                  />
                </label>
              </div>

              <div className="admin-field full-width">
                <label>
                  <strong>Fotografie realizace:</strong>
                  <div className="admin-case-img-picker">
                    <img
                      src={item.image || '/assets/renovation.jpg'}
                      alt={item.imageAlt || item.title}
                      className="admin-case-img-preview"
                    />
                    <div className="admin-case-img-controls">
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          value={item.image || ''}
                          onChange={(e) => handleItemChange(idx, 'image', e.target.value)}
                          placeholder="/assets/renovation.jpg nebo /uploads/..."
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="button primary small"
                          onClick={() => setPickerCaseIdx(idx)}
                        >
                          🖼️ Vybrat z médií
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.imageAlt || ''}
                        onChange={(e) => handleItemChange(idx, 'imageAlt', e.target.value)}
                        placeholder="Alternativní text fotky (ALT pro Google a čtečky)"
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MediaPickerModal
        isOpen={pickerCaseIdx !== null}
        onClose={() => setPickerCaseIdx(null)}
        csrfToken={csrfToken}
        onSelect={(url, alt) => {
          if (pickerCaseIdx !== null) {
            handleItemChange(pickerCaseIdx, 'image', url)
            if (alt) {
              handleItemChange(pickerCaseIdx, 'imageAlt', alt)
            }
          }
        }}
      />
    </div>
  )
}
