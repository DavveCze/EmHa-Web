import { useState, useRef } from 'react'

export default function InquiryForm({
  eyebrow = 'Pojďme se domluvit',
  title = 'S čím Vám pomůžeme?',
  defaultService = '',
  showWorkerPhoto = true,
  isHome = false,
}) {
  const [surname, setSurname] = useState('')
  const [contact, setContact] = useState('')
  const [service, setService] = useState(defaultService)
  const [prevDefaultService, setPrevDefaultService] = useState(defaultService)
  if (defaultService !== prevDefaultService) {
    setPrevDefaultService(defaultService)
    setService(defaultService)
  }
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [formStartTime, setFormStartTime] = useState(() => Math.floor(Date.now() / 1000))

  const handleFormInteraction = () => {
    const now = Math.floor(Date.now() / 1000)
    // If the tab was open for more than 1 hour, safely refresh the timestamp
    // ensuring at least 5 seconds have passed so human verification succeeds without timing out
    if (now - formStartTime > 3600) {
      setFormStartTime(now - 5)
    }
  }

  const [contactError, setContactError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const statusRef = useRef(null)

  const validateContact = (val) => {
    const v = val.trim()
    if (!v) return false
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    const digitsOnly = v.replace(/\D/g, '')
    const isPhone = /^\+?[\d\s()-]{9,20}$/.test(v) && digitsOnly.length >= 9
    return isEmail || isPhone
  }

  const handleContactChange = (e) => {
    const val = e.target.value
    setContact(val)
    if (val.trim() && !validateContact(val)) {
      setContactError('Zadejte platný e-mail nebo telefon (alespoň 9 číslic).')
    } else {
      setContactError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateContact(contact)) {
      setContactError('Zadejte platný e-mail nebo telefon (alespoň 9 číslic).')
      setIsError(true)
      setIsSuccess(false)
      setStatusMessage('Zkontrolujte prosím zadané kontaktní údaje.')
      if (statusRef.current) statusRef.current.focus()
      return
    }

    if (!surname.trim() || !message.trim() || !service) {
      setIsError(true)
      setIsSuccess(false)
      setStatusMessage('Vyplňte prosím všechna povinná pole.')
      if (statusRef.current) statusRef.current.focus()
      return
    }

    setContactError('')
    setIsSubmitting(true)
    setIsError(false)
    setStatusMessage('')

    try {
      const payload = {
        surname: surname.trim(),
        contact: contact.trim(),
        service,
        message: message.trim(),
        _hp_company: honeypot,
        _form_time: formStartTime,
      }

      const response = await fetch('/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok && data.success) {
        setIsSuccess(true)
        setIsError(false)
        setStatusMessage(
          data.message || 'Děkujeme za Vaši poptávku! Úspěšně jsme ji přijali a brzy se Vám ozveme.'
        )
        setSurname('')
        setContact('')
        setMessage('')
      } else {
        setIsSuccess(false)
        setIsError(true)
        setStatusMessage(
          data.error || 'Omlouváme se, poptávku se nepodařilo odeslat. Zkuste to prosím za chvíli nebo nám zavolejte.'
        )
      }
    } catch {
      setIsSuccess(false)
      setIsError(true)
      setStatusMessage(
        'Došlo k chybě spojení se serverem. Zkontrolujte prosím připojení k internetu nebo nás kontaktujte přímo telefonicky.'
      )
    } finally {
      setIsSubmitting(false)
      if (statusRef.current) {
        statusRef.current.focus()
      }
    }
  }

  return (
    <section className={`contact-section ${isHome ? 'contact-home' : ''}`} id="poptavka">
      <div className="container contact-grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {showWorkerPhoto && (
            <div className="contact-photo">
              <img
                src="/assets/contact-worker.png"
                alt="Ilustrační elektrikář při práci"
                loading="lazy"
                width="420"
                height="455"
              />
            </div>
          )}
        </div>

        {isSuccess ? (
          <div
            className="inquiry-success-card"
            role="status"
            aria-live="polite"
            ref={statusRef}
            tabIndex={-1}
          >
            <div className="success-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Poptávka byla úspěšně odeslána!</h3>
            <p className="success-lead">
              Děkujeme za důvěru. Vaše zadání jsme v pořádku přijali a brzy se vám ozveme.
            </p>
            <div className="success-next-steps">
              <strong>Co bude následovat:</strong>
              <ol>
                <li>
                  <b>Posouzení zadání:</b> Projdeme vámi popsaný rozsah prací a lokaci.
                </li>
                <li>
                  <b>Spojení s vámi:</b> Do 24–48 hodin se vám ozveme na zadaný kontakt pro upřesnění detailů.
                </li>
                <li>
                  <b>Nezávazná nabídka:</b> Připravíme orientační kalkulaci nebo domluvíme bezplatnou osobní prohlídku.
                </li>
              </ol>
            </div>
            <button
              type="button"
              className="button outline"
              onClick={() => {
                setIsSuccess(false)
                setStatusMessage('')
                setSurname('')
                setContact('')
                setMessage('')
              }}
            >
              Odeslat další dotaz <span>↻</span>
            </button>
          </div>
        ) : (
          <form
            className="inquiry-form"
            onSubmit={handleSubmit}
            onFocusCapture={handleFormInteraction}
            noValidate={false}
          >
            <p className="form-note">
              Všechna pole jsou povinná. Stačí základní popis, technické detaily vyřešíme společně.
            </p>

            {/* Antispam honeypot field - skryté pro roboty */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="hp_company">Nevyplňujte toto pole (ochrana proti spamu):</label>
              <input
                id="hp_company"
                name="_hp_company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label htmlFor="surname">
                <span className="field-label-wrap">
                  <span>Příjmení</span>
                </span>
                <input
                  id="surname"
                  name="surname"
                  autoComplete="family-name"
                  placeholder="Vaše příjmení"
                  required
                  maxLength={100}
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  disabled={isSubmitting}
                />
              </label>

              <label htmlFor="contact">
                <span className="field-label-wrap">
                  <span id="contact-label">E-mail nebo telefon</span>
                </span>
                <input
                  aria-labelledby="contact-label"
                  id="contact"
                  name="contact"
                  autoComplete="email"
                  placeholder="Např. +420 777 123 456 nebo e-mail"
                  required
                  maxLength={150}
                  aria-describedby="contact-error"
                  aria-invalid={Boolean(contactError)}
                  value={contact}
                  onChange={handleContactChange}
                  disabled={isSubmitting}
                />
                {contactError && (
                  <span id="contact-error" className="field-error">
                    {contactError}
                  </span>
                )}
              </label>
            </div>

            <label htmlFor="service">
              <span className="field-label-wrap">
                <span>S čím vám pomůžeme?</span>
              </span>
              <select
                id="service"
                name="service"
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">Vyberte službu</option>
                <option value="elektroinstalace">Elektroinstalace</option>
                <option value="rekonstrukce">Rekonstrukce</option>
                <option value="zabezpeceni-a-automatizace">Zabezpečení a automatizace</option>
                <option value="na-co-myslet-pri-rekonstrukcich">Konzultace před rekonstrukcí</option>
                <option value="opravy-a-servis">Opravy a servis</option>
                <option value="data-a-slaboproud">Data a slaboproud</option>
                <option value="jine">Jiný požadavek</option>
              </select>
            </label>

            <label htmlFor="message">
              <span className="field-label-wrap">
                <span>Popis poptávky a lokalita</span>
              </span>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Např. kompletní výměna rozvodů v bytě 3+1 v Ostravě, rekonstrukce kuchyně a koupelny, termín léto 2026..."
                required
                minLength={10}
                maxLength={4000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              />
            </label>

            <div className="form-trust-triggers" aria-hidden="true">
              <span>✓ 100% nezávazně</span>
              <span>✓ Odpovídáme do 24–48 h</span>
              <span>✓ Konzultace na místě zdarma</span>
            </div>

            <button
              type="submit"
              className="button"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>Odesílám poptávku... <span>&bull;</span></>
              ) : (
                <>Odeslat nezávaznou poptávku <span>↗</span></>
              )}
            </button>

            <p className="privacy-note">
              Odesláním poptávky berete na vědomí zpracování zadaných údajů za účelem vyřízení dotazu a přípravy nabídky elektroinstalace (čl. 6 odst. 1 písm. b GDPR). Více v{' '}
              <a
                href="/zasady-ochrany-osobnich-udaju"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline' }}
              >
                Zásadách ochrany osobních údajů
              </a>.
            </p>

            {statusMessage && (
              <p
                ref={statusRef}
                className={`form-status ${isSuccess ? 'is-success' : ''} ${isError ? 'is-error' : ''}`}
                role="status"
                tabIndex={-1}
              >
                {statusMessage}
              </p>
            )}

            <noscript>
              <p>
                Pro odeslání formuláře je vyžadován JavaScript. Můžete nás kontaktovat přímo na telefonním čísle nebo e-mailu uvedeném v zápatí.
              </p>
            </noscript>
          </form>
        )}
      </div>
    </section>
  )
}
