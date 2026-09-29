/**
 * Centralized SEO & Structured Data (JSON-LD) configuration for EmHa Elektro
 * Follows schema.org standards for LocalBusiness/Electrician, Service, and FAQPage.
 */

export const SITE_URL = 'https://emha-elektro.cz'

export const BUSINESS_INFO = {
  name: 'EmHa Elektro',
  legalName: 'Martin Hořčica',
  taxID: '14216132',
  identifier: '14216132',
  description:
    'Profesionální elektroinstalace pro novostavby a rekonstrukce bytů i domů v Ostravě a Moravskoslezském kraji. Zabezpečení Ajax, automatizace a slaboproud.',
  telephone: '+420731833605',
  email: 'info@emha-elektro.cz',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Tlapákova 1242/15',
    addressLocality: 'Ostrava - Hrabůvka',
    postalCode: '70030',
    addressRegion: 'Moravskoslezský kraj',
    addressCountry: 'CZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '49.8209',
    longitude: '18.2625',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Moravskoslezský kraj' },
    { '@type': 'City', name: 'Ostrava' },
    { '@type': 'City', name: 'Havířov' },
    { '@type': 'City', name: 'Frýdek-Místek' },
    { '@type': 'City', name: 'Karviná' },
    { '@type': 'City', name: 'Opava' },
    { '@type': 'City', name: 'Bohumín' },
    { '@type': 'City', name: 'Orlová' },
    { '@type': 'City', name: 'Třinec' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  ],
  priceRange: '$$',
}

export const ROUTE_SEO = {
  '/': {
    page: 'index',
    title: 'Elektroinstalace a rekonstrukce Ostrava | EmHa Elektro',
    description:
      'Kompletní elektroinstalace rodinných domů, bytů a rekonstrukce v Ostravě a okolí. Poctivé řemeslo, bezpečné rozvody a konzultace zdarma.',
    canonical: `${SITE_URL}/`,
  },
  '/elektroinstalace': {
    page: 'elektroinstalace',
    title: 'Elektroinstalace v novostavbách Ostrava | EmHa Elektro',
    description:
      'Kompletní elektroinstalace novostaveb a domů v Ostravě. Návrh rozvodů, rozvaděče, zásuvky i příprava na chytrou domácnost. Poptat kalkulaci.',
    canonical: `${SITE_URL}/elektroinstalace`,
    service: {
      name: 'Elektroinstalace v novostavbách a rodinných domech',
      serviceType: 'Elektroinstalace v novostavbách',
      description:
        'Kompletní silnoproudé rozvody, rozvaděče, koncové prvky, osvětlení a příprava na technologie v nových rodinných domech a bytech.',
    },
    faqs: [
      {
        q: 'Kdy je nejlepší se ozvat k elektroinstalaci v novostavbě?',
        a: 'Ideálně ještě při přípravě projektu. Umístění světel, zásuvek a datových rozvodů je lépe řešit před začátkem instalačních prací.',
      },
      {
        q: 'Co potřebujete pro vypracování cenové nabídky?',
        a: 'Pomůže popis plánovaných prací, lokalita, přibližný termín a případně půdorys nebo projektová dokumentace. Podrobnosti probereme při úvodní konzultaci zdarma.',
      },
      {
        q: 'Můžeme v novostavbě připravit i chytrou domácnost nebo zabezpečení?',
        a: 'Ano, už při plánování hrubých rozvodů připravíme potřebnou kabeláž pro chytré prvky, zabezpečovací systém Ajax i datové sítě.',
      },
    ],
  },
  '/rekonstrukce': {
    page: 'rekonstrukce',
    title: 'Rekonstrukce elektroinstalace v bytě | EmHa Elektro',
    description:
      'Výměna starých hliníkových rozvodů za bezpečnou měď v bytech i domech v Ostravě. Nová elektřina přizpůsobená vašemu bydlení. Konzultace zdarma.',
    canonical: `${SITE_URL}/rekonstrukce`,
    service: {
      name: 'Rekonstrukce elektroinstalace v bytech a rodinných domech',
      serviceType: 'Rekonstrukce elektroinstalace',
      description:
        'Kompletní výměna nevyhovujících hliníkových rozvodů za moderní měděnou instalaci s proudovými chrániči, novým rozvaděčem a bezpečnými okruhy.',
    },
    faqs: [
      {
        q: 'Lze rekonstruovat jen část elektroinstalace v bytě?',
        a: 'Možnosti posoudíme podle stavu stávající instalace. Důležité je, aby na sebe původní a nová část bezpečně navazovaly a nepřetěžovaly se staré hliníkové okruhy.',
      },
      {
        q: 'Dá se během rekonstrukce elektroinstalace v bytě bydlet?',
        a: 'Záleží na rozsahu prací. Předem spolu probereme prašnost, odstávky proudu a případné rozdělení prací do jednotlivých etap.',
      },
      {
        q: 'Kdy je potřeba definitivně rozhodnout umístění zásuvek a vypínačů?',
        a: 'Ještě před zahájením drážkování do zdí. Zásadní je mít schválený plán kuchyňské linky, rozmístění nábytku a spotřebičů.',
      },
    ],
  },
  '/zabezpeceni-a-automatizace': {
    page: 'zabezpeceni-a-automatizace',
    title: 'Zabezpečení Ajax a automatizace domů | EmHa Elektro',
    description:
      'Certifikovaná montáž bezdrátových alarmů Ajax a chytré automatizace pro byty i domy v Ostravě a kraji. Ochrana před vloupáním, požárem i vodou.',
    canonical: `${SITE_URL}/zabezpeceni-a-automatizace`,
    service: {
      name: 'Montáž zabezpečení Ajax a chytré automatizace',
      serviceType: 'Zabezpečovací systémy a automatizace',
      description:
        'Instalace certifikovaných bezpečnostních systémů Ajax s ochranou proti vniknutí, požáru a zatopení, doplněná o automatické scénáře pro pohodlí.',
    },
    faqs: [
      {
        q: 'Lze zabezpečení a automatizaci instalovat i do hotového bytu či domu?',
        a: 'Ano, moderní bezdrátové prvky Ajax lze instalovat čistě a bez sekání i do zařízeného interiéru. Při rekonstrukci nebo novostavbě naopak rádi připravíme skrytou kabeláž.',
      },
      {
        q: 'Jak funguje automatické uzavření vody při havárii?',
        a: 'Při kontaktu bezdrátového čidla s vodou pošle systém signál do chytrého ventilu na hlavním přívodu vody, který se během několika sekund uzavře a do mobilu vám dorazí okamžitá notifikace.',
      },
      {
        q: 'Zvládne systém ovládat celá rodina?',
        a: 'Ano, ovládání je intuitivní v české mobilní aplikaci, pomocí klíčenek s tlačítkem nebo kódovou klávesnicí u vchodu. Při předání vše společně nastavíme a vysvětlíme.',
      },
      {
        q: 'Co se stane při výpadku elektřiny nebo internetu?',
        a: 'Centrální jednotka má záložní baterii s výdrží mnoha hodin a kromě Wi-Fi/LAN připojení disponuje i slotem na SIM kartu pro nezávislou mobilní síť.',
      },
    ],
  },
  '/na-co-myslet-pri-rekonstrukcich': {
    page: 'na-co-myslet-pri-rekonstrukcich',
    title: 'Na co myslet při rekonstrukci elektro | EmHa Elektro',
    description:
      'Praktický průvodce elektroinstalací při rekonstrukci bytu. Zásuvky, kuchyňské okruhy, normy v koupelně a checklist před nástupem zedníků.',
    canonical: `${SITE_URL}/na-co-myslet-pri-rekonstrukcich`,
    faqs: [
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
    ],
  },
  '/opravy-a-servis': {
    page: 'opravy-a-servis',
    title: 'Opravy a servis elektroinstalací Ostrava | EmHa Elektro',
    description:
      'Opravy nefunkčních zásuvek, vypínačů, osvětlení a přetížení jističů v Ostravě a okolí. Spolehlivý elektrikář pro rychlý a odborný servis doma.',
    canonical: `${SITE_URL}/opravy-a-servis`,
    service: {
      name: 'Opravy a servis domácích elektroinstalací',
      serviceType: 'Servis a opravy elektroinstalace',
      description:
        'Diagnostika poruch, výměny poškozených prvků, oprava padajících jističů a bezpečné zapojení spotřebičů.',
    },
    faqs: [
      {
        q: 'Provádíte i drobné opravy v domácnostech?',
        a: 'Ano, můžete se na nás obrátit s výměnou nefunkčního vypínače, zásuvky, svítidla i drobnou úpravou elektrického okruhu.',
      },
      {
        q: 'Jak rychle můžete na opravu dorazit?',
        a: 'Termín závisí na povaze závady a aktuální kapacitě. Nenabízíme nepřetržitou havarijní pohotovost, ale drobné závady řešíme v co nejkratším možném termínu.',
      },
      {
        q: 'Kolik bude oprava stát?',
        a: 'Cena se odvíjí od příčiny závady, času práce a použitého materiálu. Před zahájením opravy si vždy upřesníme předpokládaný rozsah a cenu.',
      },
    ],
  },
  '/data-a-slaboproud': {
    page: 'data-a-slaboproud',
    title: 'Datové rozvody a domácí sítě Ostrava | EmHa Elektro',
    description:
      'Strukturovaná kabeláž Cat6, stabilní domácí Wi-Fi, datové zásuvky a TV rozvody pro byty i novostavby v Ostravě a okolí. Poptat realizaci sítě.',
    canonical: `${SITE_URL}/data-a-slaboproud`,
    service: {
      name: 'Datové rozvody, strukturovaná kabeláž a slaboproud',
      serviceType: 'Slaboproudé a datové rozvody',
      description:
        'Návrh a instalace datových kabelů Cat6/Cat6a, příprava pro Wi-Fi AP body, televizní rozvody a slaboproudá kabeláž v domácnostech.',
    },
    faqs: [
      {
        q: 'Jaký typ kabeláže pro domácí síť doporučujete?',
        a: 'Standardem pro spolehlivou domácí síť je strukturovaná kabeláž Cat6 nebo Cat6a v gigabitovém či 10Gb standardu. Kabely vedeme v chráničkách do centrálního místa pro router či rack.',
      },
      {
        q: 'Nestačí v dnešní době pouze Wi-Fi bez kabelů?',
        a: 'Wi-Fi je skvělá pro telefony a tablety, ale pro stabilní práci z domova, streamování 4K videa, herní konzole a chytrou TV je pevný kabel nepřekonatelný. Pevné kabely navíc spolehlivě napájejí stropní Wi-Fi přístupové body (PoE).',
      },
      {
        q: 'Připravíte i rozvody pro televizní signál a zabezpečení?',
        a: 'Ano. Společně s datovými kabely instalujeme koaxiální TV rozvody, kabeláž pro domovní videotelefony, kamerový systém i přípravu pro chytré zabezpečení Ajax.',
      },
    ],
  },
  '/jak-pracujeme': {
    page: 'jak-pracujeme',
    title: 'Jak pracujeme — průběh elektroinstalace | EmHa Elektro',
    description:
      'Férový postup elektroinstalace od úvodní konzultace a přehledného rozpočtu přes čistou montáž až po výchozí revizi. Zjistěte, jak probíhá zakázka.',
    canonical: `${SITE_URL}/jak-pracujeme`,
    faqs: [
      {
        q: 'Je úvodní konzultace a cenová nabídka nezávazná?',
        a: 'Ano, úvodní prohlídka na místě stavby či v bytě a vypracování položkového rozpočtu jsou zcela nezávazné a zdarma.',
      },
      {
        q: 'Jak probíhá koordinace s ostatními řemesly?',
        a: 'Předem sladíme harmonogram se zedníky, sádrokartonáři i obkladači. Klíčové je mít připravené rozvody před omítkami a podlahami, abychom se na stavbě vzájemně neblokovali.',
      },
      {
        q: 'Zajistíte výchozí revizní zprávu a dokumentaci?',
        a: 'Ano. Po dokončení a proměření instalace zajistíme výchozí revizi elektroinstalace ve spolupráci s certifikovaným revizním technikem, včetně protokolu potřebného ke kolaudaci.',
      },
    ],
  },
  '/reference': {
    page: 'reference',
    title: 'Reference a recenze elektroinstalací Ostrava | EmHa Elektro',
    description:
      'Ukázky rekonstrukcí bytů, rozvaděčů a elektroinstalací rodinných domů v Ostravě a okolí. Přečtěte si recenze, standardy poctivého řemesla a prohlédněte galerii.',
    canonical: `${SITE_URL}/reference`,
  },
  '/kontakt': {
    page: 'kontakt',
    title: 'Kontakt a poptávka elektroinstalace | EmHa Elektro',
    description:
      'Poptáváte novou elektroinstalaci, rekonstrukci nebo servis v Ostravě a okolí? Zavolejte nám, napište e-mail nebo odešlete nezávazný formulář.',
    canonical: `${SITE_URL}/kontakt`,
  },
  '/zasady-ochrany-osobnich-udaju': {
    page: 'zasady-ochrany-osobnich-udaju',
    title: 'Zásady zpracování osobních údajů (GDPR) | EmHa Elektro',
    description:
      'Informace o zpracování a ochraně osobních údajů zákazníků dle GDPR. Účely, právní základ a práva subjektů údajů u EmHa Elektro Martin Hořčica.',
    canonical: `${SITE_URL}/zasady-ochrany-osobnich-udaju`,
  },
}

// Aliases
ROUTE_SEO['/zabezpeceni'] = ROUTE_SEO['/zabezpeceni-a-automatizace']
ROUTE_SEO['/automatizace'] = ROUTE_SEO['/zabezpeceni-a-automatizace']

/**
 * Generates the full JSON-LD @graph for a given route
 */
export function generateJsonLd(path, businessOverride = null) {
  const normalized = path === '' || path === '/index' ? '/' : path.split('?')[0].split('#')[0]
  const config = ROUTE_SEO[normalized] || ROUTE_SEO['/']

  const b = businessOverride || {}
  const businessNode = {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    '@id': `${SITE_URL}/#business`,
    name: b.name || BUSINESS_INFO.name,
    legalName: b.legalName || BUSINESS_INFO.legalName,
    description: BUSINESS_INFO.description,
    url: SITE_URL,
    telephone: b.phoneRaw || b.phone || BUSINESS_INFO.telephone,
    email: b.email || BUSINESS_INFO.email,
    address: {
      ...BUSINESS_INFO.address,
      streetAddress: b.street || BUSINESS_INFO.address.streetAddress,
      addressLocality: b.city || BUSINESS_INFO.address.addressLocality,
      postalCode: b.zip || BUSINESS_INFO.address.postalCode,
    },
    geo: BUSINESS_INFO.geo,
    areaServed: BUSINESS_INFO.areaServed,
    openingHoursSpecification: BUSINESS_INFO.openingHoursSpecification,
    priceRange: BUSINESS_INFO.priceRange,
    image: `${SITE_URL}/assets/hero-v2.jpg`,
  }

  const graph = [businessNode]

  // Add Service schema if applicable
  if (config.service) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${config.canonical}#service`,
      name: config.service.name,
      serviceType: config.service.serviceType,
      description: config.service.description,
      provider: { '@id': `${SITE_URL}/#business` },
      areaServed: BUSINESS_INFO.areaServed,
      url: config.canonical,
    })
  }

  // Add FAQPage schema if applicable
  if (config.faqs && config.faqs.length > 0) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${config.canonical}#faq`,
      mainEntity: config.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
