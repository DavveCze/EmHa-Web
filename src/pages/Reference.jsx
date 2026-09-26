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
        eyebrow="Ukázky řemeslné práce"
        title="Za každým vypínačem je kus práce."
        items={referenceGalleryItems}
        showLabels
        note="Fotografie znázorňují standardní postupy a řemeslné provedení elektroinstalací."
      />

      <InquiryForm
        eyebrow="Pojďme se domluvit"
        title="S čím Vám pomůžeme?"
      />
    </main>
  )
}
