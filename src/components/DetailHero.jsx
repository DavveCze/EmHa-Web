import { useNavigation } from '../context/navigation-core.js'
import { useContent } from '../context/content-core.js'

export default function DetailHero({
  pageKey,
  breadcrumbs,
  eyebrow: propEyebrow,
  title: propTitle,
  description: propDescription,
  imageSrc: propImageSrc,
  imageAlt: propImageAlt,
  caption,
  availability: propAvailability = 'Ostrava a okolí · Individuální cenová nabídka',
  ctaText: propCtaText = 'Domluvit konzultaci zdarma',
  ctaHref: propCtaHref = '#poptavka',
  editorial = false,
}) {
  const { navigate } = useNavigation()
  const { content } = useContent()
  const cmsHero = pageKey && content?.pages?.[pageKey]?.hero ? content.pages[pageKey].hero : null

  const eyebrow = cmsHero?.eyebrow || propEyebrow
  const title = cmsHero?.title ? (
    typeof cmsHero.title === 'string' && cmsHero.title.includes('\n') ? (
      cmsHero.title.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))
    ) : cmsHero.title
  ) : propTitle
  const description = cmsHero?.description || propDescription
  const imageSrc = cmsHero?.image || propImageSrc
  const imageAlt = cmsHero?.imageAlt || propImageAlt
  const availability = cmsHero?.availability || propAvailability
  const ctaText = cmsHero?.ctaText || propCtaText
  const ctaHref = cmsHero?.ctaHref || propCtaHref

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

      <section className={`detail-hero container ${editorial ? 'editorial-hero' : ''} ${!imageSrc ? 'has-no-visual' : ''}`}>
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

        {imageSrc && (
          <figure className="detail-visual">
            <img src={imageSrc} alt={imageAlt} fetchPriority="high" />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        )}
      </section>
    </>
  )
}
