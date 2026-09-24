import { useNavigation } from '../context/navigation-core.js'
import DetailHero from '../components/DetailHero.jsx'
import AnchorNav from '../components/AnchorNav.jsx'
import AutomationDiagram from '../components/AutomationDiagram.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import RelatedServices from '../components/RelatedServices.jsx'

export default function Automatizace() {
  const { navigate } = useNavigation()
  const navItems = [
    { href: '#jak-to-funguje', number: '01', label: 'Jak to funguje' },
    { href: '#moznosti', number: '02', label: 'Možnosti systému' },
    { href: '#jeden-system', number: '03', label: 'Jeden systém' },
  ]

  return (
    <main id="main">
      <DetailHero
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Služby' },
          { label: 'Automatizace chytré domácnosti' },
        ]}
        eyebrow="Automatizace chytré domácnosti"
        title={
          <>
            Víc než zabezpečení.
            <br />
            Domov, který dokáže
            <br />
            reagovat.
          </>
        }
        description="Bezpečnost na prvním místě. Komfort navíc. Propojte ochranu domácnosti s promyšlenými scénáři systému Ajax."
        imageSrc="/assets/smart-home-v2.jpg"
        imageAlt="Automatizace chytré domácnosti — ilustrační vizuál"
      />

      <AnchorNav items={navItems} />

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Když upozornění nestačí</p>
            <h2>
              Systém, který
              <br />
              dokáže reagovat
            </h2>
          </div>
          <div>
            <p>
              Moderní zabezpečení nemusí jen upozornit, že se něco děje. Systém Ajax lze rozšířit o
              prvky automatizace, díky kterým může domácnost nebo objekt na vybrané situace reagovat.
            </p>
            <p>
              Při detekci úniku vody může systém automaticky uzavřít přívod, nebo v případě požáru se
              automaticky vypnou elektrická zařízení.
            </p>
          </div>
        </div>
      </section>

      <AutomationDiagram />

      <section className="section" id="moznosti">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Bezpečnost na prvním místě</p>
              <h2>
                Komfort navíc
                <br />
                každý den
              </h2>
            </div>
            <p>
              Automatizace vychází především ze zabezpečovacího systému, ale její možnosti tím
              nekončí. Vybraná zařízení lze ovládat vzdáleně z aplikace nebo jejich fungování
              naplánovat podle času a běžného režimu domácnosti.
            </p>
          </div>

          <div className="numbered-grid automation-benefits">
            <article>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="m13 2-9 12h7l-1 8 10-13h-7z" />
              </svg>
              <div>
                <h3>Odcházíte z domu?</h3>
                <p>Aktivací zabezpečení se mohou automaticky vypnout vybrané zásuvky.</p>
              </div>
            </article>

            <article>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13z" />
              </svg>
              <div>
                <h3>Systém zjistí únik vody?</h3>
                <p>
                  Automatický ventil může zavřít přívod vody dříve, než vzniknou větší škody.
                </p>
              </div>
            </article>

            <article>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM7 11l3 3 7-7" />
              </svg>
              <div>
                <h3>Detektor zaznamená nebezpečí?</h3>
                <p>Na poplach může navázat předem nastavená reakce dalších prvků systému.</p>
              </div>
            </article>

            <article>
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="m2 11 10-9 10 9M5 9v13h5v-8h4v8h5V9M16 5V2h3v6" />
              </svg>
              <div>
                <h3>Každý den stejná rutina?</h3>
                <p>
                  Vybrané zásuvky, světla nebo další zařízení lze ovládat podle nastaveného scénáře a
                  času.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

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
              href="/zabezpeceni"
              onClick={(e) => {
                e.preventDefault()
                navigate('/zabezpeceni')
              }}
              title="Přejít na službu Zabezpečení domácnosti"
            >
              Zabezpečení ↗
            </a>
            <a
              href="#moznosti"
              onClick={(e) => {
                e.preventDefault()
                navigate('#moznosti')
              }}
              title="Zobrazit možnosti detekce požáru"
            >
              Detekce požáru ↓
            </a>
            <a
              href="#moznosti"
              onClick={(e) => {
                e.preventDefault()
                navigate('#moznosti')
              }}
              title="Zobrazit možnosti ochrany před únikem vody"
            >
              Ochrana před vodou ↓
            </a>
            <a
              href="#jak-to-funguje"
              onClick={(e) => {
                e.preventDefault()
                navigate('#jak-to-funguje')
              }}
              title="Zobrazit schéma automatizace"
            >
              Automatizace ↑
            </a>
          </div>
        </div>
      </section>

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
        defaultService="automatizace"
      />

      <RelatedServices
        links={[
          { href: '/rekonstrukce', label: 'Rekonstrukce' },
          { href: '/zabezpeceni', label: 'Zabezpečení' },
          { href: '/opravy-a-servis', label: 'Opravy a servis' },
        ]}
      />
    </main>
  )
}
