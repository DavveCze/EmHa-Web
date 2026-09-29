import DetailHero from '../components/DetailHero.jsx'
import AnchorNav from '../components/AnchorNav.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import RelatedServices from '../components/RelatedServices.jsx'
import { ROUTE_SEO } from '../utils/seoData.js'

export default function DataSlaboproud() {
  const faqItems = ROUTE_SEO['/data-a-slaboproud']?.faqs || []

  return (
    <main id="main" tabIndex={-1}>
      <DetailHero
        pageKey="data-a-slaboproud"
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Služby' },
          { label: 'Data a slaboproud' },
        ]}
        eyebrow="Data a slaboproud"
        title={
          <>
            Spolehlivé připojení.
            <br />
            Promyšlené
            <br />
            do každé místnosti.
          </>
        }
        description="Datové zásuvky a domácí síť jako součást promyšlené instalace. Pro práci, zábavu i přípravu na další technologie."
        imageSrc="/assets/renovation.jpg"
        imageAlt="Data a slaboproud — ilustrační vizuál"
        ctaText="Poptat realizaci sítě"
      />

      <AnchorNav />

      <section className="section" id="soucasti">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Co bude součástí</p>
              <h2>
                Síť podle toho,
                <br />
                jak doma fungujete.
              </h2>
            </div>
            <p>
              Při plánování myslete i na pracovní místo, televizi nebo budoucí zabezpečení. Kabelové
              trasy připravíme spolu s dalšími rozvody.
            </p>
          </div>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">01</b>
              <div>
                <h3>Datové rozvody</h3>
                <p>
                  Navrhneme rozmístění datových zásuvek a vedení kabeláže podle potřeb domácnosti.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">02</b>
              <div>
                <h3>Pracovna a multimédia</h3>
                <p>
                  Připravíme připojení pro pracovní stůl, televizi a další vybraná zařízení.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">03</b>
              <div>
                <h3>Umístění síťových prvků</h3>
                <p>
                  Společně určíme vhodné místo pro centrální propojení a síťové vybavení.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">04</b>
              <div>
                <h3>Rezerva do budoucna</h3>
                <p>
                  Promyslíme přípravu pro zabezpečení a případné rozšíření domácí sítě.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section sage" id="detaily">
        <div className="container split">
          <picture>
            <source srcSet="/assets/renovation.webp" type="image/webp" />
            <img
              src="/assets/renovation.jpg"
              alt="Data a slaboproud — ilustrační vizuál"
              loading="lazy"
              decoding="async"
              width="540"
              height="390"
            />
          </picture>
          <div>
            <p className="eyebrow">Promyslíme to spolu</p>
            <h2>
              Na kabely je nejlepší
              <br />
              myslet včas.
            </h2>
            <p>
              Nejvíce možností je před dokončením stěn. I v hotovém bytě ale můžeme projít dostupné
              trasy a hledat vhodné řešení.
            </p>
            <ul className="checklist">
              <li>Pracovní místa a televizní kout</li>
              <li>Umístění routeru a síťového vybavení</li>
              <li>Příprava pro kamery a zabezpečení</li>
              <li>Možnost budoucího rozšíření</li>
            </ul>
          </div>
        </div>
      </section>

      <FaqSection items={faqItems} />

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
        defaultService="data-a-slaboproud"
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
