import { useNavigation } from '../context/navigation-core.js'

export default function DetailHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  caption,
  availability = 'Ostrava a okolí · Individuální cenová nabídka',
  ctaText = 'Domluvit konzultaci zdarma',
  ctaHref = '#poptavka',
  editorial = false,
}) {
  const { navigate } = useNavigation()

  return (
    <>
      {breadcrumbs && (
        <div className="breadcrumbs container">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx}>
              {idx > 0 && ' / '}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(crumb.href)
                  }}
                >
                  {crumb.label}
                </a>
              ) : (
                crumb.label
              )}
            </span>
          ))}
        </div>
      )}

      <section className={`detail-hero container ${editorial ? 'editorial-hero' : ''}`}>
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          <p>{description}</p>
          <a
            className="button"
            href={ctaHref}
            onClick={(e) => {
              e.preventDefault()
              navigate(ctaHref)
            }}
          >
            {ctaText} <span>↗</span>
          </a>
          {availability && <p className="availability">{availability}</p>}
        </div>

        <figure className="detail-visual">
          <img src={imageSrc} alt={imageAlt} fetchPriority="high" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      </section>
    </>
  )
}
