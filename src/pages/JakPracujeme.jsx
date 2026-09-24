import DetailHero from '../components/DetailHero.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'

export default function JakPracujeme() {
  const faqItems = [
    {
      q: 'Kdy je nejlepší se ozvat?',
      a: 'Ideálně ještě při přípravě projektu. Umístění světel, zásuvek a datových rozvodů je lépe řešit před začátkem instalačních prací.',
    },
    {
      q: 'Co potřebujete pro cenovou nabídku?',
      a: 'Pomůže popis plánovaných prací, lokalita, přibližný termín a případně půdorys nebo fotografie. Podrobnosti probereme při úvodní konzultaci.',
    },
    {
      q: 'Můžeme připravit i chytrou domácnost?',
      a: 'Ano. Už při plánování můžeme promyslet datové rozvody a přípravu na zabezpečení nebo automatizaci. Konkrétní možnosti závisí na vybraném systému.',
    },
  ]

  return (
    <main id="main">
      <DetailHero
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Jak pracujeme' },
        ]}
        eyebrow="Takhle pracujeme"
        title={
          <>
            Jasná domluva.
            <br />
            Promyšlené řešení.
            <br />
            Pečlivá realizace.
          </>
        }
        description="Nemusíte se vyznat v elektřině. Od toho jsme tu my. Projdeme s vámi zadání, možnosti i návaznost jednotlivých prací."
        imageSrc="/assets/hero-v2.jpg"
        imageAlt="Jak pracujeme — ilustrační fotografie"
        editorial
      />

      <ProcessSection variant="service" />

      <section className="section sage">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Před první schůzkou</p>
              <h2>
                Stačí vědět,
                <br />
                co chcete změnit.
              </h2>
            </div>
            <p>
              Všechno nemusíte mít rozhodnuté. Pomůže základní představa, lokalita a případně
              podklady k objektu. Na ostatní se doptáme.
            </p>
          </div>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">01</b>
              <div>
                <h3>Váš záměr</h3>
                <p>
                  Novostavba, rekonstrukce nebo menší oprava. Popište, co řešíte a jak má výsledek
                  sloužit.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">02</b>
              <div>
                <h3>Podklady k prostoru</h3>
                <p>
                  Pokud máte půdorys, projekt nebo fotografie, budou se hodit při následné
                  konzultaci.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">03</b>
              <div>
                <h3>Představa o termínu</h3>
                <p>
                  Domluvíme dostupný termín a návaznost na ostatní práce. Změny si průběžně
                  upřesníme.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">04</b>
              <div>
                <h3>Předání a vysvětlení</h3>
                <p>
                  Projdeme hotovou práci a běžné ovládání. Revizi a dokumentaci řešíme podle rozsahu
                  zakázky.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <FaqSection items={faqItems} />

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
      />
    </main>
  )
}
