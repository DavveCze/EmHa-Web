import DetailHero from '../components/DetailHero.jsx'
import AnchorNav from '../components/AnchorNav.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import RelatedServices from '../components/RelatedServices.jsx'

export default function Zabezpeceni() {
  const faqItems = [
    {
      q: 'Lze zabezpečit i hotový dům?',
      a: 'Ano, podle podmínek lze navrhnout řešení vhodné i do dokončeného interiéru. Konkrétní způsob instalace probereme na místě.',
    },
    {
      q: 'Umí systém reagovat na únik vody?',
      a: 'S kompatibilními čidly, ventilem a správně nastaveným scénářem lze navrhnout automatické uzavření přívodu vody.',
    },
    {
      q: 'Pomůžete s ovládáním?',
      a: 'Při předání projdeme běžné ovládání, aktivaci zabezpečení i význam jednotlivých upozornění.',
    },
  ]

  return (
    <main id="main">
      <DetailHero
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Služby' },
          { label: 'Zabezpečení domácnosti' },
        ]}
        eyebrow="Zabezpečení domácnosti"
        title={
          <>
            Mějte přehled.
            <br />
            Doma i když
            <br />
            jste pryč.
          </>
        }
        description="Alarmy, detektory a kamerové systémy. Ochranu navrhneme podle vašeho domu, bytu nebo menší provozovny."
        imageSrc="/assets/smart-home-v2.jpg"
        imageAlt="Zabezpečení domácnosti — ilustrační vizuál"
      />

      <AnchorNav />

      <section className="section" id="soucasti">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Co bude součástí</p>
              <h2>
                Ochrana, která dává
                <br />
                smysl vašemu domu.
              </h2>
            </div>
            <p>
              Každý prostor má jiná slabá místa. Projdeme vstupy, okna i způsob používání a vybereme
              vhodnou kombinaci prvků.
            </p>
          </div>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">01</b>
              <div>
                <h3>Alarm a detektory</h3>
                <p>
                  Navrhneme zabezpečení vstupů a vybraných prostor. Umístění čidel přizpůsobíme
                  provozu domácnosti.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">02</b>
              <div>
                <h3>Kamerové systémy</h3>
                <p>
                  Probereme vhodné záběry a rozsah sledování. Zohledníme soukromí i praktické
                  možnosti instalace.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">03</b>
              <div>
                <h3>Ovládání a upozornění</h3>
                <p>
                  Ukážeme vám každodenní ovládání a nastavíme upozornění podle domluveného řešení.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">04</b>
              <div>
                <h3>Příprava na rozšíření</h3>
                <p>
                  Zabezpečení lze podle zvolených prvků doplnit o detekci vody, požáru nebo
                  automatizaci.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section sage" id="detaily">
        <div className="container split">
          <picture>
            <source srcSet="/assets/smart-home-v2.webp" type="image/webp" />
            <img
              src="/assets/smart-home-v2.jpg"
              alt="Zabezpečení domácnosti — ilustrační vizuál"
              loading="lazy"
              decoding="async"
              width="540"
              height="390"
            />
          </picture>
          <div>
            <p className="eyebrow">Promyslíme to spolu</p>
            <h2>
              Zabezpečení má být
              <br />
              součástí každého dne.
            </h2>
            <p>
              Nastavení přizpůsobíme tomu, kdo v domácnosti žije a jak ji používá. Ovládání si při
              předání společně projdeme.
            </p>
            <ul className="checklist">
              <li>Vstupy, okna a přístupové cesty</li>
              <li>Domácí zvířata a každodenní režim</li>
              <li>Ovládání jednotlivými členy domácnosti</li>
              <li>Propojení s automatizací</li>
            </ul>
          </div>
        </div>
      </section>

      <ProcessSection variant="service" />

      <FaqSection items={faqItems} />

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
        defaultService="zabezpeceni"
      />

      <RelatedServices
        links={[
          { href: '/rekonstrukce', label: 'Rekonstrukce' },
          { href: '/automatizace', label: 'Automatizace' },
          { href: '/opravy-a-servis', label: 'Opravy a servis' },
        ]}
      />
    </main>
  )
}
