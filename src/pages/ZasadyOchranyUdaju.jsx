import DetailHero from '../components/DetailHero.jsx'
import { useContent } from '../context/content-core.js'
import defaultContent from '../data/defaultContent.json'

export default function ZasadyOchranyUdaju() {
  const { content } = useContent()
  const b = content?.business || defaultContent.business

  return (
    <main id="main" tabIndex={-1}>
      <DetailHero
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Zásady ochrany osobních údajů' },
        ]}
        eyebrow="Ochrana soukromí a osobních údajů"
        title={
          <>
            Zásady zpracování
            <br />
            osobních údajů (GDPR)
          </>
        }
        description="Transparentní informace o tom, jaké osobní údaje zpracováváme při odeslání poptávky, jak jsou chráněny a jaká máte práva dle nařízení GDPR."
        ctaText="Zpět na úvodní stránku"
        ctaHref="/"
        availability="Platnost zásad od 1. 1. 2026 · V souladu s Nařízením (EU) 2016/679"
      />

      <section className="section" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '820px', margin: '0 auto', lineHeight: '1.7' }}>
          <div className="legal-article" style={{ fontSize: '1.02rem', color: 'var(--text)' }}>
            <p className="lead" style={{ fontSize: '1.15rem', color: 'var(--text)', fontWeight: 500, lineHeight: '1.7', marginBottom: '24px' }}>
              Bezpečnost vašich údajů a férové jednání jsou pro nás prioritou nejen při řemeslné práci
              na elektroinstalacích, ale i při správě tohoto webu. Níže naleznete veškeré zákonné informace
              dle čl. 13 a 14 Obecného nařízení o ochraně osobních údajů (GDPR).
            </p>

            <h2 style={{ marginTop: '32px', marginBottom: '12px', fontSize: '1.35rem', color: 'var(--green)' }}>1. Kdo je správcem vašich osobních údajů?</h2>
            <p>
              Správcem osobních údajů je:
              <br />
              <strong>{b.legalName || 'Martin Hořčica'}</strong>, podnikající pod obchodním názvem <strong>{b.name || 'EmHa Elektro'}</strong>
              <br />
              IČO: <strong>{b.taxID || '14216132'}</strong> ({b.isVatPayer ? 'plátce DPH' : 'neplátce DPH'})
              <br />
              Sídlo: {b.street || 'Tlapákova 1242/15'}, {b.city || 'Ostrava – Hrabůvka, 700 30'}
              <br />
              Zápis v rejstříku: {b.registration || 'Fyzická osoba zapsaná v živnostenském rejstříku (Živnostenský úřad Ostrava).'}
              <br />
              E-mail: <a href={`mailto:${b.email || 'info@emha-elektro.cz'}`}>{b.email || 'info@emha-elektro.cz'}</a>
              <br />
              Telefon: <a href={`tel:${b.phoneRaw || '+420731833605'}`}>{b.phone || '+420 731 833 605'}</a>
            </p>

            <h2 style={{ marginTop: '32px', marginBottom: '12px', fontSize: '1.35rem', color: 'var(--green)' }}>2. Jaké údaje zpracováváme a proč?</h2>
            <p>
              Zpracováváme pouze údaje nezbytné k vyřízení vašeho požadavku, které nám sami dobrovolně
              poskytnete prostřednictvím poptávkového formuláře nebo telefonicky:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Jméno a příjmení</strong> – pro vaše oslovení a identifikaci zakázky.</li>
              <li><strong>Telefonní číslo nebo e-mail</strong> – abychom vás mohli kontaktovat ohledně upřesnění termínu a zadání.</li>
              <li><strong>Poptávaná služba a popis zakázky (včetně orientační lokality)</strong> – abychom dokázali posoudit technickou náročnost a připravit kalkulaci.</li>
              <li><strong>Technické údaje (IP adresa, čas odeslání)</strong> – z důvodu ochrany webu před roboty, spamem a DDoS útoky (oprávněný zájem).</li>
            </ul>

            <h2 style={{ marginTop: '32px', marginBottom: '12px', fontSize: '1.35rem', color: 'var(--green)' }}>3. Právní základ zpracování</h2>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>
                <strong>Plnění předsmluvních opatření na žádost zákazníka</strong> (čl. 6 odst. 1 písm. b GDPR): Zpracování údajů je nutné k tomu, abychom vás mohli kontaktovat, navrhnout technické řešení a připravit nezávaznou cenovou nabídku elektroinstalace.
              </li>
              <li>
                <strong>Oprávněný zájem správce</strong> (čl. 6 odst. 1 písm. f GDPR): Ochrana webového formuláře před zneužitím (antispamové pasti, rate-limiting) a uchování nezbytné komunikace pro případ obhajoby právních nároků.
              </li>
              <li>
                <strong>Souhlas se zpracováním</strong> (čl. 6 odst. 1 písm. a GDPR): V případě volitelných analytických cookies (Google Analytics / MS Clarity) – pouze pokud je aktivně potvrdíte v cookie liště.
              </li>
            </ul>

            <h2 style={{ marginTop: '32px', marginBottom: '12px', fontSize: '1.35rem', color: 'var(--green)' }}>4. Jak dlouho údaje uchováváme?</h2>
            <p>
              Údaje z poptávkového formuláře uchováváme po dobu nezbytnou k vyřízení poptávky a komunikaci
              o realizaci zakázky. Pokud nedojde k uzavření smlouvy o dílo ani realizaci, údaje jsou
              uchovávány nejdéle 12 měsíců od poslední komunikace. V případě realizované zakázky jsou fakturační
              a smluvní doklady uchovávány po dobu stanovenou daňovými a účetními zákony ČR (zpravidla 5 až 10 let).
            </p>

            <h2 style={{ marginTop: '32px', marginBottom: '12px', fontSize: '1.35rem', color: 'var(--green)' }}>5. Kdo má k údajům přístup (Příjemci údajů)?</h2>
            <p>
              Vaše údaje neprodáváme, nepronajímáme ani neposkytujeme žádným marketingovým třetím stranám.
              Přístup k nim mají pouze prověření poskytovatelé technické infrastruktury nezbytné pro provoz webu:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Poskytovatel webhostingu a serverové infrastruktury (servery umístěné výhradně v České republice / EU).</li>
              <li>Poskytovatel poštovních a SMTP serverů pro spolehlivé doručení e-mailových zpráv.</li>
              <li>Certifikovaný revizní technik či projektant – pouze v případě sjednané realizace zakázky pro vyhotovení revizní zprávy.</li>
            </ul>

            <h2 style={{ marginTop: '32px', marginBottom: '12px', fontSize: '1.35rem', color: 'var(--green)' }}>6. Jaká máte práva dle GDPR?</h2>
            <p>V souvislosti se zpracováním vašich osobních údajů máte ze zákona tato práva:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Právo na přístup</strong> k vašim osobním údajům a informacím o jejich zpracování.</li>
              <li><strong>Právo na opravu</strong> nepřesných nebo neaktuálních údajů.</li>
              <li><strong>Právo na výmaz</strong> („být zapomenut“), pokud pominul účel zpracování nebo neexistuje jiný právní důvod.</li>
              <li><strong>Právo na omezení zpracování</strong> v zákonem stanovených případech.</li>
              <li><strong>Právo vznést námitku</strong> proti zpracování založenému na oprávněném zájmu.</li>
              <li>
                <strong>Právo podat stížnost u dozorového úřadu:</strong> Pokud se domníváte, že s vašimi údaji nakládáme v rozporu se zákonem, máte právo obrátit se na Úřad pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7, web: <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer">www.uoou.cz</a>.
              </li>
            </ul>

            <h2 style={{ marginTop: '32px', marginBottom: '12px', fontSize: '1.35rem', color: 'var(--green)' }}>7. Zabezpečení dat</h2>
            <p>
              Provoz tohoto webu probíhá výhradně přes šifrované spojení HTTPS s bezpečnostními hlavičkami.
              Přístup k evidenci poptávek je chráněn silným kryptografickým hashováním (Argon2id),
              ochranou proti brute-force útokům, CSRF tokeny a adresářovými restrikcemi na úrovni webserveru.
            </p>

            <h2 style={{ marginTop: '32px', marginBottom: '12px', fontSize: '1.35rem', color: 'var(--green)' }}>8. Informace pro spotřebitele a mimosoudní řešení sporů (ADR)</h2>
            <p>
              Odesláním formuláře na tomto webu dochází k nezávazné poptávce řemeslných služeb, nikoliv k uzavření smlouvy o dílo ani k závazné objednávce s povinností platby. K uzavření smlouvy a stanovení konečné ceny dochází vždy až po vzájemné individuální dohodě, prohlídce a odsouhlasení položkového rozpočtu.
            </p>
            <p>
              V případě vzniku spotřebitelského sporu ze smlouvy o dílo nebo z poskytování služeb, který se nepodaří vyřešit vzájemnou dohodou, má zákazník (spotřebitel) dle zákona č. 634/1992 Sb., o ochraně spotřebitele, právo na mimosoudní řešení sporu. Věcně příslušným subjektem je Česká obchodní inspekce, Ústřední inspektorát – oddělení ADR, Štěpánská 44, 110 00 Praha 1, e-mail: adr@coi.cz, web:{' '}
              <a href="https://www.coi.cz" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                www.coi.cz
              </a>.
            </p>

            <div style={{ marginTop: '40px', padding: '20px', background: 'var(--form)', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)' }}>
                Máte dotaz ohledně zpracování osobních údajů nebo chcete uplatnit některé ze svých práv?
                Napište nám na <a href={`mailto:${b.email || 'info@emha-elektro.cz'}`}>{b.email || 'info@emha-elektro.cz'}</a> nebo zavolejte na <a href={`tel:${b.phoneRaw || '+420731833605'}`}>{b.phone || '+420 731 833 605'}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
