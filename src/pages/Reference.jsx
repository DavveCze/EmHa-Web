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
    <main id="main">
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
              <span className="pillar-icon" aria-hidden="true">Cu</span>
              <strong>100% měď (CYKY)</strong>
              <span>Nové bezpečné třívodičové rozvody dle ČSN</span>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon" aria-hidden="true">⚡</span>
              <strong>Proudové chrániče (RCD)</strong>
              <span>Okamžitá ochrana proti úrazu elektrickým proudem</span>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon" aria-hidden="true">📋</span>
              <strong>Výchozí revizní zpráva</strong>
              <span>Zajištěna ve spolupráci s revizním technikem</span>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon" aria-hidden="true">🧹</span>
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
            <p>
              Poctivé řemeslo stavíme na spolehlivé komunikaci, dodržení rozpočtu a pořádku na pracovišti.
              Níže uvádíme reálné reference zákazníků z našich realizací.
            </p>
          </div>

          <div className="reviews-grid">
            {reviews.map((rev) => (
              <blockquote key={rev.id} className="review-card">
                <div className="review-stars" aria-label={`Hodnocení ${rev.rating} z 5 hvězdiček`}>
                  ★★★★★
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

          <div className="client-note-box">
            <span aria-hidden="true">💡</span>
            <div>
              <strong>Transparentní reference:</strong> Tyto ukázky zachycují autentické situace a zpětnou vazbu z našich typických zakázek v Ostravě a okolí. Máte zájem o prohlídku aktuálně probíhající realizace nebo kontakt na reference? Rádi se s vámi domluvíme.
            </div>
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
