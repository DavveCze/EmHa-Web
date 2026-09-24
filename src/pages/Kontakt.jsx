import DetailHero from '../components/DetailHero.jsx'
import InquiryForm from '../components/InquiryForm.jsx'

export default function Kontakt() {

  return (
    <main id="main">
      <DetailHero
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Kontakt' },
        ]}
        eyebrow="EmHa Elektro · Ostrava a okolí"
        title={
          <>
            Pojďme probrat
            <br />
            váš projekt.
          </>
        }
        description="Nový dům, rekonstrukce nebo drobná oprava. Napište, co plánujete a kde bude práce probíhat. Úvodní konzultace je zdarma."
        imageSrc="/assets/new-build.jpg"
        imageAlt="Kontakt — ilustrační fotografie"
        editorial
      />

      <section className="section">
        <div className="container split">
          <div>
            <h2>Kontaktní údaje a působení</h2>
            <p>
              Pro byty, rodinné domy i menší opravy. Působíme v Ostravě a celém Moravskoslezském
              kraji. Realizaci v konkrétní lokalitě a termín domluvíme individuálně.
            </p>

            {/*
              VYŽÁDAT OD KLIENTA před produkčním vydáním (CZ-EU-WEB-LEGAL-GATE / § 435 NOZ):
              1. Telefonní číslo pro přímé hovory
              2. Oficiální kontaktní e-mail
              3. IČO podnikatele / firmy
              4. Oficiální sídlo a příslušný živnostenský úřad zápisu
            */}
            <div className="contact-card">
              <h3>Rychlý kontakt</h3>
              <p>
                <strong>Telefon / Mobil:</strong>{' '}
                <a href="tel:+420000000000">+420 [Doplní klient]</a>
                <small>Konzultace a domluva termínů (Po–Pá 8:00–17:00)</small>
              </p>
              <p>
                <strong>E-mail:</strong>{' '}
                <a href="mailto:info@emha-elektro.cz">info@emha-elektro.cz</a>
                <small>Pro zaslání projektů, půdorysů a podkladů</small>
              </p>
              <p>
                <strong>Oblast působení:</strong> Ostrava, Havířov, Frýdek-Místek, Karviná a okolí
              </p>
              <p>
                <strong>Fakturační údaje:</strong> EmHa Elektro · IČO: [Doplní klient před spuštěním]
                <small>Fyzická osoba zapsaná v živnostenském rejstříku dle § 435 NOZ.</small>
              </p>
            </div>
          </div>

          <div>
            <h3>Co uvést do poptávky</h3>
            <ul className="checklist">
              <li>O jakou službu máte zájem (novostavba, rekonstrukce, zabezpečení...)</li>
              <li>Kde bude práce probíhat (město / lokalita)</li>
              <li>Stručný popis a představa o termínu zahájení</li>
              <li>E-mail nebo telefon pro odpověď a upřesnění</li>
            </ul>

            <div className="contact-card" style={{ marginTop: '28px' }}>
              <h3>Nezávazná kalkulace zdarma</h3>
              <p>
                Nemusíte se vyznat v technických detailech. Stačí popsat vaši představu, my
                navrhneme optimální rozsah elektroinstalace a připravíme přehlednou cenovou nabídku.
              </p>
            </div>
          </div>
        </div>
      </section>

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
      />
    </main>
  )
}
