import { useNavigation } from '../context/navigation-core.js'
import InquiryForm from '../components/InquiryForm.jsx'
import { useContent } from '../context/content-core.js'
import defaultContent from '../data/defaultContent.json'

export default function Kontakt() {
  const { navigate } = useNavigation()
  const { content } = useContent()
  const b = content?.business || defaultContent.business

  return (
    <main id="main" tabIndex={-1}>
      <div className="breadcrumbs container">
        <span>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
            }}
          >
            Domů
          </a>
        </span>
        <span> / Kontakt</span>
      </div>

      <section className="section" style={{ paddingTop: '12px' }}>
        <div className="container split">
          <div>
            <p className="eyebrow">{content?.pages?.kontakt?.hero?.eyebrow || 'Spojte se s námi'}</p>
            <h1>{content?.pages?.kontakt?.hero?.title || 'Kontaktní údaje a nezávazná poptávka'}</h1>
            <p>
              {content?.pages?.kontakt?.hero?.description ||
                'Pro byty, rodinné domy i menší opravy. Působíme v Ostravě a celém Moravskoslezském kraji. Realizaci v konkrétní lokalitě a termín domluvíme individuálně.'}
            </p>

            <div className="contact-card">
              <h3>Rychlý kontakt</h3>

              <div className="contact-item">
                <div className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="contact-body">
                  <strong>Telefon / Mobil:</strong>{' '}
                  <a href={`tel:${b.phoneRaw || '+420731833605'}`}>{b.phone || '+420 731 833 605'}</a>
                  <small>Konzultace a domluva termínů ({b.openingHours || 'Po–Pá 8:00–17:00'})</small>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="contact-body">
                  <strong>E-mail:</strong>{' '}
                  <a href={`mailto:${b.email || 'info@emha-elektro.cz'}`}>{b.email || 'info@emha-elektro.cz'}</a>
                  <small>Pro zaslání projektů, půdorysů a podkladů</small>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="contact-body">
                  <strong>Oblast působení:</strong> Ostrava, Havířov, Frýdek-Místek, Karviná a okolí
                  <small>Působíme po celém Moravskoslezském kraji</small>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div className="contact-body">
                  <strong>Fakturační a identifikační údaje (§ 435 NOZ):</strong>
                  <div>{b.legalName || 'Martin Hořčica'} · {b.name || 'EmHa Elektro'}</div>
                  <div>IČO: {b.taxID || '14216132'} ({b.isVatPayer ? 'Plátce DPH' : 'neplátce DPH'})</div>
                  <div>Sídlo: {b.street || 'Tlapákova 1242/15'}, {b.city || 'Hrabůvka, 700 30 Ostrava'}</div>
                  <small>{b.registration || 'Fyzická osoba zapsaná v živnostenském rejstříku od 2. 2. 2022 (Živnostenský úřad Ostrava).'}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="map-card">
            <div className="map-header">
              <div>
                <p className="eyebrow" style={{ marginBottom: '6px' }}>Kde působíme</p>
                <h3>Ostrava a Moravskoslezský kraj</h3>
              </div>
              <span className="map-badge">Dojezd v kraji</span>
            </div>

            <div
              className="map-visual"
              role="img"
              aria-label="Stylizovaná mapa působnosti EmHa Elektro — Ostrava a Moravskoslezský kraj"
            >
              <svg viewBox="0 0 500 300" className="map-svg" aria-hidden="true">
                <defs>
                  <linearGradient id="mapBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14392c" />
                    <stop offset="100%" stopColor="#1e5443" />
                  </linearGradient>
                  <radialGradient id="ostravaGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#dfbf55" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#dfbf55" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Podkladový reliéf mapy kraje */}
                <rect width="500" height="300" fill="url(#mapBgGrad)" rx="8" />

                {/* Hranice / obrys regionu Moravskoslezského kraje */}
                <path
                  d="M60 80 Q100 40 180 50 T310 45 T410 70 T460 130 T440 230 T360 270 T240 260 T140 270 T70 200 Z"
                  fill="#1b4d3c"
                  stroke="#2c6954"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />

                {/* Dojezdový rádius kolem Ostravy */}
                <circle cx="260" cy="135" r="95" fill="none" stroke="#dfbf55" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.4" />
                <circle cx="260" cy="135" r="50" fill="none" stroke="#dfbf55" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
                <circle cx="260" cy="135" r="40" fill="url(#ostravaGlow)" />

                {/* Spojnice tras a infrastruktury */}
                <g stroke="#ffffff" strokeWidth="1.6" strokeOpacity="0.35" strokeLinecap="round">
                  <line x1="260" y1="135" x2="125" y2="105" />
                  <line x1="260" y1="135" x2="280" y2="70" />
                  <line x1="260" y1="135" x2="380" y2="90" />
                  <line x1="260" y1="135" x2="355" y2="160" />
                  <line x1="260" y1="135" x2="270" y2="225" />
                  <line x1="270" y1="225" x2="150" y2="235" />
                  <line x1="355" y1="160" x2="415" y2="210" />
                  <line x1="380" y1="90" x2="355" y2="160" />
                </g>

                {/* Vedlejší města */}
                {/* Opava */}
                <circle cx="125" cy="105" r="5" fill="#f4f3ee" />
                <text x="125" y="93" fill="#ecede2" fontSize="11" fontWeight="600" textAnchor="middle">Opava</text>

                {/* Bohumín */}
                <circle cx="280" cy="70" r="4.5" fill="#f4f3ee" />
                <text x="280" y="60" fill="#ecede2" fontSize="11" fontWeight="600" textAnchor="middle">Bohumín</text>

                {/* Karviná */}
                <circle cx="380" cy="90" r="5" fill="#f4f3ee" />
                <text x="380" y="80" fill="#ecede2" fontSize="11" fontWeight="600" textAnchor="middle">Karviná</text>

                {/* Havířov */}
                <circle cx="355" cy="160" r="5.5" fill="#f4f3ee" />
                <text x="367" y="164" fill="#ecede2" fontSize="12" fontWeight="600" textAnchor="start">Havířov</text>

                {/* Frýdek-Místek */}
                <circle cx="270" cy="225" r="5.5" fill="#f4f3ee" />
                <text x="270" y="244" fill="#ecede2" fontSize="12" fontWeight="600" textAnchor="middle">Frýdek-Místek</text>

                {/* Nový Jičín */}
                <circle cx="150" cy="235" r="4.5" fill="#f4f3ee" />
                <text x="150" y="252" fill="#ecede2" fontSize="11" fontWeight="600" textAnchor="middle">Nový Jičín</text>

                {/* Třinec */}
                <circle cx="415" cy="210" r="4.5" fill="#f4f3ee" />
                <text x="425" y="214" fill="#ecede2" fontSize="11" fontWeight="600" textAnchor="start">Třinec</text>

                {/* Hlavní centrum - Ostrava */}
                <circle cx="260" cy="135" r="9" fill="#dfbf55" />
                <circle cx="260" cy="135" r="4" fill="#14392c" />
                <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
                  <rect x="206" y="149" width="108" height="24" rx="4" fill="#14392c" stroke="#dfbf55" strokeWidth="1" />
                  <text x="260" y="165" fill="#dfbf55" fontSize="12" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">
                    OSTRAVA
                  </text>
                </g>

                {/* Štítek regionu */}
                <text x="24" y="32" fill="#9dbba9" fontSize="11" fontWeight="700" letterSpacing="0.1em">
                  MORAVSKOSLEZSKÝ KRAJ
                </text>
              </svg>
            </div>

            <div className="map-footer">
              <p>
                <strong>Osobní prohlídka a zaměření:</strong> Realizujeme zakázky v Ostravě i celém kraji.
                Rádi přijedeme zhodnotit stav přímo na vaši stavbu či do bytu.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ostrava"
                target="_blank"
                rel="noopener noreferrer"
                className="button yellow map-btn"
              >
                Otevřít v Google Mapách <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
      />
    </main>
  )
}
