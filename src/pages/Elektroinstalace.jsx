import DetailHero from '../components/DetailHero.jsx'
import AnchorNav from '../components/AnchorNav.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import RelatedServices from '../components/RelatedServices.jsx'
import { ROUTE_SEO } from '../utils/seoData.js'

export default function Elektroinstalace() {
  const faqItems = ROUTE_SEO['/elektroinstalace']?.faqs || []

  return (
    <main id="main">
      <DetailHero
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Služby' },
          { label: 'Elektroinstalace v novostavbách' },
        ]}
        eyebrow="Elektroinstalace v novostavbách"
        title={
          <>
            Nový domov.
            <br />
            Elektřina promyšlená
            <br />
            do poslední zásuvky.
          </>
        }
        description="Kompletní elektroinstalace pro rodinné domy a byty. Od prvního plánu až po světlo, které večer rozsvítíte."
        imageSrc="/assets/switch.jpg"
        imageAlt="Elektroinstalace v novostavbách — ilustrační vizuál"
        caption="Od hrubých rozvodů po finální osazení."
      />

      <AnchorNav />

      <section className="section" id="soucasti">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Co bude součástí</p>
              <h2>
                Elektroinstalace, která
                <br />
                počítá s vaším životem.
              </h2>
            </div>
            <p>
              Kde budete vařit, pracovat nebo nabíjet telefon?
              <br />
              Dobrá instalace začíná u běžných věcí. Společně
              <br />
              z nich uděláme konkrétní plán.
            </p>
          </div>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">01</b>
              <div>
                <h3>Rozvody a rozvaděč</h3>
                <p>
                  Připravíme elektrické rozvody a rozvaděč podle domluveného rozsahu a potřeb vašeho
                  domu.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">02</b>
              <div>
                <h3>Zásuvky a osvětlení</h3>
                <p>
                  Společně projdeme umístění zásuvek, vypínačů a světel. Podle nábytku i
                  každodenního provozu.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">03</b>
              <div>
                <h3>Data a příprava do budoucna</h3>
                <p>
                  Promyslíme datové zásuvky i přípravu pro zabezpečení nebo chytrou domácnost.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">04</b>
              <div>
                <h3>Dokumentace a revize</h3>
                <p>
                  Projektovou dokumentaci a revizi zajistíme ve spolupráci s projektantem a revizním
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
            src="/assets/switch-detail.jpg"
            alt="Detail vypínače v domácnosti — ilustrační vizuál"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">Malé detaily. Velký rozdíl.</p>
            <h2>
              Než se zavřou zdi,
              <br />
              promyslíme to spolu.
            </h2>
            <p>
              Nábytek se dá přestěhovat. Zásuvky už hůř. Proto se ptáme i na to, jak chcete doma
              skutečně bydlet.
            </p>
            <ul className="checklist">
              <li>Kuchyň, spotřebiče a pracovní plochy</li>
              <li>Světla, vypínače a pohodlné ovládání</li>
              <li>Pracovna, internet a datové zásuvky</li>
              <li>Příprava na zabezpečení a automatizaci</li>
            </ul>
          </div>
        </div>
      </section>

      <ProcessSection variant="service" />

      <FaqSection items={faqItems} />

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
        defaultService="elektroinstalace"
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
