import DetailHero from '../components/DetailHero.jsx'
import AnchorNav from '../components/AnchorNav.jsx'
import FaqSection from '../components/FaqSection.jsx'
import InquiryForm from '../components/InquiryForm.jsx'
import RelatedServices from '../components/RelatedServices.jsx'

export default function NaCoMysletPriRekonstrukcich() {
  const navItems = [
    { href: '#nabytek', number: '01', label: 'Nábytek a zásuvky' },
    { href: '#kuchyn-a-koupelna', number: '02', label: 'Kuchyň a koupelna' },
    { href: '#internet', number: '03', label: 'Internet a sítě' },
    { href: '#checklist', number: '04', label: 'Kontrolní checklist' },
  ]

  const faqItems = [
    {
      q: 'Kdy je nejlepší přizvat elektrikáře k rekonstrukci?',
      a: 'Ideálně ještě před bouráním starých příček nebo bezprostředně po něm. V této fázi se dají nejlépe naplánovat trasy kabelů a návaznost na instalatéry a sádrokartonáře.',
    },
    {
      q: 'Co když ještě nemám přesný plán nábytku?',
      a: 'Při osobní prohlídce na místě společně projdeme hrubou představu o uspořádání místností. Navrhneme univerzální umístění zásuvek a rezervy, které vám dají svobodu i při pozdějších změnách.',
    },
    {
      q: 'Potřebuji k nové elektroinstalaci revizní zprávu?',
      a: 'Ano, kompletní rekonstrukce elektroinstalace vyžaduje výchozí revizi. Revizní zprávu a veškerou potřebnou dokumentaci pro vás zajistíme ve spolupráci s certifikovaným revizním technikem.',
    },
    {
      q: 'Zvládne stávající jistič v bytě novou varnou desku a spotřebiče?',
      a: 'Před zahájením prací zkontrolujeme hodnotu hlavního jističe a počet fází. Pokud je potřeba navýšit příkon nebo přejít na 3 fáze, vysvětlíme vám postup žádosti u distribuční společnosti.',
    },
  ]

  return (
    <main id="main">
      <DetailHero
        pageKey="na-co-myslet-pri-rekonstrukcich"
        breadcrumbs={[
          { label: 'Domů', href: '/' },
          { label: 'Rekonstrukce', href: '/rekonstrukce' },
          { label: 'Na co myslet při rekonstrukcích' },
        ]}
        eyebrow="Praktický průvodce elektroinstalací"
        title={
          <>
            Na co myslet při
            <br />
            rekonstrukci bytu
            <br />
            nebo domu.
          </>
        }
        description="Promyšlená elektroinstalace předchází dodatečnému sekání do nových omítek i změti prodlužovaček po zemi. Projděte si klíčové body dřív, než nastoupí zedníci."
        imageSrc="/assets/renovation.jpg"
        imageAlt="Práce na elektroinstalaci při rekonstrukci — ilustrační vizuál"
      />

      <AnchorNav items={navItems} />

      {/* 01: Nábytek a zásuvky */}
      <section className="section" id="nabytek">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Plánování podle života</p>
              <h2>Elektroinstalace má sloužit vám, ne vy jí.</h2>
            </div>
            <p>
              Nejčastější chybou při rekonstrukci bývá umístění zásuvek „od oka“. Když pak dorazí
              nábytek, polovina zásuvek skončí za skříní a u postele chybí nabíječka.
              Tady je několik osvědčených zásad z praxe:
            </p>
          </div>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">01</b>
              <div>
                <h3>Zásuvky u nočních stolků a stolu</h3>
                <p>
                  Plánujte zásuvky ve výšce nad nočním stolkem (cca 70–80 cm) nebo těsně nad deskou
                  pracovního stolu. Nabíjení telefonu i lampička budou pohodlně po ruce.
                </p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">02</b>
              <div>
                <h3>Skrytá kabeláž za televizí</h3>
                <p>
                  Pro televizi na zdi připravíme napájecí i datové zásuvky přímo za panelem a husí krk
                  ve zdi pro HDMI kabely k soundbaru či konzoli. Žádné visící dráty.
                </p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">03</b>
              <div>
                <h3>Ovládání světel z více míst</h3>
                <p>
                  Zhasnout hlavní světlo v ložnici přímo z postele nebo rozsvítit chodbu z obou konců
                  je standard, který oceníte každý den. Schodišťové přepínače jsou nutnost.
                </p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">04</b>
              <div>
                <h3>Noční orientační osvětlení</h3>
                <p>
                  Tlumená LED svítidla v soklu chodby nebo u toalety vám v noci bezpečně posvítí na
                  cestu, aniž by vás ostré stropní světlo oslnilo a probudilo.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 02: Kuchyň a koupelna */}
      <section className="section sage" id="kuchyn-a-koupelna">
        <div className="container split split-tall">
          <picture>
            <source srcSet="/assets/electrician.webp" type="image/webp" />
            <img
              src="/assets/electrician.jpg"
              alt="Příprava elektroinstalace pro spotřebiče"
              loading="lazy"
              decoding="async"
              width="540"
              height="390"
            />
          </picture>
          <div>
            <p className="eyebrow">Nejnáročnější zóny</p>
            <h2>
              Kuchyň a koupelna:
              <br />
              Vysoké nároky na bezpečnost i výkon.
            </h2>
            <p>
              V kuchyni a koupelně se potkává voda s vysokým elektrickým příkonem. Tady se chyby
              neodpouštějí a platí přísné normy:
            </p>
            <ul className="checklist">
              <li>
                <strong>Samostatné okruhy:</strong> Varná deska (ideálně 3fáze 400V), trouba, myčka,
                pračka a sušička musí mít vlastní jističe, aby nevyhazovaly pojistky.
              </li>
              <li>
                <strong>Dostatek zásuvek na lince:</strong> Kávovar, rychlovarná konvice, toustovač i
                mixér. Počítejte minimálně se 4–6 volnými zásuvkami nad pracovní plochou.
              </li>
              <li>
                <strong>Ochrana proudovým chráničem (RCD):</strong> Koupelna podléhá bezpečnostním
                zónám ČSN a každý okruh musí být chráněn citlivým chráničem pro ochranu života.
              </li>
              <li>
                <strong>Příprava pro digestoř a LED pásky:</strong> Nezapomeňte na skryté napájení pro
                osvětlení pod horními skříňkami a odtah digestoře.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 03: Internet a sítě */}
      <section className="section" id="internet">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Stabilní připojení</p>
              <h2>
                Proč jen Wi-Fi nestačí:
                <br />
                Pevné datové rozvody Cat6.
              </h2>
            </div>
            <p>
              Železobetonové panely v paneláku nebo tlusté cihlové zdi spolehlivě tlumí bezdrátový signál.
              Při rekonstrukci je ideální příležitost natáhnout datové kabely do chrániček pod omítku:
            </p>
          </div>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">01</b>
              <div>
                <h3>Pracovna a Home Office</h3>
                <p>
                  Pevný ethernetový kabel k pracovnímu stolu zaručí stabilní videohovory bez výpadků
                  a plnou rychlost vašeho internetového tarifu.
                </p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">02</b>
              <div>
                <h3>Chytrá televize a streaming</h3>
                <p>
                  Filmy ve 4K a online hry spotřebovávají obrovské množství dat. Přímý kabel za TV
                  uvolní kapacitu Wi-Fi pro mobilní telefony a tablety.
                </p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">03</b>
              <div>
                <h3>Husí krky s rezervou</h3>
                <p>
                  Kabely vkládáme do plastových chrániček. Pokud budete za 10 let potřebovat optiku
                  nebo nový kabel, jednoduše ho protáhnete bez bourání zdi.
                </p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">04</b>
              <div>
                <h3>Příprava pro žaluzie a klimatizaci</h3>
                <p>
                  I když klimatizaci nebo venkovní žaluzie nepořizujete hned, přiveďte k oknům napájecí
                  kabel. Až se pro ně rozhodnete, vyhnete se lištám na zdi.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 04: Kontrolní checklist */}
      <section className="section" id="checklist">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Kontrolní seznam před rekonstrukcí</p>
              <h2>Checklist pro klidnou rekonstrukci</h2>
            </div>
            <p>
              Vezměte si tento seznam k půdorysu bytu ještě před první schůzkou. Pomůže vám ujasnit si,
              co všechno od nového domova očekáváte.
            </p>
          </div>

          <div className="numbered-grid">
            <article>
              <b aria-hidden="true">✓</b>
              <div>
                <h3>1. Umístění velkých spotřebičů</h3>
                <p>Máte jasno, kde bude varná deska, trouba, myčka, pračka a případně sušička?</p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">✓</b>
              <div>
                <h3>2. Rozmístění nábytku a TV stěny</h3>
                <p>Víte, na které zdi bude viset TV a kde budou noční stolky a pracovní kout?</p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">✓</b>
              <div>
                <h3>3. Způsob ovládání osvětlení</h3>
                <p>Kde chcete mít možnost zhasnout světlo z více míst (vstup, chodba, postel)?</p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">✓</b>
              <div>
                <h3>4. Internet a slaboproud</h3>
                <p>Počítáte s pevným kabelem pro TV a počítač a s místem pro centrální Wi-Fi router?</p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">✓</b>
              <div>
                <h3>5. Rezervy pro budoucí technologie</h3>
                <p>Zvažujete do budoucna zabezpečení, venkovní žaluzie nebo klimatizaci?</p>
              </div>
            </article>

            <article>
              <b aria-hidden="true">✓</b>
              <div>
                <h3>6. Stav hlavního jističe</h3>
                <p>Máte dostatečný rezervovaný příkon (ideálně 3fáze) pro moderní indukční varnou desku?</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <FaqSection items={faqItems} />

      <InquiryForm
        defaultService="rekonstrukce"
        title="S čím Vám pomůžeme?"
      />

      <RelatedServices
        links={[
          { href: '/rekonstrukce', label: 'Rekonstrukce bytů a domů' },
          { href: '/zabezpeceni-a-automatizace', label: 'Zabezpečení a automatizace' },
          { href: '/data-a-slaboproud', label: 'Data a slaboproud' },
        ]}
      />
    </main>
  )
}
