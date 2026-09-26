export default function BusinessTab({ data, onChange }) {
  const handleChange = (field, val) => {
    onChange({
      ...data,
      [field]: val,
    })
  }

  return (
    <div className="admin-tab-pane">
      <div className="admin-pane-header">
        <div>
          <h3>Firemní identita, kontakty a zákonné údaje (§ 435 NOZ)</h3>
          <p>
            Tyto informace se automaticky synchronizují do hlavičky, patičky, stránky Kontakt i do strukturovaných dat Schema.org (Google LocalBusiness / Electrician).
          </p>
        </div>
      </div>

      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="biz-phone">
            <strong>Telefonní číslo (pro zákazníky):</strong>
          </label>
          <input
            id="biz-phone"
            type="text"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+420 731 833 605"
            maxLength={50}
          />
          <small className="field-hint">Zobrazuje se v záhlaví, zápatí i kontaktní kartě.</small>
        </div>

        <div className="admin-field">
          <label htmlFor="biz-email">
            <strong>Oficiální kontaktní e-mail:</strong>
          </label>
          <input
            id="biz-email"
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="info@emha-elektro.cz"
            maxLength={100}
          />
          <small className="field-hint">Poptávky a zprávy z formuláře budou směřovat sem.</small>
        </div>

        <div className="admin-field">
          <label htmlFor="biz-hours">
            <strong>Pracovní / provozní doba:</strong>
          </label>
          <input
            id="biz-hours"
            type="text"
            value={data.openingHours || ''}
            onChange={(e) => handleChange('openingHours', e.target.value)}
            placeholder="Po–Pá 8:00–17:00"
            maxLength={100}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="biz-legalName">
            <strong>Jméno podnikatele (fyzická osoba):</strong>
          </label>
          <input
            id="biz-legalName"
            type="text"
            value={data.legalName || ''}
            onChange={(e) => handleChange('legalName', e.target.value)}
            placeholder="Martin Hořčica"
            maxLength={100}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="biz-taxID">
            <strong>Identifikační číslo (IČO):</strong>
          </label>
          <input
            id="biz-taxID"
            type="text"
            value={data.taxID || ''}
            onChange={(e) => handleChange('taxID', e.target.value)}
            placeholder="14216132"
            maxLength={20}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="biz-street">
            <strong>Sídlo (ulice a číslo):</strong>
          </label>
          <input
            id="biz-street"
            type="text"
            value={data.street || ''}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="Tlapákova 1242/15"
            maxLength={150}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="biz-city">
            <strong>Město a městská část:</strong>
          </label>
          <input
            id="biz-city"
            type="text"
            value={data.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Ostrava – Hrabůvka"
            maxLength={100}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="biz-zip">
            <strong>PSČ:</strong>
          </label>
          <input
            id="biz-zip"
            type="text"
            value={data.zip || ''}
            onChange={(e) => handleChange('zip', e.target.value)}
            placeholder="70030"
            maxLength={10}
          />
        </div>

        <div className="admin-field full-width">
          <label htmlFor="biz-reg">
            <strong>Zákonná doložka o zápisu (§ 435 NOZ):</strong>
          </label>
          <textarea
            id="biz-reg"
            rows={2}
            value={data.registration || ''}
            onChange={(e) => handleChange('registration', e.target.value)}
            placeholder="Fyzická osoba zapsaná v živnostenském rejstříku..."
            maxLength={300}
          />
        </div>
      </div>
    </div>
  )
}
