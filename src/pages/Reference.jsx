import DetailHero from '../components/DetailHero.jsx'
import Gallery from '../components/Gallery.jsx'
import InquiryForm from '../components/InquiryForm.jsx'

export default function Reference() {
  const referenceGalleryItems = [
    {
      src: '/assets/panel-detail.jpg',
      caption: 'Rozvody a rozvaděče — ilustrační vizuál',
      label: 'Rozvody a rozvaděče',
    },
    {
      src: '/assets/renovation.jpg',
      caption: 'Příprava nových rozvodů — ilustrační vizuál',
      label: 'Příprava nových rozvodů',
    },
    {
      src: '/assets/ceiling-worker.jpg',
      caption: 'Montáž osvětlení — ilustrační vizuál',
      label: 'Montáž osvětlení',
    },
  ]

  return (
    <main id="main">
      <DetailHero
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Reference' },
        ]}
        eyebrow="Reference"
        title={
          <>
            Práce, která je vidět.
            <br />
            I ta ukrytá ve zdech.
          </>
        }
        description="Rozvody, osvětlení a chytré ovládání. Níže jsou ilustrační vizuály typů prací; nejde o doložené realizace EmHa Elektro."
        imageSrc="/assets/panel-detail.jpg"
        imageAlt="Reference — ilustrační fotografie"
        editorial
      />

      <Gallery
        items={referenceGalleryItems}
        showLabels
        note="Ilustrační vizuály. Fotografie a popisy skutečných realizací budou doplněny."
      />

      <section className="section sage">
        <div className="container">
          <p className="eyebrow">Co pro vás můžeme připravit</p>
          <h2>Od nového domu po drobnou opravu.</h2>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">01</b>
              <div>
                <h3>Novostavby</h3>
                <p>
                  Rozvody, rozvaděč, zásuvky a světla navržené podle každodenního života.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">02</b>
              <div>
                <h3>Rekonstrukce</h3>
                <p>
                  Obnova instalace a úprava rozmístění prvků podle nových potřeb.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">03</b>
              <div>
                <h3>Zabezpečení</h3>
                <p>
                  Promyšlené rozmístění čidel a pohodlné ovládání domácího zabezpečení.
                </p>
              </div>
            </article>
            <article>
              <b aria-hidden="true">04</b>
              <div>
                <h3>Automatizace</h3>
                <p>
                  Propojené prvky a scénáře, které reagují na vybrané situace.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
      />
    </main>
  )
}
