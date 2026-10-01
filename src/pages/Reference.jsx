import DetailHero from '../components/DetailHero.jsx'
import Gallery from '../components/Gallery.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import { useContent } from '../context/content-core.js'
import defaultContent from '../data/defaultContent.json'

export default function Reference() {
  const { content } = useContent()
  const caseStudies = (content?.caseStudies || defaultContent.caseStudies).filter((c) => c.active !== false)
  const reviews = (content?.reviews || defaultContent.reviews).filter((r) => r.active !== false)

  const referenceGalleryItems = [
    {
      src: '/assets/panel-detail.jpg',
      caption: 'Rozvody a rozvaděče — precizní modulární uspořádání a lištování',
      label: 'Rozvody a rozvaděče',
    },
    {
      src: '/assets/renovation.jpg',
      caption: 'Příprava nových rozvodů — kabeláž CYKY v drážkách před omítkami',
      label: 'Příprava nových rozvodů',
    },
    {
      src: '/assets/ceiling-worker.jpg',
      caption: 'Montáž osvětlení — zapojení světelných a LED okruhů',
      label: 'Montáž osvětlení',
    },
    {
      src: '/assets/new-build.jpg',
      caption: 'Elektroinstalace rodinného domu — kompletní silnoproud i slaboproud',
      label: 'Novostavby a rozvody',
    },
    {
      src: '/assets/switch-detail.jpg',
      caption: 'Kompletace vypínačů a zásuvek — čisté lícování a přesné roviny',
      label: 'Zásuvky a vypínače',
    },
    {
      src: '/assets/electrician.jpg',
      caption: 'Odborné zapojení a měření — příprava pro výchozí revizní zprávu',
      label: 'Odborné zapojení',
    },
  ]

  const standards = [
    {
      title: 'Přísné normované instalační zóny',
      desc: 'Kabely vedeme výhradně vodorovně a svisle dle norem ČSN. Žádné šikmé trasy „křížem krážem“, které byste později provrtali při věšení obrazu či poličky.',
    },
    {
      title: 'Srozumitelný popis rozvaděče',
      desc: 'Každý jistič v rozvaděči označujeme jasným a trvalým popisem (např. „Kuchyň – myčka“, „Koupelna – zásuvky“). V případě potřeby se v rozvodech vyzná celá rodina.',
    },
    {
      title: 'Dostatek zásuvek bez rozdvojek',
      desc: 'Navrhujeme rozvody s rezervou pro moderní spotřebiče. Cílem je, abyste v novém domově nemuseli po zemi tahat nevzhledné a rizikové prodlužovačky.',
    },
    {
      title: 'Pořádek a průmyslové odsávání',
      desc: 'Při drážkování do zdiva i betonu používáme drážkovací frézy s napojením na průmyslový vysavač třídy M. Hrubý úklid po skončení prací je samozřejmostí.',
    },
    {
      title: 'Ověřené komponenty renomovaných značek',
      desc: 'Používáme výhradně certifikovaný instalační materiál a jisticí prvky ověřených výrobců (Hager, Eaton, Schneider Electric, ABB), které zaručují dlouhou životnost.',
    },
    {
      title: 'Výchozí revize ke každé realizaci',
      desc: 'Kompletní instalace zakončujeme odborným proměřením a zajištěním výchozí revizní zprávy ve spolupráci s certifikovaným revizním technikem pro klidný spánek i kolaudaci.',
    },
  ]

  return (
    <main id="main" tabIndex={-1}>
      <DetailHero
        pageKey="reference"
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Reference' },
        ]}
        eyebrow="Reference a ukázky práce"
        title={
          <>
            Práce, která je vidět.
            <br />
            I ta bezpečně ukrytá ve zdech.
          </>
        }
        description="Kompletní elektroinstalace, rekonstrukce rozvodů a nové rozvaděče v Ostravě a Moravskoslezském kraji. Podívejte se na reálný průběh zakázek od starých hliníkových kabelů po moderní a bezpečné řešení."
        imageSrc="/assets/panel-detail.jpg"
        imageAlt="Detail precizně zapojeného domovního rozvaděče"
        availability="Ostrava, Havířov, Frýdek-Místek, Karviná a okolí"
        ctaText="Poptat kalkulaci pro váš projekt"
        ctaHref="#poptavka"
        editorial
      />

      {/* Rychlý pruh řemeslných záruk */}
      <section className="section" style={{ paddingTop: '0', paddingBottom: '30px' }}>
        <div className="container">
          <div className="reference-pillars" aria-label="Základní standardy realizací">
            <div className="pillar-item">
              <span className="pillar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="7.5" r="2.2" fill="currentColor" fillOpacity="0.25" />
                  <circle cx="8" cy="14.5" r="2.2" fill="currentColor" fillOpacity="0.25" />
                  <circle cx="16" cy="14.5" r="2.2" fill="currentColor" fillOpacity="0.25" />
                </svg>
              </span>
              <strong>100% měď (CYKY)</strong>
              <span>Nové bezpečné třívodičové rozvody dle ČSN</span>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M13 7.5L9.5 12h3.2L11 16.5l4.5-5.5h-3.2L13 7.5z" fill="currentColor" fillOpacity="0.25" />
                </svg>
              </span>
              <strong>Proudové chrániče (RCD)</strong>
              <span>Okamžitá ochrana proti úrazu elektrickým proudem</span>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="12" x2="12" y2="12" />
                  <line x1="8" y1="16" x2="10" y2="16" />
                  <circle cx="15.5" cy="16.5" r="2.8" fill="currentColor" fillOpacity="0.2" />
                  <polyline points="14.5 16.5 15.3 17.3 16.8 15.7" strokeWidth="1.9" />
                </svg>
              </span>
              <strong>Výchozí revizní zpráva</strong>
              <span>Zajištěna ve spolupráci s revizním technikem</span>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M5 3v4" />
                  <path d="M3 5h4" />
                  <path d="M19 17v4" />
                  <path d="M17 19h4" />
                </svg>
              </span>
              <strong>Čistota při realizaci</strong>
              <span>Průmyslové odsávání prachu při drážkování</span>
            </div>
          </div>
        </div>
      </section>

      {/* Případové studie typických zakázek */}
      <section className="section sage" id="pripadove-studie">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Ukázky z praxe</p>
              <h2>Případové studie typických realizací</h2>
            </div>
            <p>
              Každý prostor má svá specifika. Zde je přehled toho, jak přistupujeme k rekonstrukcím
              v panelových domech, cihlové zástavbě i kompletním rozvodům v novostavbách.
            </p>
          </div>

          <div className="case-studies-grid">
            {caseStudies.map((item) => (
              <article key={item.id} className="case-card">
                <div className="case-image">
                  <picture>
                    {typeof item.image === 'string' && item.image.endsWith('.jpg') && (
                      <source srcSet={item.image.replace(/\.jpg$/, '.webp')} type="image/webp" />
                    )}
                    {typeof item.image === 'string' && item.image.endsWith('.png') && (
                      <source srcSet={item.image.replace(/\.png$/, '.webp')} type="image/webp" />
                    )}
                    <img src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" width="540" height="220" />
                  </picture>
                  <span className="case-badge">{item.badge}</span>
                </div>
                <div className="case-body">
                  <h3>{item.title}</h3>
                  <div className="case-meta">
                    <span><b>Lokalita:</b> {item.locality}</span>
                    <span><b>Rozsah:</b> {item.scope}</span>
                  </div>

                  <div className="case-detail-block">
                    <strong>Původní stav:</strong>
                    <span>{item.originalState}</span>
                  </div>

                  <div className="case-detail-block">
                    <strong>Naše řešení:</strong>
                    <span>{item.solution}</span>
                  </div>

                  <div className="case-footer">
                    <span className="case-duration">⏱ {item.duration}</span>
                    <span className="case-status-tag">✓ {item.status}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Klientská hodnocení a recenze */}
      <section className="section" id="recenze">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Zkušenosti zákazníků</p>
              <h2>Co o naší práci říkají klienti</h2>
            </div>
            <div>
              <p style={{ margin: 0, marginBottom: '8px' }}>
                Poctivé řemeslo stavíme na spolehlivé komunikaci, dodržení rozpočtu a pořádku na pracovišti.
                Na vyžádání vám rádi zprostředkujeme přímý kontakt na reference nebo osobní prohlídku aktuálně probíhající zakázky v Ostravě a okolí.
              </p>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--muted)' }}>
                ✓ <strong>Ověřování recenzí:</strong> Všechna hodnocení pocházejí výhradně od našich přímých zákazníků, kterým jsme realizovali elektroinstalaci. Recenze ověřujeme spárováním se zakázkovým listem a fakturací (§ 5a zákona o ochraně spotřebitele).
              </p>
            </div>
          </div>

          <div className="reviews-grid">
            {reviews.map((rev) => (
              <blockquote key={rev.id} className="review-card">
                <div className="review-stars" aria-label={`Hodnocení ${rev.rating} z 5 hvězdiček`}>
                  {Array.from({ length: rev.rating }, (_, i) => (
                    <svg key={i} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" />
                    </svg>
                  ))}
                </div>
                <p className="review-text">„{rev.text}“</p>
                <footer className="review-author">
                  <div className="review-author-info">
                    <strong>{rev.name}</strong>
                    <small>{rev.locality} · {rev.project}</small>
                  </div>
                  <span className="review-badge">{rev.badge}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Vzdělávací blok: Jak poznáte poctivou elektroinstalaci */}
      <section className="section sage" id="standardy">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Na čem nešetříme</p>
              <h2>Jak poznáte poctivou elektroinstalaci</h2>
            </div>
            <p>
              Elektřina je po dokončení omítek schovaná ve zdi na dalších 30 až 50 let. Proto se vyplatí vědět, na jaké řemeslné detaily si dát pozor už při hrubých rozvodech.
            </p>
          </div>

          <div className="standards-grid">
            {standards.map((std, idx) => (
              <div key={idx} className="standard-card">
                <h4>{std.title}</h4>
                <p>{std.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fotogalerie detailů řemeslné práce */}
      <Gallery
        eyebrow="Fotogalerie realizací"
        title="Za každým vypínačem je kus práce."
        items={referenceGalleryItems}
        showLabels
        note="Fotografie zachycují reálné řemeslné postupy, rozvaděče a instalace prováděné v souladu s normami ČSN."
      />

      {/* Poptávkový formulář */}
      <InquiryForm
        defaultService="rekonstrukce"
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
      />
    </main>
  )
}
