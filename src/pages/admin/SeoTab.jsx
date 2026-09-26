import { useState } from 'react'

const ROUTE_LABELS = {
  '/': 'Úvodní stránka (Home)',
  '/elektroinstalace': 'Elektroinstalace novostaveb',
  '/rekonstrukce': 'Rekonstrukce bytů a domů',
  '/zabezpeceni-a-automatizace': 'Zabezpečení Ajax a automatizace',
  '/na-co-myslet-pri-rekonstrukcich': 'Konzultace před rekonstrukcí',
  '/opravy-a-servis': 'Opravy a servis',
  '/data-a-slaboproud': 'Datové rozvody a slaboproud',
  '/jak-pracujeme': 'Jak pracujeme',
  '/reference': 'Reference a recenze',
  '/kontakt': 'Kontakt',
}

export default function SeoTab({ data, onChange }) {
  const [selectedRoute, setSelectedRoute] = useState('/')

  const currentMeta = data[selectedRoute] || { title: '', description: '' }

  const handleTitleChange = (val) => {
    onChange({
      ...data,
      [selectedRoute]: {
        ...currentMeta,
        title: val,
      },
    })
  }

  const handleDescChange = (val) => {
    onChange({
      ...data,
      [selectedRoute]: {
        ...currentMeta,
        description: val,
      },
    })
  }

  const titleLen = currentMeta.title.length
  const descLen = currentMeta.description.length

  const getMeterColor = (len, min, max) => {
    if (len === 0) return '#999'
    if (len >= min && len <= max) return '#2e7d32' // green
    if (len < min) return '#ed6c02' // orange
    return '#d32f2f' // red (truncated by Google)
  }

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h3>Optimalizace pro vyhledávače (SEO) & Google SERP</h3>
          <p>
            Upravte titulky a meta popisky pro každou stránku. Níže vidíte živý simulátor toho, jak bude výsledek vypadat ve vyhledávání na Google.
          </p>
        </div>

        <div className="route-selector">
          <label htmlFor="route-select">
            <strong>Vyberte stránku:</strong>
            <select
              id="route-select"
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="admin-select"
            >
              {Object.entries(ROUTE_LABELS).map(([route, label]) => (
                <option key={route} value={route}>
                  {label} ({route})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="seo-editor-grid">
        <div className="seo-inputs">
          <div className="admin-field">
            <div className="field-meta">
              <label htmlFor="seo-title">
                <strong>Titulek stránky (&lt;title&gt;)</strong>
              </label>
              <span style={{ color: getMeterColor(titleLen, 45, 65), fontSize: '13px', fontWeight: 600 }}>
                {titleLen} / 60 znaků {titleLen > 65 ? '(Google může zkrátit)' : ''}
              </span>
            </div>
            <input
              id="seo-title"
              type="text"
              value={currentMeta.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Např. Elektroinstalace a rekonstrukce Ostrava | EmHa Elektro"
              maxLength={150}
            />
            <small className="field-hint">Ideální délka je 50–60 znaků. Zahrňte hlavní službu a lokalitu.</small>
          </div>

          <div className="admin-field">
            <div className="field-meta">
              <label htmlFor="seo-desc">
                <strong>Meta popisek (Description pro vyhledávače)</strong>
              </label>
              <span style={{ color: getMeterColor(descLen, 120, 160), fontSize: '13px', fontWeight: 600 }}>
                {descLen} / 160 znaků {descLen > 160 ? '(Překročen doporučený limit)' : ''}
              </span>
            </div>
            <textarea
              id="seo-desc"
              rows={4}
              value={currentMeta.description}
              onChange={(e) => handleDescChange(e.target.value)}
              placeholder="Stručný a lákavý popis stránky pro výsledky vyhledávání..."
              maxLength={300}
            />
            <small className="field-hint">Optimální délka pro zobrazení bez oříznutí je 120–155 znaků.</small>
          </div>
        </div>

        {/* Live Google SERP Simulator */}
        <div className="serp-preview-card">
          <h4>Živý náhled na Google (SERP simulátor)</h4>
          <div className="serp-box">
            <div className="serp-url-row">
              <span className="serp-favicon">⚡</span>
              <div className="serp-breadcrumbs">
                <span className="serp-domain">emha-elektro.cz</span>
                <span className="serp-path"> {selectedRoute === '/' ? '' : `› ${selectedRoute.slice(1)}`}</span>
              </div>
            </div>
            <div className="serp-title">
              {currentMeta.title || 'Název stránky — EmHa Elektro'}
            </div>
            <div className="serp-snippet">
              {currentMeta.description || 'Zde se zobrazí popisek stránky, který pomáhá zákazníkům na Google pochopit vaši nabídku.'}
            </div>
          </div>
          <div className="serp-tips">
            <span className="tip-badge">💡 Tip</span>
            <small>
              Jasný titulek s lokalitou (Ostrava) a konkrétní výhodou (Konzultace zdarma, Bezprašné drážkování) zvyšuje míru prokliku (CTR) až o 30 %.
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}
