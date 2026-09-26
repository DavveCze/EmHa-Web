import DetailHero from '../components/DetailHero.jsx'
import Gallery from '../components/Gallery.jsx'
import InquiryForm from '../components/InquiryForm.jsx'

export default function Reference() {
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

  const caseStudies = [
    {
      id: 'poruba-byt',
      title: 'Kompletní rekonstrukce elektroinstalace bytu 3+1',
      badge: 'Panelový byt · Rekonstrukce',
      image: '/assets/renovation.jpg',
      imageAlt: 'Nové měděné rozvody v panelovém bytě Ostrava',
      locality: 'Ostrava – Poruba',
      scope: 'Kompletní výměna rozvodů, nový bytový rozvaděč, datové kabely',
      originalState:
        'Původní dvoudrátové hliníkové rozvody (TN-C) z 70. let, chybějící proudové chrániče a časté přetěžování okruhů při současném chodu pračky a rychlovarné konvice.',
      solution:
        'Frézování nových instalačních tras s průmyslovým odsáváním prachu. Nové měděné kabely CYKY, samostatné 16A jištění pro kuchyňské spotřebiče (indukce, trouba, myčka, pračka). Domovní rozvaděč Hager s proudovými chrániči a přepěťovou ochranou T2. Datové rozvody Cat6 svedené do multimediálního bodu v předsíni.',
      duration: '4 dny hrubé rozvody + 1 den kompletace',
      status: 'Předáno včetně výchozí revize',
    },
    {
      id: 'vratimov-dum',
      title: 'Elektroinstalace novostavby rodinného domu',
      badge: 'Rodinný dům · Novostavba',
      image: '/assets/new-build.jpg',
      imageAlt: 'Elektroinstalace rodinného domu v Moravskoslezském kraji',
      locality: 'Vratimov / Frýdek-Místek',
      scope: 'Silnoproud, slaboproud, venkovní osvětlení, příprava pro alarm Ajax a wallbox',
      originalState:
        'Hrubá stavba před vnitřními omítkami a litými anhydritovými podlahami, požadavek na flexibilní kabeláž připravenou pro moderní technologie.',
      solution:
        'Centrální rozvaděč s 30% modulární rezervou pro budoucí technologie. Samostatný 3fázový přívod do garáže pro budoucí nabíjecí stanici elektromobilu (wallbox). Kabelová příprava pro venkovní fasádní a zahradní osvětlení na soumrakové spínače. Strukturovaná kabeláž Cat6 pro Wi-Fi přístupové body (PoE) a instalace bezdrátového zabezpečení Ajax.',
      duration: 'Fázováno dle harmonogramu stavby (2 etapy)',
      status: 'Předáno ke kolaudaci',
    },
    {
      id: 'havirov-rozvadec',
      title: 'Výměna hlavního rozvaděče a nová kuchyňská instalace',
      badge: 'Bytový dům · Modernizace',
      image: '/assets/panel-detail.jpg',
      imageAlt: 'Nový přehledně popsaný rozvaděč s jističi a chrániči',
      locality: 'Havířov – Město',
      scope: 'Výměna staré pojistkové skříně za moderní rozvodnici, přívod pro indukci',
      originalState:
        'Původní keramické tavné pojistky na chodbě, nevyhovující průřezy vodičů a nemožnost připojit nově zakoupenou indukční varnou desku.',
      solution:
        'Vyřezání původního krytu a osazení moderní zapuštěné rozvodnice s jističi Eaton a kombinovaným proudovým chráničem. Dotažení nového 3fázového přívodu pro indukci v chráničce, montáž přepěťové ochrany. Všechny jističe přehledně označeny podle jednotlivých místností a spotřebičů.',
      duration: '1,5 pracovního dne',
      status: 'Dokončeno bez omezení provozu domácnosti',
    },
    {
      id: 'centrum-cihla',
      title: 'Rekonstrukce rozvodů v cihlovém bytě 2+kk',
      badge: 'Cihlový dům · Šetrná instalace',
      image: '/assets/switch-detail.jpg',
      imageAlt: 'Kompletace designových vypínačů a zásuvek',
      locality: 'Ostrava – centrum',
      scope: 'Kompletní výměna instalace, nepřímé LED osvětlení, designové vypínače',
      originalState:
        'Vysoké stropy, degradovaná textilní izolace vodičů v trubkách, pouze 1–2 zásuvky na místnost a absence ochranného vodiče.',
      solution:
        'Využití podlahových a podhledových tras pro minimalizaci zásahů do původních omítek. Zvýšení počtu zásuvek na 6–8 na místnost s ohledem na domácí pracovnu. Návrh stmívatelných LED linií v obývacím pokoji a osazení moderních rámečků Schneider v matném provedení.',
      duration: '3 dny rozvody + 1 den kompletace',
      status: 'Předáno v čistém stavu',
    },
  ]

  /*
   * Klientská hodnocení / Placeholdery recenzí:
   * Realistické ukázky zpětné vazby odrážející typické obavy zákazníků (termíny, prach, cena, koordinace).
   * Připraveno pro klienta k přímému nahrazení ostrými recenzemi ze Seznamu / Google profilu.
   */
  const reviews = [
    {
      id: 'rev-1',
      name: 'Marek K.',
      locality: 'Ostrava – Poruba',
      project: 'Rekonstrukce bytu 3+1',
      rating: 5,
      text: 'Největší obavu jsme měli z prachu v paneláku a z toho, jak se elektrikář sladí se zedníky. Pan Hořčica dodržel přesně domluvený časový harmonogram, drážkování odsávali a v kuchyni navrhl samostatné okruhy, takže už nám nevypadávají jističe při zapnutí konvice a trouby. Skvělá a čistá práce.',
      badge: 'Ověřená poptávka',
    },
    {
      id: 'rev-2',
      name: 'Ing. Tomáš B. a Lucie B.',
      locality: 'Frýdek-Místek',
      project: 'Elektroinstalace rodinného domu',
      rating: 5,
      text: 'Oceňujeme především praktické rady ještě před začátkem sekání. Upozornil nás na věci, na které jsme vůbec nemysleli – zásuvka na terase pro gril, datový kabel přímo k TV nebo příprava na venkovní žaluzie. Žádné vícenáklady, cena seděla přesně podle nabídky.',
      badge: 'Novostavba RD',
    },
    {
      id: 'rev-3',
      name: 'Pavel D.',
      locality: 'Ostrava – Jih',
      project: 'Výměna rozvaděče a nová kuchyň',
      rating: 5,
      text: 'Staré hliníkové dráty a keramické pojistky byly pro novou kuchyň nebezpečné. Nový rozvaděč je precizně uspořádaný, každý jistič má jasný štítek s popisem místnosti a revizní zprávu jsme měli připravenou bez jakýchkoliv průtahů.',
      badge: 'Rozvaděč & Kuchyň',
    },
    {
      id: 'rev-4',
      name: 'Jana M.',
      locality: 'Havířov',
      project: 'Oprava rozvodů a zabezpečení bytu',
      rating: 5,
      text: 'Kromě nových zásuvek v koupelně a kuchyni nám pan Hořčica nainstaloval a nastavil bezdrátový alarm Ajax. Všechno máme v jedné mobilní aplikaci a ovládání nám trpělivě a srozumitelně vysvětlil. Výborná komunikace i po předání zakázky.',
      badge: 'Elektro + Ajax',
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
                  <img src={item.image} alt={item.imageAlt} loading="lazy" width="540" height="220" />
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
