import { useState, useEffect, useRef, useCallback } from 'react'

const DEFAULT_ITEMS = [
  {
    src: '/assets/panel-detail.jpg',
    caption: 'Rozvody a rozvaděče — precizní uspořádání kabeláže',
    label: 'Rozvody a rozvaděče',
  },
  {
    src: '/assets/renovation.jpg',
    caption: 'Příprava nových rozvodů — kabeláž v drážkách před omítkami',
    label: 'Příprava nových rozvodů',
  },
  {
    src: '/assets/ceiling-worker.jpg',
    caption: 'Montáž osvětlení — zapojení světelných okruhů v interiéru',
    label: 'Montáž osvětlení',
  },
  {
    src: '/assets/new-build.jpg',
    caption: 'Elektroinstalace v novostavbě — kompletní silnoproud i slaboproud',
    label: 'Novostavby a rozvody',
  },
  {
    src: '/assets/switch-detail.jpg',
    caption: 'Kompletace vypínačů a zásuvek — čisté osazení rámečků',
    label: 'Zásuvky a vypínače',
  },
  {
    src: '/assets/electrician.jpg',
    caption: 'Odborné zapojení a měření — příprava na výchozí revizi',
    label: 'Odborné zapojení',
  },
]

export default function Gallery({
  eyebrow = 'Nakoukněte nám pod ruce',
  title = 'Za každým vypínačem je kus práce.',
  items = DEFAULT_ITEMS,
  showLabels = false,
  note = null,
  className = '',
}) {
  const baseItems = items && items.length > 0 ? items : DEFAULT_ITEMS
  const N = baseItems.length

  // Triple the items for infinite seamless looping
  const slides = [...baseItems, ...baseItems, ...baseItems]

  // Start with the second item of the middle set in the center
  const [activeIndex, setActiveIndex] = useState(N + 1)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [lightboxItem, setLightboxItem] = useState(null)

  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const touchStartX = useRef(null)

  // Measure container width for pixel-perfect centering
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Double rAF restore of transition after instant wrap
  useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true)
        })
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [isTransitioning])

  const [isPaused, setIsPaused] = useState(false)

  const handleStep = useCallback((dir) => {
    setIsTransitioning(true)
    setActiveIndex((prev) => prev + dir)
  }, [])

  // Autoplay (~4.5s) s pozastavením při interakci a respektováním prefers-reduced-motion
  useEffect(() => {
    if (lightboxItem || isPaused) return

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const timer = setInterval(() => {
      handleStep(1)
    }, 4500)

    return () => clearInterval(timer)
  }, [handleStep, lightboxItem, isPaused])

  const handleTransitionEnd = () => {
    if (activeIndex >= N * 2) {
      setIsTransitioning(false)
      setActiveIndex((prev) => prev - N)
    } else if (activeIndex < N) {
      setIsTransitioning(false)
      setActiveIndex((prev) => prev + N)
    }
  }

  const handleSlideClick = (idx, item) => {
    if (idx === activeIndex) {
      setLightboxItem(item)
    } else {
      setIsTransitioning(true)
      setActiveIndex(idx)
    }
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      handleStep(diff > 0 ? 1 : -1)
    }
    touchStartX.current = null
  }

  // Handle keyboard escape and body scroll lock for lightbox
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && lightboxItem) {
        setLightboxItem(null)
      }
    }
    if (lightboxItem) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxItem])

  // Responsive slide width and gap calculation
  const isMobile = containerWidth > 0 && containerWidth < 768
  const slidePercent = isMobile ? 0.82 : 0.52
  const gap = isMobile ? 16 : 28

  const slideWidth = containerWidth ? containerWidth * slidePercent : 500
  const trackOffset = containerWidth
    ? (containerWidth - slideWidth) / 2 - activeIndex * (slideWidth + gap)
    : 0

  return (
    <>
      <section className={`section gallery-section ${className}`}>
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h2>{title}</h2>
            </div>
            <div className="gallery-controls">
              <button
                type="button"
                className="round"
                aria-label="Předchozí fotografie"
                onClick={() => handleStep(-1)}
              >
                ←
              </button>
              <button
                type="button"
                className="round"
                aria-label="Další fotografie"
                onClick={() => handleStep(1)}
              >
                →
              </button>
            </div>
          </div>

          <div
            className="gallery-carousel-wrapper"
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={(e) => {
              setIsPaused(true)
              handleTouchStart(e)
            }}
            onTouchEnd={(e) => {
              setIsPaused(false)
              handleTouchEnd(e)
            }}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <div
              className="gallery-track"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(${trackOffset}px)`,
                transition: isTransitioning
                  ? 'transform 0.48s cubic-bezier(0.2, 0.7, 0.2, 1)'
                  : 'none',
                gap: `${gap}px`,
              }}
            >
              {slides.map((item, idx) => {
                const isCenter = idx === activeIndex
                return (
                  <button
                    key={`${item.src}-${idx}`}
                    type="button"
                    className={`gallery-slide ${isCenter ? 'is-active' : ''}`}
                    style={{ width: `${slideWidth}px` }}
                    aria-label={
                      isCenter
                        ? `Zvětšit: ${item.label || item.caption}`
                        : `Přejít na fotografii: ${item.label || item.caption}`
                    }
                    onClick={() => handleSlideClick(idx, item)}
                  >
                    <div className="gallery-slide-img-box">
                      <img src={item.src} alt={item.caption} loading="lazy" />
                    </div>
                    {showLabels && (
                      <span className="gallery-slide-label">{item.label}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="gallery-bottom-controls">
            <button
              type="button"
              className="round gallery-arrow-btn"
              aria-label="Předchozí fotografie"
              onClick={() => handleStep(-1)}
            >
              ←
            </button>
            <div className="gallery-dots" aria-hidden="true">
              {baseItems.map((_, i) => (
                <span
                  key={i}
                  className={`gallery-dot ${(activeIndex % N) === i ? 'is-active' : ''}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="round gallery-arrow-btn"
              aria-label="Další fotografie"
              onClick={() => handleStep(1)}
            >
              →
            </button>
          </div>

          {note && <p className="image-note">{note}</p>}
        </div>
      </section>

      {lightboxItem && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Detail fotografie"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLightboxItem(null)
            }
          }}
        >
          <div className="lightbox-modal">
            <button
              type="button"
              className="round close-lightbox"
              aria-label="Zavřít fotografii"
              onClick={() => setLightboxItem(null)}
            >
              ×
            </button>
            <img src={lightboxItem.src} alt={lightboxItem.caption} />
            {lightboxItem.caption && <p>{lightboxItem.caption}</p>}
          </div>
        </div>
      )}
    </>
  )
}
