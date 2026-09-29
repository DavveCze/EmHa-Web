export default function ProcessSection({ variant = 'service', isH1 = false }) {
  const steps = [
    {
      number: '01',
      title: 'Řekněte nám, co plánujete.',
      desc: 'Nový dům, rekonstrukci nebo drobnou opravu. Stačí pár slov a lokalita.',
    },
    {
      number: '02',
      title: 'Probereme možnosti a cenu.',
      desc: 'Úvodní konzultace je zdarma. Nabídku připravíme podle rozsahu práce a vašich požadavků.',
    },
    {
      number: '03',
      title: 'Pustíme se do práce.',
      desc: 'Domluvíme rozsah i termín a zajistíme realizaci včetně potřebných návazností.',
    },
  ]

  if (variant === 'home') {
    return (
      <section className="process dark-band" id="prubeh">
        <div className="container process-home">
          <div>
            <p className="eyebrow">Takhle pracujeme</p>
            <h2>
              Jasná domluva.
              <br />
              Promyšlené řešení.
              <br />
              Pečlivá realizace.
            </h2>
            <p>
              Nemusíte se vyznat v elektřině.
              <br />
              Od toho jsme tu my. Všechno si spolu projdeme.
            </p>
          </div>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.number}>
                <span className="number">{s.number}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section className="process dark-band" id="prubeh">
      <div className="container">
        <div>
          <p className="eyebrow">Takhle budeme postupovat</p>
          {isH1 ? (
            <h1>Od první domluvy k hotové práci.</h1>
          ) : (
            <h2>Od první domluvy k hotové práci.</h2>
          )}
        </div>
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.number}>
              <span className="number">{s.number}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
