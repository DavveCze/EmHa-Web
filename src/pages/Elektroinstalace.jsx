import DetailHero from '../components/DetailHero.jsx'
import AnchorNav from '../components/AnchorNav.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import RelatedServices from '../components/RelatedServices.jsx'
import { ROUTE_SEO } from '../utils/seoData.js'
import { useContent } from '../context/content-core.js'
import defaultContent from '../data/defaultContent.json'

export default function Elektroinstalace() {
  const { content } = useContent()
  const faqItems = ROUTE_SEO['/elektroinstalace']?.faqs || []
  const pageData = content?.pages?.elektroinstalace || defaultContent?.pages?.elektroinstalace || {}
  const soucasti = pageData.sections?.soucasti
  const detaily = pageData.sections?.detaily
  const pageLinks = pageData.links

  const items = soucasti?.items || [
    { num: '01', title: 'Rozvody a rozvaděč', text: 'Připravíme elektrické rozvody a rozvaděč podle domluveného rozsahu a potřeb vašeho domu.' },
    { num: '02', title: 'Zásuvky a osvětlení', text: 'Společně projdeme umístění zásuvek, vypínačů a světel. Podle nábytku i každodenního provozu.' },
    { num: '03', title: 'Data a příprava do budoucna', text: 'Promyslíme datové zásuvky i přípravu pro zabezpečení nebo chytrou domácnost.' },
    { num: '04', title: 'Dokumentace a revize', text: 'Projektovou dokumentaci a revizi zajistíme ve spolupráci s projektantem a revizním technikem.' },
  ]

  const checklist = detaily?.checklist || [
    'Kuchyň, spotřebiče a pracovní plochy',
    'Světla, vypínače a pohodlné ovládání',
    'Pracovna, internet a datové zásuvky',
    'Příprava na zabezpečení a automatizaci',
  ]

  const links = pageLinks && pageLinks.length > 0 ? pageLinks : [
    { href: '/rekonstrukce', label: 'Rekonstrukce' },
    { href: '/zabezpeceni', label: 'Zabezpečení' },
    { href: '/opravy-a-servis', label: 'Opravy a servis' },
  ]

  return (
    <main id="main" tabIndex={-1}>
      <DetailHero
        pageKey="elektroinstalace"
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
                    Elektroinstalace, která
                    <br />
                    počítá s vaším životem.
                  </>
                )}
              </h2>
            </div>
            <p>
              {soucasti?.description || 'Kde budete vařit, pracovat nebo nabíjet telefon? Dobrá instalace začíná u běžných věcí. Společně z nich uděláme konkrétní plán.'}
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
          <picture>
            {typeof (detaily?.image || '/assets/switch-detail.jpg') === 'string' && (detaily?.image || '/assets/switch-detail.jpg').endsWith('.jpg') && (
              <source srcSet={(detaily?.image || '/assets/switch-detail.jpg').replace(/\.jpg$/, '.webp')} type="image/webp" />
            )}
            <img
              src={detaily?.image || '/assets/switch-detail.jpg'}
              alt={detaily?.imageAlt || 'Detail vypínače v domácnosti — ilustrační vizuál'}
              loading="lazy"
              decoding="async"
              width="540"
              height="390"
            />
          </picture>
          <div>
            <p className="eyebrow">{detaily?.eyebrow || 'Malé detaily. Velký rozdíl.'}</p>
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
                  Než se zavřou zdi,
                  <br />
                  promyslíme to spolu.
                </>
              )}
            </h2>
            <p>
              {detaily?.description || 'Nábytek se dá přestěhovat. Zásuvky už hůř. Proto se ptáme i na to, jak chcete doma skutečně bydlet.'}
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
        defaultService="elektroinstalace"
      />

      <RelatedServices links={links} />
    </main>
  )
}
