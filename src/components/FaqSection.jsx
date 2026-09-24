import { useState } from 'react'

export default function FaqSection({
  eyebrow = 'Co vás často zajímá',
  title = 'Ještě než začneme.',
  description = (
    <>
      Všechno nemusíte mít rozhodnuté.
      <br />
      Od toho je první konzultace.
    </>
  ),
  items = [],
}) {
  const [openIndex, setOpenIndex] = useState(0)

  const handleToggle = (index, e) => {
    e.preventDefault()
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }

  return (
    <section className="section" id="otazky">
      <div className="container faq-grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <div className="faq">
          {items.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <details key={index} open={isOpen}>
                <summary onClick={(e) => handleToggle(index, e)}>
                  {item.q}
                  <span aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            )
          })}
        </div>
      </div>
    </section>
  )
}
