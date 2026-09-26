import DetailHero from '../components/DetailHero.jsx'
import AnchorNav from '../components/AnchorNav.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import RelatedServices from '../components/RelatedServices.jsx'
import { ROUTE_SEO } from '../utils/seoData.js'

export default function Rekonstrukce() {
  const faqItems = ROUTE_SEO['/rekonstrukce']?.faqs || []

  return (
    <main id="main">
      <DetailHero
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Služby' },
          { label: 'Rekonstrukce bytů a domů' },
        ]}
        eyebrow="Rekonstrukce bytů a domů"
        title={
          <>
            Staré rozvody.
            <br />
            Nová energie
            <br />
            pro váš domov.
          </>
        }
        description="Novou elektroinstalaci přizpůsobíme tomu, jak doma žijete. Od výměny rozvodů po zásuvky, vypínače a světla."
        imageSrc="/assets/renovation.jpg"
        imageAlt="Rekonstrukce bytů a domů — ilustrační vizuál"
        ctaText="Poptat rekonstrukci elektro"
      />

      <AnchorNav />

      <section className="section" id="soucasti">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Co bude součástí</p>
              <h2>
                Nová elektřina.
                <br />
                Promyšlená od začátku.
              </h2>
            </div>
            <p>
              Rekonstrukce je příležitost upravit instalaci podle současných potřeb. Společně
              projdeme stávající stav, plán místností a návaznost na ostatní práce.
            </p>
          </div>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">01</b>
              <div>
                <h3>Posouzení stávající instalace</h3>
                <p>
                  Projdeme stav rozvodů a domluvíme, co bude potřeba vyměnit. Rozsah stanovíme podle
                  konkrétního objektu.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">02</b>
              <div>
                <h3>Výměna rozvodů a rozvaděče</h3>
                <p>
                  Připravíme novou instalaci podle plánu a koordinujeme její provedení s dalšími
                  řemesly.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">03</b>
              <div>
                <h3>Zásuvky, vypínače a světla</h3>
                <p>
                  Upravíme jejich umístění podle nové kuchyně, nábytku a běžného provozu domácnosti.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">04</b>
              <div>
                <h3>Dokončení a kontrola</h3>
                <p>
                  Osadíme koncové prvky. Potřebnou revizi zajistíme ve spolupráci s revizním
                  technikem.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section sage" id="detaily">
        <div className="container split">
          <img
            src="/assets/renovation.jpg"
            alt="Rekonstrukce bytů a domů — ilustrační vizuál"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">Promyslíme to spolu</p>
            <h2>
              Aby na sebe
              <br />
              všechno navazovalo.
            </h2>
            <p>
              Předem si ujasníme, které místnosti se budou rekonstruovat, kdy dojde na rozvody a co
              musí být hotové před finálním osazením.
            </p>
            <ul className="checklist">
              <li>Rozsah celkové nebo částečné rekonstrukce</li>
              <li>Návaznost na zedníky a další řemesla</li>
              <li>Nová kuchyň a umístění spotřebičů</li>
              <li>Rezerva pro budoucí změny</li>
            </ul>
          </div>
        </div>
      </section>

      <FaqSection items={faqItems} />

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
        defaultService="rekonstrukce"
      />

      <RelatedServices
        links={[
          { href: '/elektroinstalace', label: 'Elektroinstalace' },
          { href: '/zabezpeceni', label: 'Zabezpečení' },
          { href: '/opravy-a-servis', label: 'Opravy a servis' },
        ]}
      />
    </main>
  )
}
