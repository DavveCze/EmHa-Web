import DetailHero from '../components/DetailHero.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import { ROUTE_SEO } from '../utils/seoData.js'

export default function JakPracujeme() {
  const faqItems = ROUTE_SEO['/jak-pracujeme']?.faqs || []

  return (
    <main id="main" tabIndex={-1}>
      <ProcessSection variant="service" isH1={true} />

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
