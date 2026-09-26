import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Elektroinstalace from './pages/Elektroinstalace.jsx'
import Rekonstrukce from './pages/Rekonstrukce.jsx'
import ZabezpeceniAutomatizace from './pages/ZabezpeceniAutomatizace.jsx'
import NaCoMysletPriRekonstrukcich from './pages/NaCoMysletPriRekonstrukcich.jsx'
import OpravyServis from './pages/OpravyServis.jsx'
import DataSlaboproud from './pages/DataSlaboproud.jsx'
import JakPracujeme from './pages/JakPracujeme.jsx'
import Reference from './pages/Reference.jsx'
import Kontakt from './pages/Kontakt.jsx'
import { NavigationProvider } from './context/NavigationContext.jsx'

describe('EmHa Elektro application', () => {
  it('instantiates and renders App component without errors', () => {
    const html = renderToString(<App />)
    expect(html).toContain('EmHa Elektro')
    expect(html).toContain('Poctivá práce')
    expect(html).toContain('Ostrava a okolí')
  })

  it('renders all pages cleanly with their main headings and landmarks', () => {
    const pages = [
      { name: 'Home', Component: Home, keyword: 'S čím vám pomůžeme?' },
      { name: 'Elektroinstalace', Component: Elektroinstalace, keyword: 'Elektroinstalace v novostavbách' },
      { name: 'Rekonstrukce', Component: Rekonstrukce, keyword: 'Rekonstrukce bytů a domů' },
      { name: 'Zabezpečení a automatizace', Component: ZabezpeceniAutomatizace, keyword: 'Zabezpečení a automatizace' },
      { name: 'Na co myslet při rekonstrukcích', Component: NaCoMysletPriRekonstrukcich, keyword: 'Na co myslet při rekonstrukcích' },
      { name: 'Opravy a servis', Component: OpravyServis, keyword: 'Opravy a servis' },
      { name: 'Data a slaboproud', Component: DataSlaboproud, keyword: 'Data a slaboproud' },
      { name: 'Jak pracujeme', Component: JakPracujeme, keyword: 'Takhle pracujeme' },
      { name: 'Reference', Component: Reference, keyword: 'Za každým vypínačem je kus práce.' },
      { name: 'Kontakt', Component: Kontakt, keyword: 'Kontaktní údaje' },
    ]

    for (const { name, Component, keyword } of pages) {
      const html = renderToString(
        <NavigationProvider>
          <Component />
        </NavigationProvider>
      )
      expect(html, `Page ${name} should contain ${keyword}`).toContain(keyword)
      expect(html, `Page ${name} should have inquiry form`).toContain('inquiry-form')
    }
  })

  it('renders updated small-services section on home page matching client feedback', () => {
    const html = renderToString(
      <NavigationProvider>
        <Home />
      </NavigationProvider>
    )
    expect(html).toContain('href="/opravy-a-servis"')
    expect(html).toContain('href="/data-a-slaboproud"')
    expect(html).toContain('href="/zabezpeceni-a-automatizace"')
    expect(html).toContain('href="/na-co-myslet-pri-rekonstrukcich"')
  })

  it('includes antispam honeypot and required fields note on inquiry forms', () => {
    const html = renderToString(<App />)
    expect(html).toContain('Všechna pole jsou povinná.')
    expect(html).toContain('name="_hp_company"')
    expect(html).toContain('čl. 6 odst. 1 písm. b GDPR')
  })

  it('contains verified facts and does not fabricate certifications or revision authority', () => {
    const html = renderToString(<App />)
    expect(html).toContain('Revize a projektovou dokumentaci zajistíme ve spolupráci s revizním technikem a projektantem')
  })

  it('does not highlight "Služby" navigation button on the home page', () => {
    const html = renderToString(<App />)
    expect(html).not.toMatch(/class="services-toggle"[^>]*aria-current="page"/)
  })

  it('ensures services-toggle is only highlighted on actual service pages, not on menu expansion', () => {
    const html = renderToString(<App />)
    expect(html).not.toMatch(/services-toggle[^>]*aria-current="page"/)
  })

  it('renders worker photo across all subpages with normalized attributes', () => {
    const pages = [Elektroinstalace, Rekonstrukce, ZabezpeceniAutomatizace, NaCoMysletPriRekonstrukcich, OpravyServis, DataSlaboproud, JakPracujeme, Reference, Kontakt]
    for (const Page of pages) {
      const html = renderToString(
        <NavigationProvider>
          <Page />
        </NavigationProvider>
      )
      expect(html).toContain('contact-worker.png')
      expect(html).toContain('width="420"')
      expect(html).toContain('height="455"')
      expect(html).toContain('<h2>S čím Vám pomůžeme?</h2>')
    }
  })

  it('renders interactive links in system-labels on ZabezpeceniAutomatizace page', () => {
    const html = renderToString(
      <NavigationProvider>
        <ZabezpeceniAutomatizace />
      </NavigationProvider>
    )
    expect(html).toContain('href="#prehled"')
    expect(html).toContain('href="#scenare"')
    expect(html).toContain('href="#schema"')
  })

  it('includes GDPR notice below the submit button on forms', () => {
    const html = renderToString(<App />)
    expect(html).toContain('čl. 6 odst. 1 písm. b GDPR')
  })

  it('renders site-header with sticky navbar support', () => {
    const html = renderToString(<App />)
    expect(html).toContain('class="site-header "')
  })

  it('renders centered highlighted gallery carousel with controls and slides', () => {
    const html = renderToString(<App />)
    expect(html).toContain('gallery-carousel-wrapper')
    expect(html).toContain('gallery-track')
    expect(html).toContain('gallery-slide is-active')
  })

  it('does not render zoom badge inside gallery cards', () => {
    const html = renderToString(<App />)
    expect(html).not.toContain('gallery-zoom-badge')
    expect(html).not.toContain('🔍 Zvětšit')
  })

  it('renders balanced heading and split-tall image in NaCoMysletPriRekonstrukcich', () => {
    const html = renderToString(
      <NavigationProvider>
        <NaCoMysletPriRekonstrukcich />
      </NavigationProvider>
    )
    expect(html).toContain('<h2>Elektroinstalace má sloužit vám, ne vy jí.</h2>')
    expect(html).toContain('container split split-tall')
  })

  it('renders contact trade icons and green regional map card with Google Maps link in Kontakt', () => {
    const html = renderToString(
      <NavigationProvider>
        <Kontakt />
      </NavigationProvider>
    )
    expect(html).toContain('contact-item')
    expect(html).toContain('contact-icon')
    expect(html).toContain('map-card')
    expect(html).toContain('map-visual')
    expect(html).toContain('OSTRAVA')
    expect(html).toContain('https://www.google.com/maps/search/?api=1&amp;query=Ostrava')
  })

  it('renders responsive gallery bottom controls with navigation arrows and dot indicators', () => {
    const html = renderToString(<App />)
    expect(html).toContain('gallery-bottom-controls')
    expect(html).toContain('gallery-dots')
    expect(html).toContain('gallery-arrow-btn')
  })

  it('renders cookie consent banner and footer settings link', () => {
    const html = renderToString(<App />)
    expect(html).toContain('cookie-banner')
    expect(html).toContain('Nastavení ochrany soukromí a cookies')
    expect(html).toContain('Přijmout vše')
    expect(html).toContain('Pouze nezbytné')
    expect(html).toContain('Nastavení cookies')
  })
})
