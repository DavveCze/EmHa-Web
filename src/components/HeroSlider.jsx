import { useState } from 'react'
import { useNavigation } from '../context/navigation-core.js'
import { useContent } from '../context/content-core.js'

const SLIDES = [
  {
    title: (
      <>
        Poctivá práce.
        <br />
        Spolehlivá
        <br />
        <span>elektřina.</span>
      </>
    ),
    description: (
      <>
        Elektroinstalace pro nové domy i rekonstrukce.
        <br />
        Od zásuvek po rozvaděč. Tak, aby se vám dobře bydlelo.
      </>
    ),
    image: '/assets/hero-v2.jpg',
    alt: 'Ilustrační elektrikář pracující u rozvaděče',
    short: (
      <>
        Poctivá práce.
        <br />
        Spolehlivá elektřina.
      </>
    ),
  },
  {
    title: (
      <>
        Nové rozvody.
        <br />
        Nové
        <br />
        <span>možnosti.</span>
      </>
    ),
    description: (
      <>
        Vyměníme starou elektroinstalaci.
        <br />
        A novou přizpůsobíme tomu, jak doma žijete.
      </>
    ),
    image: '/assets/renovation.jpg',
    alt: 'Ilustrační příprava rozvodů při rekonstrukci',
    short: (
      <>
        Nové rozvody.
        <br />
        Nové možnosti.
      </>
    ),
  },
  {
    title: (
      <>
        Chytrý domov.
        <br />
        Každý den
        <br />
        <span>pohodlněji.</span>
      </>
    ),
    description: (
      <>
        Zabezpečení a automatizace v jednom systému.
        <br />
        Domov, který dokáže reagovat.
      </>
    ),
    image: '/assets/smart-home-v2.jpg',
    alt: 'Ilustrační ovládání chytré domácnosti',
    short: (
      <>
        Chytrý domov.
        <br />
        Více pohodlí.
      </>
    ),
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const { navigate } = useNavigation()
  const { content } = useContent()

  const cmsSlides = content?.pages?.home?.slides
  const slides = (cmsSlides && cmsSlides.length > 0)
    ? cmsSlides.map((cs, idx) => ({
        ...SLIDES[idx],
        title: cs.title ? (
          typeof cs.title === 'string' && cs.title.includes('\n') ? (
            cs.title.split('\n').map((l, i, arr) => (
              <span key={i}>
                {l}
                {i < arr.length - 1 && <br />}
              </span>
            ))
          ) : cs.title
        ) : SLIDES[idx]?.title,
        description: cs.description ? (
          typeof cs.description === 'string' && cs.description.includes('\n') ? (
            cs.description.split('\n').map((l, i, arr) => (
              <span key={i}>
                {l}
                {i < arr.length - 1 && <br />}
              </span>
            ))
          ) : cs.description
        ) : SLIDES[idx]?.description,
        image: cs.image || SLIDES[idx]?.image,
        alt: cs.alt || SLIDES[idx]?.alt,
      }))
    : SLIDES

  const slide = slides[current] || slides[0]

  const handleStep = (step) => {
    setCurrent((prev) => (prev + step + slides.length) % slides.length)
  }

  const handleGoTo = (index) => {
    setCurrent(index)
  }

  return (
    <section className="hero" aria-roledescription="karusel" aria-label="Naše služby">
      {slides.map((s, idx) => (
        <picture
          key={s.image + idx}
          className={`hero-image ${idx === current ? 'is-active' : ''}`}
          style={{
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 0.7s cubic-bezier(0.2, 0.7, 0.2, 1)',
            pointerEvents: 'none',
          }}
        >
          {idx === 0 && (
            <source
              media="(max-width: 768px)"
              srcSet="/assets/hero-v2-mobile.webp"
              type="image/webp"
            />
          )}
          {typeof s.image === 'string' && s.image.endsWith('.jpg') && (
            <source srcSet={s.image.replace(/\.jpg$/, '.webp')} type="image/webp" />
          )}
          {typeof s.image === 'string' && s.image.endsWith('.png') && (
            <source srcSet={s.image.replace(/\.png$/, '.webp')} type="image/webp" />
          )}
          <img
            src={s.image}
            alt={idx === current ? s.alt : ''}
            aria-hidden={idx !== current}
            loading={idx === 0 ? 'eager' : 'lazy'}
            fetchPriority={idx === 0 ? 'high' : 'low'}
            decoding={idx === 0 ? 'sync' : 'async'}
            width="1920"
            height="1080"
          />
        </picture>
      ))}
      <div className="hero-shade" />

      <div className="hero-content">
        <div key={current} className="hero-text-fade">
          <p className="location">Ostrava a okolí</p>
          <h1>{slide.title}</h1>
          <p className="hero-description">{slide.description}</p>
          <a
            className="button yellow"
            href="#poptavka"
            onClick={(e) => {
              e.preventDefault()
              navigate('#poptavka')
            }}
          >
            Domluvit konzultaci zdarma <span>↗</span>
          </a>
        </div>
      </div>

      <div className="hero-bottom">
        <div className="hero-controls">
          <span className="slide-count" aria-live="polite">
            <strong>0{current + 1}</strong> / 0{slides.length}
          </span>
          <div className="slide-tabs">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Snímek ${i + 1}`}
                aria-pressed={i === current}
                onClick={() => handleGoTo(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="round"
            aria-label="Předchozí snímek"
            onClick={() => handleStep(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className="round"
            aria-label="Další snímek"
            onClick={() => handleStep(1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
