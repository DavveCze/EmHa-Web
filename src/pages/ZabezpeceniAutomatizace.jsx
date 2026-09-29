import { useNavigation } from '../context/navigation-core.js'
import DetailHero from '../components/DetailHero.jsx'
import AnchorNav from '../components/AnchorNav.jsx'
import AutomationDiagram from '../components/AutomationDiagram.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import RelatedServices from '../components/RelatedServices.jsx'

export default function ZabezpeceniAutomatizace() {
  const { navigate } = useNavigation()
  const navItems = [
    { href: '#prehled', number: '01', label: 'Co systém umí' },
    { href: '#scenare', number: '02', label: 'Chytré scénáře' },
    { href: '#schema', number: '03', label: 'Schéma zapojení' },
    { href: '#postup', number: '04', label: 'Průběh instalace' },
  ]

  const faqItems = [
    {
      q: 'Lze zabezpečení a automatizaci instalovat i do hotového bytu či domu?',
      a: 'Ano, moderní bezdrátové prvky Ajax lze instalovat čistě a bez sekání i do zařízeného interiéru. Při rekonstrukci nebo novostavbě naopak rádi připravíme skrytou kabeláž.',
    },
    {
      q: 'Jak funguje automatické uzavření vody při havárii?',
      a: 'Při kontaktu bezdrátového čidla s vodou pošle systém signál do chytrého ventilu na hlavním přívodu vody, který se během několika sekund uzavře a do mobilu vám dorazí okamžitá notifikace.',
    },
    {
      q: 'Zvládne systém ovládat celá rodina?',
      a: 'Ano, ovládání je intuitivní v české mobilní aplikaci, pomocí klíčenek s tlačítkem nebo kódovou klávesnicí u vchodu. Při předání vše společně nastavíme a vysvětlíme.',
    },
    {
      q: 'Co se stane při výpadku elektřiny nebo internetu?',
      a: 'Centrální jednotka má záložní baterii s výdrží mnoha hodin a kromě Wi-Fi/LAN připojení disponuje i slotem na SIM kartu pro nezávislou mobilní síť.',
    },
  ]

  return (
    <main id="main" tabIndex={-1}>
      <DetailHero
        pageKey="zabezpeceni-a-automatizace"
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Služby' },
          { label: 'Zabezpečení a automatizace' },
        ]}
        eyebrow="Zabezpečení a automatizace domácnosti"
        title={
          <>
            Chraňte svůj domov.
            <br />
            A nechte ho
            <br />
            reagovat.
          </>
        }
        description="Spolehlivý zabezpečovací systém Ajax propojený s chytrou automatizací. Ochrana před vloupáním, požárem i vytopením s pohodlným ovládáním v jedné aplikaci."
        imageSrc="/assets/smart-home-v2.jpg"
        imageAlt="Zabezpečení a automatizace domácnosti — ilustrační vizuál"
      />

      <AnchorNav items={navItems} />

      {/* 01: Co systém umí */}
      <section className="section" id="prehled">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Komplexní ochrana</p>
              <h2>
                Ochrana, která dává
                <br />
                smysl vašemu domu.
              </h2>
            </div>
            <p>
              Každý dům i byt má jiná slabá místa a jiný denní režim. Projdeme vstupy, okna,
              technickou místnost i garáž a navrhneme sestavu čidel tak, aby vás chránila,
              ale neomezovala v běžném životě.
            </p>
          </div>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">01</b>
              <div>
                <h3>Alarm a detektory pohybu</h3>
                <p>
                  Čidla otevření oken a dveří, prostorové detektory s ignorováním domácích mazlíčků
                  a vnitřní i venkovní sirény.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">02</b>
              <div>
                <h3>Ochrana před vodou a požárem</h3>
                <p>
                  Kouřová čidla s teplotním senzorem a detektory úniku vody s možností automatického
                  uzavření hlavního přívodu.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">03</b>
              <div>
                <h3>Kamerové ověření a fotoverifikace</h3>
                <p>
                  Pohybová čidla s vestavěnou kamerou vám při poplachu okamžitě zašlou sérii fotografií,
                  takže ihned víte, co se doma děje.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">04</b>
              <div>
                <h3>Mobilní aplikace v češtině</h3>
                <p>
                  Aktivace stiskem jednoho tlačítka, přehled o stavu baterií i teplotách v místnostech
                  a okamžité notifikace při jakékoli události.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 02: Chytré scénáře */}
      <section className="section sage" id="scenare">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Když upozornění nestačí</p>
              <h2>
                Automatizace, která
                <br />
                dokáže zakročit.
              </h2>
            </div>
            <p>
              Moderní zabezpečení nemusí jen poslat notifikaci, že došlo k problému. Díky chytrým
              scénářům dokáže systém Ajax okamžitě jednat a minimalizovat škody dříve, než dorazíte domů.
            </p>
          </div>

          <div className="numbered-grid automation-benefits">
            <article>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13z" />
              </svg>
              <div>
                <h3>Systém zjistí únik vody?</h3>
                <p>
                  Chytrý motorický ventil uzavře hlavní přívod vody během několika sekund a zabrání vytopení.
                </p>
              </div>
            </article>

            <article>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="m13 2-9 12h7l-1 8 10-13h-7z" />
              </svg>
              <div>
                <h3>Odcházíte z domu?</h3>
                <p>
                  Při zapnutí alarmu se automaticky odpojí vybrané zásuvky s žehličkou či kávovarem.
                </p>
              </div>
            </article>

            <article>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM7 11l3 3 7-7" />
              </svg>
              <div>
                <h3>Detekce kouře nebo požáru?</h3>
                <p>
                  Kromě sirény systém odpojí ventilaci a přívod elektřiny pro zamezení šíření ohně.
                </p>
              </div>
            </article>

            <article>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="m2 11 10-9 10 9M5 9v13h5v-8h4v8h5V9M16 5V2h3v6" />
              </svg>
              <div>
                <h3>Simulace přítomnosti na dovolené?</h3>
                <p>
                  Světla v interiéru se mohou v nastavených časech rozsvěcet, aby dům nepůsobil opuštěně.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 03: Systémové schéma */}
      <div id="schema">
        <AutomationDiagram />
      </div>

      <section className="dark-band" id="jeden-system">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Propojená ochrana</p>
              <h2>
                Jeden systém, několik
                <br />
                vrstev ochrany.
              </h2>
            </div>
            <p>
              Zabezpečení, detekce požáru, ochrana před únikem vody a automatizace nemusí fungovat
              odděleně. Mohou spolupracovat v rámci jednoho systému a reagovat podle předem
              definovaných scénářů.
            </p>
          </div>

          <div className="system-labels">
            <a
              href="#prehled"
              onClick={(e) => {
                e.preventDefault()
                navigate('#prehled')
              }}
              title="Přejít na přehled zabezpečení"
            >
              Zabezpečení ↑
            </a>
            <a
              href="#scenare"
              onClick={(e) => {
                e.preventDefault()
                navigate('#scenare')
              }}
              title="Zobrazit možnosti detekce požáru"
            >
              Detekce požáru ↑
            </a>
            <a
              href="#scenare"
              onClick={(e) => {
                e.preventDefault()
                navigate('#scenare')
              }}
              title="Zobrazit možnosti ochrany před únikem vody"
            >
              Ochrana před vodou ↑
            </a>
            <a
              href="#schema"
              onClick={(e) => {
                e.preventDefault()
                navigate('#schema')
              }}
              title="Zobrazit schéma automatizace"
            >
              Automatizace ↑
            </a>
          </div>
        </div>
      </section>

      {/* 04: Průběh instalace */}
      <section id="postup">
        <ProcessSection variant="service" />
      </section>

      <FaqSection items={faqItems} />

      <InquiryForm
        defaultService="zabezpeceni-a-automatizace"
        title="S čím Vám pomůžeme?"
      />

      <RelatedServices
        links={[
          { href: '/rekonstrukce', label: 'Rekonstrukce' },
          { href: '/na-co-myslet-pri-rekonstrukcich', label: 'Na co myslet při rekonstrukcích' },
          { href: '/data-a-slaboproud', label: 'Data a slaboproud' },
        ]}
      />
    </main>
  )
}
