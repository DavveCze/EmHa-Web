export default function AutomationDiagram() {
  return (
    <section className="section sage" id="jak-to-funguje">
      <div className="container">
        <p className="eyebrow">Jak to funguje</p>
        <h2>Podnět. Scénář. Reakce</h2>
        <div
          className="system-diagram scenario-active"
          role="group"
          aria-label="Podnět aktivuje scénář Ajax, který spustí odpovídající reakci"
        >
          <svg
            className="scenario-lines"
            viewBox="0 0 1120 310"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M295 45 C370 45 380 98 455 98 M295 120 C370 120 380 142 455 142 M295 195 C370 195 380 182 455 182 M295 270 C370 270 380 226 455 226 M665 98 C740 98 750 45 825 45 M665 142 C740 142 750 120 825 120 M665 182 C740 182 750 195 825 195 M665 226 C740 226 750 270 825 270" />
          </svg>

          <div className="system-column">
            <h3>01 &nbsp;Podnět</h3>
            <p>Aktivace zabezpečení</p>
            <p>Detekce úniku vody</p>
            <p>Požární poplach</p>
            <p>Nastavený čas</p>
          </div>

          <div className="system-hub">
            <span className="hub-label">02 &nbsp;Scénář Ajax</span>
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM7 11l3 3 7-7" />
            </svg>
            <h3>Ajax</h3>
            <p>Nastavené scénáře a propojené prvky</p>
          </div>

          <div className="system-column">
            <h3>03 &nbsp;Reakce</h3>
            <p>Vypnutí vybraných zásuvek</p>
            <p>Uzavření přívodu vody</p>
            <p>Odpojení vybraných zařízení</p>
            <p>Spuštění vybraného scénáře</p>
          </div>
        </div>
      </div>
    </section>
  )
}
