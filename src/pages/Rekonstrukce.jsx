import DetailHero from '../components/DetailHero.jsx'
import AnchorNav from '../components/AnchorNav.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import RelatedServices from '../components/RelatedServices.jsx'
import { ROUTE_SEO } from '../utils/seoData.js'
import { useContent } from '../context/content-core.js'
import defaultContent from '../data/defaultContent.json'

export default function Rekonstrukce() {
  const { content } = useContent()
  const faqItems = ROUTE_SEO['/rekonstrukce']?.faqs || []
  const pageData = content?.pages?.rekonstrukce || defaultContent?.pages?.rekonstrukce || {}
  const soucasti = pageData.sections?.soucasti
  const detaily = pageData.sections?.detaily
  const pageLinks = pageData.links

  const items = soucasti?.items || [
    { num: '01', title: 'Posouzení stávající instalace', text: 'Projdeme stav rozvodů a domluvíme, co bude potřeba vyměnit. Rozsah stanovíme podle konkrétního objektu.' },
    { num: '02', title: 'Výměna rozvodů a rozvaděče', text: 'Připravíme novou instalaci podle plánu a koordinujeme její provedení s dalšími řemesly.' },
    { num: '03', title: 'Zásuvky, vypínače a světla', text: 'Upravíme jejich umístění podle nové kuchyně, nábytku a běžného provozu domácnosti.' },
    { num: '04', title: 'Dokončení a kontrola', text: 'Osadíme koncové prvky. Potřebnou revizi zajistíme ve spolupráci s revizním technikem.' },
  ]

  const checklist = detaily?.checklist || [
    'Rozsah celkové nebo částečné rekonstrukce',
    'Návaznost na zedníky a další řemesla',
    'Nová kuchyň a umístění spotřebičů',
    'Rezerva pro budoucí změny',
  ]

  const links = pageLinks && pageLinks.length > 0 ? pageLinks : [
    { href: '/elektroinstalace', label: 'Elektroinstalace' },
    { href: '/zabezpeceni', label: 'Zabezpečení' },
    { href: '/opravy-a-servis', label: 'Opravy a servis' },
  ]

  return (
    <main id="main">
      <DetailHero
        pageKey="rekonstrukce"
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
              <p className="eyebrow">{soucasti?.eyebrow || 'Co bude součástí'}</p>
              <h2>
                {soucasti?.title ? (
                  typeof soucasti.title === 'string' && soucasti.title.includes('\n') ? (
                    soucasti.title.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))
                  ) : soucasti.title
                ) : (
                  <>
                    Nová elektřina.
                    <br />
                    Promyšlená od začátku.
                  </>
                )}
              </h2>
            </div>
            <p>
              {soucasti?.description || 'Rekonstrukce je příležitost upravit instalaci podle současných potřeb. Společně projdeme stávající stav, plán místností a návaznost na ostatní práce.'}
            </p>
          </div>

          <div className="numbered-grid">
            {items.map((item, idx) => (
              <article key={idx}>
                <b aria-hidden="true">{item.num || `0${idx + 1}`}</b>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section sage" id="detaily">
        <div className="container split">
          <img
            src={detaily?.image || '/assets/renovation.jpg'}
            alt={detaily?.imageAlt || 'Rekonstrukce bytů a domů — ilustrační vizuál'}
            loading="lazy"
          />
          <div>
            <p className="eyebrow">{detaily?.eyebrow || 'Promyslíme to spolu'}</p>
            <h2>
              {detaily?.title ? (
                typeof detaily.title === 'string' && detaily.title.includes('\n') ? (
                  detaily.title.split('\n').map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))
                ) : detaily.title
              ) : (
                <>
                  Aby na sebe
                  <br />
                  všechno navazovalo.
                </>
              )}
            </h2>
            <p>
              {detaily?.description || 'Předem si ujasníme, které místnosti se budou rekonstruovat, kdy dojde na rozvody a co musí být hotové před finálním osazením.'}
            </p>
            <ul className="checklist">
              {checklist.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
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

      <RelatedServices links={links} />
    </main>
  )
}
