import { useNavigation } from '../context/navigation-core.js'
import { useContent } from '../context/content-core.js'
import defaultContent from '../data/defaultContent.json'
import HeroSlider from '../components/HeroSlider.jsx'
import ProcessSection from '../components/ProcessSection.jsx'
import Gallery from '../components/Gallery.jsx'
import InquiryForm from '../components/InquiryForm.jsx'

export default function Home() {
  const { navigate } = useNavigation()
  const { content } = useContent()
  const homeData = content?.pages?.home || defaultContent?.pages?.home || {}
  const benefits = homeData.benefits || [
    { title: 'Od návrhu po dokončení', text: 'Vše potřebné pro vaši elektroinstalaci.' },
    { title: 'Konzultace zdarma', text: 'Nejdřív si společně projdeme váš záměr.' },
    { title: 'Ostrava a okolí', text: 'Pro byty, rodinné domy i menší opravy.' },
  ]
  const servicesHeading = homeData.servicesHeading || {
    title: 'S čím vám pomůžeme?',
    subtitle: 'Vyberte, co právě řešíte.',
  }
  const feature = homeData.sections?.feature
  const reviews = (content?.reviews || defaultContent.reviews).filter((r) => r.active !== false).slice(0, 2)

  const handleLink = (e, path) => {
    e.preventDefault()
    navigate(path)
  }

  return (
    <main id="main" tabIndex={-1}>
      <HeroSlider />

      <section className="intro container" aria-label="Naše výhody">
        <div className="benefits">
          {benefits.map((b, idx) => (
            <div key={idx}>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>

        <div className="service-heading">
          <h2>{servicesHeading.title}</h2>
          <p>{servicesHeading.subtitle}</p>
        </div>

        <div className="service-tiles">
          <a
            className="service-tile"
            href="/elektroinstalace"
            onClick={(e) => handleLink(e, '/elektroinstalace')}
          >
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="m13 2-9 12h7l-1 8 10-13h-7z" />
            </svg>
            <span>
              <strong>Elektroinstalace</strong>
              <span>Rozvody pro nový domov</span>
            </span>
            <span className="arrow">↗</span>
          </a>

          <a
            className="service-tile"
            href="/rekonstrukce"
            onClick={(e) => handleLink(e, '/rekonstrukce')}
          >
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="m2 11 10-9 10 9M5 9v13h5v-8h4v8h5V9M16 5V2h3v6" />
            </svg>
            <span>
              <strong>Rekonstrukce</strong>
              <span>Nová elektřina ve stávajícím bydlení</span>
            </span>
            <span className="arrow">↗</span>
          </a>

          <a
            className="service-tile"
            href="/zabezpeceni"
            onClick={(e) => handleLink(e, '/zabezpeceni')}
          >
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM7 11l3 3 7-7" />
            </svg>
            <span>
              <strong>Zabezpečení</strong>
              <span>Alarmy a kamerové systémy</span>
            </span>
            <span className="arrow">↗</span>
          </a>
        </div>
      </section>

      <section className="section sage">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{feature?.eyebrow || 'Elektroinstalace od základu'}</p>
              <h2>
                {feature?.title ? (
                  typeof feature.title === 'string' && feature.title.includes('\n') ? (
                    feature.title.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))
                  ) : feature.title
                ) : (
                  <>
                    Od rozvodů
                    <br />
                    po poslední zásuvku.
                  </>
                )}
              </h2>
            </div>
            <p>
              {feature?.description ? (
                typeof feature.description === 'string' && feature.description.includes('\n') ? (
                  feature.description.split('\n').map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))
                ) : feature.description
              ) : (
                <>
                  Kam přijde lampa? A kde bude stůl?
                  <br />
                  Projdeme s vámi i běžné detaily,
                  <br />
                  aby zásuvky byly tam, kde je potřebujete.
                </>
              )}
            </p>
          </div>

          <div className="feature-cards">
            <a
              className="feature-card"
              href="/elektroinstalace"
              onClick={(e) => handleLink(e, '/elektroinstalace')}
            >
              <div className="feature-image">
                <picture>
                  <source srcSet="/assets/new-build.webp" type="image/webp" />
                  <img
                    src="/assets/new-build.jpg"
                    alt="Montáž vypínače – ilustrační vizuál"
                    loading="lazy"
                    decoding="async"
                    width="540"
                    height="290"
                  />
                </picture>
                <span className="tag">Od základu</span>
              </div>
              <h3>
                Elektroinstalace v novostavbách <span>↗</span>
              </h3>
              <p>
                Rozvody, rozvaděče, zásuvky a osvětlení.
                <br />
                Pomůžeme promyslet i to, co vás zatím nenapadlo.
              </p>
            </a>

            <a
              className="feature-card"
              href="/rekonstrukce"
              onClick={(e) => handleLink(e, '/rekonstrukce')}
            >
              <div className="feature-image">
                <picture>
                  <source srcSet="/assets/renovation.webp" type="image/webp" />
                  <img
                    src="/assets/renovation.jpg"
                    alt="Práce na elektroinstalaci – ilustrační vizuál"
                    loading="lazy"
                    decoding="async"
                    width="540"
                    height="290"
                  />
                </picture>
                <span className="tag">S novou energií</span>
              </div>
              <h3>
                Rekonstrukce bytů a domů <span>↗</span>
              </h3>
              <p>
                Staré rozvody vyměníme a nové přizpůsobíme tomu,
                <br />
                jak doma žijete. Včetně zásuvek, vypínačů a světel.
              </p>
            </a>
          </div>

          <div className="small-services">
            <h3>
              A také drobnosti, na kterých záleží.    
            </h3>
            <p className="fine-note" style={{ marginTop: '-1rem', marginBottom: '1.5rem' }}>
                ✓ &nbsp;Revize a projektovou dokumentaci zajistíme ve spolupráci s revizním technikem a
                projektantem.
            </p>
            <div>
              <a
                href="/opravy-a-servis"
                onClick={(e) => handleLink(e, '/opravy-a-servis')}
              >
                <strong>Opravy a servis ↗</strong>
                <span>Zásuvky, vypínače, osvětlení</span>
              </a>
              <a
                href="/data-a-slaboproud"
                onClick={(e) => handleLink(e, '/data-a-slaboproud')}
              >
                <strong>Data a slaboproud ↗</strong>
                <span>Datové zásuvky a domácí síť</span>
              </a>
              <a
                href="/zabezpeceni-a-automatizace"
                onClick={(e) => handleLink(e, '/zabezpeceni-a-automatizace')}
              >
                <strong>Zabezpečení a automatizace ↗</strong>
                <span>Ochrana domácnosti a scénáře Ajax</span>
              </a>
              <a
                href="/na-co-myslet-pri-rekonstrukcich"
                onClick={(e) => handleLink(e, '/na-co-myslet-pri-rekonstrukcich')}
              >
                <strong>Na co myslet při rekonstrukcích ↗</strong>
                <span>Průvodce plánováním elektroinstalace</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <ProcessSection variant="home" />

      <Gallery />

      {reviews.length > 0 && (
        <section className="section" id="recenze">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Zkušenosti zákazníků</p>
                <h2>Co o naší práci říkají klienti</h2>
              </div>
              <p>
                Poctivé řemeslo, dodržené termíny a spolehlivá domluva.
                <br />
                Níže uvádíme reálná hodnocení z našich realizací v Ostravě a okolí.
              </p>
            </div>

            <div className="reviews-grid">
              {reviews.map((rev) => (
                <blockquote key={rev.id} className="review-card">
                  <div className="review-stars" aria-label={`Hodnocení ${rev.rating} z 5 hvězdiček`}>
                    ★★★★★
                  </div>
                  <p className="review-text">„{rev.text}“</p>
                  <footer className="review-author">
                    <div className="review-author-info">
                      <strong>{rev.name}</strong>
                      <small>{rev.locality} · {rev.project}</small>
                    </div>
                    <span className="review-badge">{rev.badge}</span>
                  </footer>
                </blockquote>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <a
                href="/reference"
                className="button outline"
                onClick={(e) => handleLink(e, '/reference')}
              >
                Zobrazit všechny reference a ukázky práce <span>↗</span>
              </a>
            </div>
          </div>
        </section>
      )}

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
        showWorkerPhoto
        isHome
      />
    </main>
  )
}
