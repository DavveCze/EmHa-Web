import { useState } from 'react'
import MediaPickerModal from './MediaPickerModal.jsx'

const PAGE_DEFINITIONS = [
  { id: 'rekonstrukce', label: '🔨 Rekonstrukce bytů a domů', isSlider: false, hasSections: true },
  { id: 'elektroinstalace', label: '⚡ Elektroinstalace novostaveb', isSlider: false, hasSections: true },
  { id: 'home', label: '🏠 Hlavní strana (Domů)', isSlider: true },
  { id: 'zabezpeceni-a-automatizace', label: '🛡️ Zabezpečení a automatizace', isSlider: false },
  { id: 'na-co-myslet-pri-rekonstrukcich', label: '💡 Na co myslet při rekonstrukcích', isSlider: false },
  { id: 'opravy-a-servis', label: '🔧 Opravy a servis', isSlider: false },
  { id: 'data-a-slaboproud', label: '🌐 Data a slaboproud', isSlider: false },
  { id: 'jak-pracujeme', label: '📋 Jak pracujeme', isSlider: false },
  { id: 'reference', label: '🏗️ Reference a recenze', isSlider: false },
  { id: 'kontakt', label: '📞 Kontakt', isSlider: false, hasImage: false },
]

export default function PagesTab({ data, onChange, csrfToken }) {
  const [selectedPageId, setSelectedPageId] = useState('rekonstrukce')
  const [activeSectionTab, setActiveSectionTab] = useState('hero')
  const [activeSlideIdx, setActiveSlideIdx] = useState(0)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [pickerTarget, setPickerTarget] = useState(null) // { type: 'hero' | 'slide' | 'sectionImage', slideIdx?: number, sectionKey?: string }

  const pagesData = data || {}
  const currentPageConfig = PAGE_DEFINITIONS.find((p) => p.id === selectedPageId) || PAGE_DEFINITIONS[0]
  const currentPageData = pagesData[selectedPageId] || {}

  const updatePage = (updates) => {
    const updatedPage = {
      ...currentPageData,
      ...updates,
    }
    onChange({
      ...pagesData,
      [selectedPageId]: updatedPage,
    })
  }

  const handleHeroChange = (field, val) => {
    updatePage({
      hero: {
        ...(currentPageData.hero || {}),
        [field]: val,
      },
    })
  }

  const handleSlideChange = (slideIdx, field, val) => {
    const currentSlides = [...(currentPageData.slides || [])]
    if (!currentSlides[slideIdx]) {
      currentSlides[slideIdx] = {}
    }
    currentSlides[slideIdx] = {
      ...currentSlides[slideIdx],
      [field]: val,
    }
    updatePage({ slides: currentSlides })
  }

  const handleBenefitChange = (idx, field, val) => {
    const benefits = [...(currentPageData.benefits || [])]
    if (!benefits[idx]) benefits[idx] = {}
    benefits[idx] = { ...benefits[idx], [field]: val }
    updatePage({ benefits })
  }

  const handleServicesHeadingChange = (field, val) => {
    updatePage({
      servicesHeading: {
        ...(currentPageData.servicesHeading || {}),
        [field]: val,
      },
    })
  }

  const handleSectionMetaChange = (secKey, field, val) => {
    const currentSecs = { ...(currentPageData.sections || {}) }
    currentSecs[secKey] = {
      ...(currentSecs[secKey] || {}),
      [field]: val,
    }
    updatePage({ sections: currentSecs })
  }

  const handleSectionItemChange = (secKey, itemIdx, field, val) => {
    const currentSecs = { ...(currentPageData.sections || {}) }
    const sec = currentSecs[secKey] || {}
    const items = [...(sec.items || [])]
    if (!items[itemIdx]) items[itemIdx] = {}
    items[itemIdx] = { ...items[itemIdx], [field]: val }
    currentSecs[secKey] = { ...sec, items }
    updatePage({ sections: currentSecs })
  }

  const handleChecklistChange = (secKey, checkIdx, val) => {
    const currentSecs = { ...(currentPageData.sections || {}) }
    const sec = currentSecs[secKey] || {}
    const checklist = [...(sec.checklist || [])]
    checklist[checkIdx] = val
    currentSecs[secKey] = { ...sec, checklist }
    updatePage({ sections: currentSecs })
  }

  const handleAddChecklistItem = (secKey) => {
    const currentSecs = { ...(currentPageData.sections || {}) }
    const sec = currentSecs[secKey] || {}
    const checklist = [...(sec.checklist || []), 'Nová položka kontrolního seznamu']
    currentSecs[secKey] = { ...sec, checklist }
    updatePage({ sections: currentSecs })
  }

  const handleRemoveChecklistItem = (secKey, checkIdx) => {
    const currentSecs = { ...(currentPageData.sections || {}) }
    const sec = currentSecs[secKey] || {}
    const checklist = (sec.checklist || []).filter((_, i) => i !== checkIdx)
    currentSecs[secKey] = { ...sec, checklist }
    updatePage({ sections: currentSecs })
  }

  const handleLinkChange = (idx, field, val) => {
    const links = [...(currentPageData.links || [])]
    if (!links[idx]) links[idx] = {}
    links[idx] = { ...links[idx], [field]: val }
    updatePage({ links })
  }

  const handleAddLink = () => {
    const links = [...(currentPageData.links || []), { href: '/kontakt', label: 'Nová služba' }]
    updatePage({ links })
  }

  const handleRemoveLink = (idx) => {
    const links = (currentPageData.links || []).filter((_, i) => i !== idx)
    updatePage({ links })
  }

  const openPicker = (target) => {
    setPickerTarget(target)
    setIsPickerOpen(true)
  }

  const handleMediaSelect = (selectedUrl, selectedAlt) => {
    if (!pickerTarget) return

    const url = typeof selectedUrl === 'object' && selectedUrl !== null ? selectedUrl.url : selectedUrl
    const alt = typeof selectedUrl === 'object' && selectedUrl !== null ? selectedUrl.alt : selectedAlt

    if (pickerTarget.type === 'hero') {
      handleHeroChange('image', url)
      if (alt) {
        handleHeroChange('imageAlt', alt)
      }
    } else if (pickerTarget.type === 'slide') {
      handleSlideChange(pickerTarget.slideIdx, 'image', url)
      if (alt) {
        handleSlideChange(pickerTarget.slideIdx, 'alt', alt)
      }
    } else if (pickerTarget.type === 'sectionImage') {
      handleSectionMetaChange(pickerTarget.sectionKey, 'image', url)
      if (alt) {
        handleSectionMetaChange(pickerTarget.sectionKey, 'imageAlt', alt)
      }
    }

    setIsPickerOpen(false)
    setPickerTarget(null)
  }

  const hasSections = currentPageConfig.hasSections || !!currentPageData.sections

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h3>📄 Editor obsahu stránek & Záměna fotografií</h3>
          <p>
            Kompletní správa textů, odstavců, kroků (01–04), odrážek i odkazů na stránkách.
            Fotografie můžete vyměnit za vlastní nebo vybrat z Knihovny médií.
          </p>
        </div>
      </div>

      {/* Page Selector Tabs */}
      <div
        className="admin-page-selector-bar"
        style={{
          marginBottom: '24px',
          background: 'var(--bg)',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid var(--line)',
        }}
      >
        <label className="admin-mobile-page-select-label" htmlFor="admin-page-select-mobile">
          <span>Vyberte stránku k editaci:</span>
          <select
            id="admin-page-select-mobile"
            className="admin-mobile-page-select"
            value={selectedPageId}
            onChange={(e) => {
              const newId = e.target.value
              const p = PAGE_DEFINITIONS.find((item) => item.id === newId)
              setSelectedPageId(newId)
              setActiveSectionTab(p?.isSlider ? 'slides' : 'hero')
              setActiveSlideIdx(0)
            }}
          >
            {PAGE_DEFINITIONS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <div className="admin-desktop-page-chips">
          {PAGE_DEFINITIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`admin-filter-chip ${selectedPageId === p.id ? 'is-active' : ''}`}
              onClick={() => {
                setSelectedPageId(p.id)
                setActiveSectionTab(p.isSlider ? 'slides' : 'hero')
                setActiveSlideIdx(0)
              }}
              style={{ fontSize: '13px', padding: '6px 12px' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Body */}
      {currentPageConfig.isSlider ? (
        /* HOME EDITOR */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Subtabs for Home */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
            <button
              type="button"
              className={`admin-tab-btn ${activeSectionTab === 'slides' ? 'is-active' : ''}`}
              onClick={() => setActiveSectionTab('slides')}
              style={{ fontSize: '13px', padding: '6px 12px' }}
            >
              🎠 Úvodní karusel (Hero Slider)
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeSectionTab === 'benefits' ? 'is-active' : ''}`}
              onClick={() => setActiveSectionTab('benefits')}
              style={{ fontSize: '13px', padding: '6px 12px' }}
            >
              🌟 3 Hlavní výhody
            </button>
            <button
              type="button"
              className={`admin-tab-btn ${activeSectionTab === 'services' ? 'is-active' : ''}`}
              onClick={() => setActiveSectionTab('services')}
              style={{ fontSize: '13px', padding: '6px 12px' }}
            >
              🏷️ Nadpis služeb & Upoutávka
            </button>
          </div>

          {activeSectionTab === 'slides' && (
            <div className="admin-case-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--green)', fontSize: '16px' }}>Úvodní karusel hlavní stránky (3 snímky)</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                    Upravte nadpisy, popisy a fotografie pro každý ze 3 snímků v záhlaví domovské stránky.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`admin-filter-chip ${activeSlideIdx === idx ? 'is-active' : ''}`}
                      onClick={() => setActiveSlideIdx(idx)}
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      Snímek {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const slides = currentPageData.slides || []
                const slide = slides[activeSlideIdx] || {}

                return (
                  <div className="admin-form-grid">
                    <div className="admin-field full-width">
                      <label htmlFor={`slide-title-${activeSlideIdx}`}>
                        <strong>Hlavní nadpis snímku {activeSlideIdx + 1} (podporuje zalomení řádku):</strong>
                      </label>
                      <textarea
                        id={`slide-title-${activeSlideIdx}`}
                        rows={2}
                        value={slide.title || ''}
                        onChange={(e) => handleSlideChange(activeSlideIdx, 'title', e.target.value)}
                        placeholder="Poctivá práce.\nSpolehlivá elektřina."
                      />
                    </div>

                    <div className="admin-field full-width">
                      <label htmlFor={`slide-desc-${activeSlideIdx}`}>
                        <strong>Popisný text snímku:</strong>
                      </label>
                      <textarea
                        id={`slide-desc-${activeSlideIdx}`}
                        rows={3}
                        value={slide.description || ''}
                        onChange={(e) => handleSlideChange(activeSlideIdx, 'description', e.target.value)}
                        placeholder="Elektroinstalace pro nové domy i rekonstrukce..."
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor={`slide-img-${activeSlideIdx}`}>
                        <strong>Fotografie snímku:</strong>
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          id={`slide-img-${activeSlideIdx}`}
                          type="text"
                          value={slide.image || ''}
                          onChange={(e) => handleSlideChange(activeSlideIdx, 'image', e.target.value)}
                          placeholder="/assets/..."
                        />
                        <button
                          type="button"
                          className="button yellow"
                          style={{ padding: '8px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                          onClick={() => openPicker({ type: 'slide', slideIdx: activeSlideIdx })}
                        >
                          Vybrat z médií 📸
                        </button>
                      </div>
                    </div>

                    <div className="admin-field">
                      <label htmlFor={`slide-alt-${activeSlideIdx}`}>
                        <strong>ALT popisek fotografie (přístupnost & SEO):</strong>
                      </label>
                      <input
                        id={`slide-alt-${activeSlideIdx}`}
                        type="text"
                        value={slide.alt || ''}
                        onChange={(e) => handleSlideChange(activeSlideIdx, 'alt', e.target.value)}
                        placeholder="Ilustrační elektrikář pracující u rozvaděče"
                      />
                    </div>

                    {slide.image && (
                      <div className="admin-field full-width" style={{ marginTop: '10px' }}>
                        <label>
                          <strong>Náhled snímku:</strong>
                        </label>
                        <div style={{ maxHeight: '200px', overflow: 'hidden', borderRadius: '6px', border: '1px solid var(--line)', background: '#000' }}>
                          <img src={slide.image} alt={slide.alt || 'Náhled'} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          )}

          {activeSectionTab === 'benefits' && (
            <div className="admin-case-card">
              <h4 style={{ margin: '0 0 16px 0', color: 'var(--green)', fontSize: '16px' }}>3 Hlavní výhody v úvodu webu</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '20px' }}>
                {[0, 1, 2].map((idx) => {
                  const b = (currentPageData.benefits || [])[idx] || {}
                  return (
                    <div key={idx} style={{ background: 'var(--input)', border: '1px solid var(--line)', borderRadius: '6px', padding: '16px' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--green)', marginBottom: '10px' }}>
                        Výhoda č. {idx + 1}
                      </div>
                      <div className="admin-field" style={{ marginBottom: '10px' }}>
                        <label><strong>Nadpis:</strong></label>
                        <input
                          type="text"
                          value={b.title || ''}
                          onChange={(e) => handleBenefitChange(idx, 'title', e.target.value)}
                          placeholder="Např. Konzultace zdarma"
                        />
                      </div>
                      <div className="admin-field">
                        <label><strong>Podtext:</strong></label>
                        <textarea
                          rows={2}
                          value={b.text || ''}
                          onChange={(e) => handleBenefitChange(idx, 'text', e.target.value)}
                          placeholder="Nejdřív si společně projdeme váš záměr."
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeSectionTab === 'services' && (
            <div className="admin-case-card">
              <h4 style={{ margin: '0 0 16px 0', color: 'var(--green)', fontSize: '16px' }}>Sekce služeb a upoutávka na Home</h4>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label><strong>Nadpis sekce služeb:</strong></label>
                  <input
                    type="text"
                    value={currentPageData.servicesHeading?.title || ''}
                    onChange={(e) => handleServicesHeadingChange('title', e.target.value)}
                    placeholder="S čím vám pomůžeme?"
                  />
                </div>
                <div className="admin-field">
                  <label><strong>Podtitul sekce služeb:</strong></label>
                  <input
                    type="text"
                    value={currentPageData.servicesHeading?.subtitle || ''}
                    onChange={(e) => handleServicesHeadingChange('subtitle', e.target.value)}
                    placeholder="Vyberte, co právě řešíte."
                  />
                </div>
                <div className="admin-field full-width">
                  <label><strong>Eyebrow upoutávky:</strong></label>
                  <input
                    type="text"
                    value={currentPageData.sections?.feature?.eyebrow || ''}
                    onChange={(e) => handleSectionMetaChange('feature', 'eyebrow', e.target.value)}
                    placeholder="Elektroinstalace od základu"
                  />
                </div>
                <div className="admin-field full-width">
                  <label><strong>Hlavní nadpis upoutávky:</strong></label>
                  <textarea
                    rows={2}
                    value={currentPageData.sections?.feature?.title || ''}
                    onChange={(e) => handleSectionMetaChange('feature', 'title', e.target.value)}
                    placeholder="Od rozvodů\npo poslední zásuvku."
                  />
                </div>
                <div className="admin-field full-width">
                  <label><strong>Popis upoutávky:</strong></label>
                  <textarea
                    rows={3}
                    value={currentPageData.sections?.feature?.description || ''}
                    onChange={(e) => handleSectionMetaChange('feature', 'description', e.target.value)}
                    placeholder="Kam přijde lampa? A kde bude stůl?..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* STANDARD SUBPAGE FULL EDITOR */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Subpage Navigation Sub-tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--line)', paddingBottom: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`admin-tab-btn ${activeSectionTab === 'hero' ? 'is-active' : ''}`}
              onClick={() => setActiveSectionTab('hero')}
              style={{ fontSize: '13px', padding: '6px 12px' }}
            >
              🏷️ 1. Záhlaví (Hero sekce)
            </button>
            {hasSections && (
              <>
                <button
                  type="button"
                  className={`admin-tab-btn ${activeSectionTab === 'soucasti' ? 'is-active' : ''}`}
                  onClick={() => setActiveSectionTab('soucasti')}
                  style={{ fontSize: '13px', padding: '6px 12px' }}
                >
                  📝 2. Co bude součástí (Kroky 01–04)
                </button>
                <button
                  type="button"
                  className={`admin-tab-btn ${activeSectionTab === 'detaily' ? 'is-active' : ''}`}
                  onClick={() => setActiveSectionTab('detaily')}
                  style={{ fontSize: '13px', padding: '6px 12px' }}
                >
                  📋 3. Detaily & Checklist
                </button>
              </>
            )}
            <button
              type="button"
              className={`admin-tab-btn ${activeSectionTab === 'links' ? 'is-active' : ''}`}
              onClick={() => setActiveSectionTab('links')}
              style={{ fontSize: '13px', padding: '6px 12px' }}
            >
              🔗 4. Související odkazy & tlačítka
            </button>
          </div>

          {/* TAB 1: HERO SECTION */}
          {activeSectionTab === 'hero' && (
            <div className="admin-case-card">
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: 0, color: 'var(--green)', fontSize: '16px' }}>
                  Záhlaví (Hero) stránky: {currentPageConfig.label}
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                  Upravte hlavní nadpisy, popis a fotografii zobrazovanou v záhlaví této stránky.
                </p>
              </div>

              {(() => {
                const hero = currentPageData.hero || {}
                const hasImage = currentPageConfig.hasImage !== false

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: hasImage ? 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' : '1fr', gap: '28px' }}>
                    <div className="admin-form-grid" style={{ gridColumn: hasImage ? 'auto' : '1 / -1' }}>
                      <div className="admin-field full-width">
                        <label htmlFor="hero-eyebrow">
                          <strong>Nadnadpis (Eyebrow / Kategorie):</strong>
                        </label>
                        <input
                          id="hero-eyebrow"
                          type="text"
                          value={hero.eyebrow || ''}
                          onChange={(e) => handleHeroChange('eyebrow', e.target.value)}
                          placeholder="Např. Rekonstrukce bytů a domů"
                        />
                      </div>

                      <div className="admin-field full-width">
                        <label htmlFor="hero-title">
                          <strong>Hlavní nadpis H1 (podporuje zalomení řádku):</strong>
                        </label>
                        <textarea
                          id="hero-title"
                          rows={2}
                          value={hero.title || ''}
                          onChange={(e) => handleHeroChange('title', e.target.value)}
                          placeholder="Staré rozvody.\nNová energie pro váš domov."
                        />
                      </div>

                      <div className="admin-field full-width">
                        <label htmlFor="hero-desc">
                          <strong>Popisný text pod nadpisem:</strong>
                        </label>
                        <textarea
                          id="hero-desc"
                          rows={4}
                          value={hero.description || ''}
                          onChange={(e) => handleHeroChange('description', e.target.value)}
                          placeholder="Stručné a výstižné představení služby..."
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="hero-cta">
                          <strong>Text CTA tlačítka:</strong>
                        </label>
                        <input
                          id="hero-cta"
                          type="text"
                          value={hero.ctaText || ''}
                          onChange={(e) => handleHeroChange('ctaText', e.target.value)}
                          placeholder="Např. Poptat kalkulaci"
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="hero-avail">
                          <strong>Dostupnost / Lokalita:</strong>
                        </label>
                        <input
                          id="hero-avail"
                          type="text"
                          value={hero.availability || ''}
                          onChange={(e) => handleHeroChange('availability', e.target.value)}
                          placeholder="Např. Ostrava a okolí"
                        />
                      </div>

                      {hasImage && (
                        <>
                          <div className="admin-field full-width">
                            <label htmlFor="hero-img">
                              <strong>Fotografie v záhlaví:</strong>
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                id="hero-img"
                                type="text"
                                value={hero.image || ''}
                                onChange={(e) => handleHeroChange('image', e.target.value)}
                                placeholder="/assets/... nebo /uploads/..."
                              />
                              <button
                                type="button"
                                className="button yellow"
                                style={{ padding: '8px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                                onClick={() => openPicker({ type: 'hero' })}
                              >
                                Vybrat z médií 📸
                              </button>
                            </div>
                          </div>

                          <div className="admin-field full-width">
                            <label htmlFor="hero-img-alt">
                              <strong>ALT popisek fotografie (přístupnost & SEO):</strong>
                            </label>
                            <input
                              id="hero-img-alt"
                              type="text"
                              value={hero.imageAlt || ''}
                              onChange={(e) => handleHeroChange('imageAlt', e.target.value)}
                              placeholder="Popis pro vyhledávače a čtečky obrazovky"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Live Preview Card */}
                    {hasImage && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)' }}>
                          Živý náhled záhlaví (Hero):
                        </div>
                        <div
                          style={{
                            background: 'var(--input)',
                            border: '1px solid var(--line)',
                            borderRadius: '8px',
                            padding: '16px',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {hero.eyebrow || 'Kategorie'}
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 650, color: 'var(--text)', margin: '6px 0', lineHeight: 1.2 }}>
                            {hero.title || 'Hlavní nadpis'}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.4, marginBottom: '12px' }}>
                            {hero.description || 'Popisný text služby.'}
                          </div>
                          <div style={{ display: 'inline-block', background: 'var(--green)', color: '#fff', fontSize: '12px', padding: '6px 12px', borderRadius: '4px', fontWeight: 600 }}>
                            {hero.ctaText || 'Poptat službu'} ↗
                          </div>

                          {hero.image && (
                            <div style={{ marginTop: '14px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--line)' }}>
                              <img
                                src={hero.image}
                                alt={hero.imageAlt || 'Náhled'}
                                style={{ width: '100%', height: '170px', objectFit: 'cover' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          )}

          {/* TAB 2: SECTIONS - CO BUDE SOUČÁSTÍ (KROKY 01-04) */}
          {activeSectionTab === 'soucasti' && (
            <div className="admin-case-card">
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: 0, color: 'var(--green)', fontSize: '16px' }}>
                  Sekce „Co bude součástí“ (Číslované kroky 01–04)
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                  Upravte nadpis sekce a jednotlivé kroky procesu elektroinstalace.
                </p>
              </div>

              {(() => {
                const soucasti = currentPageData.sections?.soucasti || {}
                const items = soucasti.items || [
                  { num: '01', title: 'Posouzení stávající instalace', text: 'Projdeme stav rozvodů...' },
                  { num: '02', title: 'Výměna rozvodů a rozvaděče', text: 'Připravíme novou instalaci...' },
                  { num: '03', title: 'Zásuvky, vypínače a světla', text: 'Upravíme jejich umístění...' },
                  { num: '04', title: 'Dokončení a kontrola', text: 'Osadíme koncové prvky...' },
                ]

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="admin-form-grid">
                      <div className="admin-field">
                        <label><strong>Eyebrow sekce:</strong></label>
                        <input
                          type="text"
                          value={soucasti.eyebrow || ''}
                          onChange={(e) => handleSectionMetaChange('soucasti', 'eyebrow', e.target.value)}
                          placeholder="Co bude součástí"
                        />
                      </div>
                      <div className="admin-field">
                        <label><strong>Nadpis sekce (H2):</strong></label>
                        <input
                          type="text"
                          value={soucasti.title || ''}
                          onChange={(e) => handleSectionMetaChange('soucasti', 'title', e.target.value)}
                          placeholder="Nová elektřina. Promyšlená od začátku."
                        />
                      </div>
                      <div className="admin-field full-width">
                        <label><strong>Úvodní text sekce:</strong></label>
                        <textarea
                          rows={2}
                          value={soucasti.description || ''}
                          onChange={(e) => handleSectionMetaChange('soucasti', 'description', e.target.value)}
                          placeholder="Popis průběhu a rozsahu..."
                        />
                      </div>
                    </div>

                    <div style={{ fontWeight: 650, fontSize: '14px', color: 'var(--green)', marginTop: '10px' }}>
                      Číslované kroky (01–04):
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'var(--input)',
                            border: '1px solid var(--line)',
                            borderRadius: '8px',
                            padding: '16px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ background: 'var(--green)', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                              {item.num || `0${idx + 1}`}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                              Krok {idx + 1}
                            </span>
                          </div>

                          <div className="admin-field" style={{ marginBottom: '10px' }}>
                            <label><strong>Název kroku:</strong></label>
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => handleSectionItemChange('soucasti', idx, 'title', e.target.value)}
                              placeholder={`Název kroku ${idx + 1}`}
                            />
                          </div>

                          <div className="admin-field">
                            <label><strong>Popis kroku:</strong></label>
                            <textarea
                              rows={3}
                              value={item.text || ''}
                              onChange={(e) => handleSectionItemChange('soucasti', idx, 'text', e.target.value)}
                              placeholder={`Popis kroku ${idx + 1}...`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* TAB 3: SECTIONS - DETAILY A CHECKLIST */}
          {activeSectionTab === 'detaily' && (
            <div className="admin-case-card">
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: 0, color: 'var(--green)', fontSize: '16px' }}>
                  Sekce „Detaily a checklist“
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                  Upravte nadpis, vysvětlující text, fotografii a odrážkový kontrolní seznam.
                </p>
              </div>

              {(() => {
                const detaily = currentPageData.sections?.detaily || {}
                const checklist = detaily.checklist || [
                  'Rozsah celkové nebo částečné rekonstrukce',
                  'Návaznost na zedníky a další řemesla',
                  'Nová kuchyň a umístění spotřebičů',
                  'Rezerva pro budoucí změny',
                ]

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="admin-form-grid">
                      <div className="admin-field">
                        <label><strong>Eyebrow sekce:</strong></label>
                        <input
                          type="text"
                          value={detaily.eyebrow || ''}
                          onChange={(e) => handleSectionMetaChange('detaily', 'eyebrow', e.target.value)}
                          placeholder="Promyslíme to spolu"
                        />
                      </div>
                      <div className="admin-field">
                        <label><strong>Nadpis sekce (H2):</strong></label>
                        <input
                          type="text"
                          value={detaily.title || ''}
                          onChange={(e) => handleSectionMetaChange('detaily', 'title', e.target.value)}
                          placeholder="Aby na sebe všechno navazovalo."
                        />
                      </div>
                      <div className="admin-field full-width">
                        <label><strong>Text odstavce:</strong></label>
                        <textarea
                          rows={3}
                          value={detaily.description || ''}
                          onChange={(e) => handleSectionMetaChange('detaily', 'description', e.target.value)}
                          placeholder="Předem si ujasníme..."
                        />
                      </div>

                      <div className="admin-field">
                        <label><strong>Fotografie v sekci:</strong></label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={detaily.image || ''}
                            onChange={(e) => handleSectionMetaChange('detaily', 'image', e.target.value)}
                            placeholder="/assets/..."
                          />
                          <button
                            type="button"
                            className="button yellow"
                            style={{ padding: '8px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                            onClick={() => openPicker({ type: 'sectionImage', sectionKey: 'detaily' })}
                          >
                            Vybrat 📸
                          </button>
                        </div>
                      </div>

                      <div className="admin-field">
                        <label><strong>ALT popisek fotografie:</strong></label>
                        <input
                          type="text"
                          value={detaily.imageAlt || ''}
                          onChange={(e) => handleSectionMetaChange('detaily', 'imageAlt', e.target.value)}
                          placeholder="Popis obrázku"
                        />
                      </div>
                    </div>

                    {/* Checklist Editor */}
                    <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ fontWeight: 650, fontSize: '14px', color: 'var(--green)' }}>
                          Položky checklistu (odrážkový seznam):
                        </div>
                        <button
                          type="button"
                          className="button outline"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => handleAddChecklistItem('detaily')}
                        >
                          + Přidat položku
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {checklist.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleChecklistChange('detaily', idx, e.target.value)}
                              style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #b2bcaf', background: 'var(--input)', color: 'var(--text)' }}
                              placeholder="Text odrážky..."
                            />
                            <button
                              type="button"
                              className="admin-delete-btn"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                              onClick={() => handleRemoveChecklistItem('detaily', idx)}
                              title="Odstranit odrážku"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* TAB 4: RELATED SERVICES & LINKS */}
          {activeSectionTab === 'links' && (
            <div className="admin-case-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--green)', fontSize: '16px' }}>
                    Související odkazy & tlačítka na stránce
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                    Odkazy na další služby a doporučené podstránky zobrazené ve spodní části stránky.
                  </p>
                </div>
                <button
                  type="button"
                  className="button yellow"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={handleAddLink}
                >
                  + Přidat odkaz
                </button>
              </div>

              {(() => {
                const links = currentPageData.links || []

                if (links.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '24px', background: 'var(--input)', borderRadius: '6px', border: '1px dashed var(--line)' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                        Zatím nejsou nastaveny žádné vlastní odkazy. Použijí se výchozí odkazy na související služby.
                      </p>
                    </div>
                  )
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {links.map((link, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1.5fr auto',
                          gap: '12px',
                          alignItems: 'center',
                          background: 'var(--input)',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: '1px solid var(--line)',
                        }}
                      >
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                            Název odkazu:
                          </label>
                          <input
                            type="text"
                            value={link.label || ''}
                            onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                            placeholder="Např. Zabezpečení Ajax"
                            style={{ width: '100%', padding: '6px 10px', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                            Cílová adresa URL:
                          </label>
                          <input
                            type="text"
                            value={link.href || ''}
                            onChange={(e) => handleLinkChange(idx, 'href', e.target.value)}
                            placeholder="Např. /zabezpeceni"
                            style={{ width: '100%', padding: '6px 10px', fontSize: '13px' }}
                          />
                        </div>

                        <div style={{ paddingTop: '18px' }}>
                          <button
                            type="button"
                            className="admin-delete-btn"
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            onClick={() => handleRemoveLink(idx)}
                            title="Smazat odkaz"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}

      {/* Media Picker Modal */}
      {isPickerOpen && (
        <MediaPickerModal
          isOpen={isPickerOpen}
          csrfToken={csrfToken}
          onSelect={handleMediaSelect}
          onClose={() => {
            setIsPickerOpen(false)
            setPickerTarget(null)
          }}
        />
      )}
    </div>
  )
}
