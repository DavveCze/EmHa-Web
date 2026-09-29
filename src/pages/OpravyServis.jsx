import DetailHero from '../components/DetailHero.jsx'
import AnchorNav from '../components/AnchorNav.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import RelatedServices from '../components/RelatedServices.jsx'
import { ROUTE_SEO } from '../utils/seoData.js'

export default function OpravyServis() {
  const faqItems = ROUTE_SEO['/opravy-a-servis']?.faqs || []

  return (
    <main id="main">
      <DetailHero
        pageKey="opravy-a-servis"
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Služby' },
          { label: 'Opravy a servis' },
        ]}
        eyebrow="Opravy a servis"
        title={
          <>
            I drobná oprava
            <br />
            si zaslouží
            <br />
            poctivou práci.
          </>
        }
        description="Nefunkční zásuvka, vypínač nebo světlo? Popište nám problém a domluvíme další postup."
        imageSrc="/assets/switch.jpg"
        imageAlt="Opravy a servis — ilustrační vizuál"
        ctaText="Poptat opravu či servis"
      />

      <AnchorNav />

      <section className="section" id="soucasti">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Co bude součástí</p>
              <h2>
                Od závady
                <br />
                k funkčnímu řešení.
              </h2>
            </div>
            <p>
              Nejdřív zjistíme příčinu problému. Rozsah opravy vám vysvětlíme a domluvíme se na
              vhodném řešení.
            </p>
          </div>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">01</b>
              <div>
                <h3>Zásuvky a vypínače</h3>
                <p>
                  Zkontrolujeme problematické místo a podle stavu provedeme opravu nebo výměnu.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">02</b>
              <div>
                <h3>Svítidla a osvětlení</h3>
                <p>
                  Pomůžeme s výměnou či zapojením svítidel a s drobnými úpravami osvětlení.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">03</b>
              <div>
                <h3>Hledání závad</h3>
                <p>
                  Prověříme popsanou poruchu a navrhneme opravu odpovídající stavu instalace.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">04</b>
              <div>
                <h3>Drobné úpravy</h3>
                <p>
                  Probereme přesunutí nebo doplnění prvků a možnosti stávajících rozvodů.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section sage" id="detaily">
        <div className="container split">
          <picture>
            <source srcSet="/assets/switch.webp" type="image/webp" />
            <img
              src="/assets/switch.jpg"
              alt="Opravy a servis — ilustrační vizuál"
              loading="lazy"
              decoding="async"
              width="540"
              height="390"
            />
          </picture>
          <div>
            <p className="eyebrow">Promyslíme to spolu</p>
            <h2>
              Popište nám,
              <br />
              co nefunguje.
            </h2>
            <p>
              Pomůže, když uvedete, kde závada vzniká, kdy jste si jí všimli a zda se opakuje.
              Termín i rozsah domluvíme individuálně.
            </p>
            <ul className="checklist">
              <li>Popis závady a postiženého místa</li>
              <li>Lokalita a dostupnost objektu</li>
              <li>Fotografie viditelného problému, je-li k dispozici</li>
              <li>Předchozí úpravy elektroinstalace</li>
            </ul>
          </div>
        </div>
      </section>

      <FaqSection items={faqItems} />

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
        defaultService="opravy-a-servis"
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
