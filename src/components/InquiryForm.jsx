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
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [formStartTime] = useState(() => Math.floor(Date.now() / 1000))

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

        <form className="inquiry-form" onSubmit={handleSubmit} noValidate={false}>
          <p className="form-note">
            Všechna pole jsou povinná.
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
              Příjmení
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
              <span id="contact-label">E-mail nebo telefon</span>
              <input
                aria-labelledby="contact-label"
                id="contact"
                name="contact"
                autoComplete="email"
                placeholder="Jak vás můžeme kontaktovat"
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
            S čím vám pomůžeme?
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
            Popis poptávky a lokalita
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Co plánujete a kde bude práce probíhat?"
              required
              minLength={10}
              maxLength={4000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
            />
          </label>

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
            Odesláním poptávky berete na vědomí zpracování zadaných údajů za účelem vyřízení dotazu a přípravy nabídky elektroinstalace (čl. 6 odst. 1 písm. b GDPR).
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
      </div>
    </section>
  )
}
