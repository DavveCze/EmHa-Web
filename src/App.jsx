import { lazy, Suspense } from 'react'
import { NavigationProvider } from './context/NavigationContext.jsx'
import { useNavigation } from './context/navigation-core.js'
import { ContentProvider } from './context/ContentContext.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CookieConsent from './components/CookieConsent.jsx'
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
import ZasadyOchranyUdaju from './pages/ZasadyOchranyUdaju.jsx'

const IS_CMS_ENABLED = import.meta.env.VITE_CMS_ENABLED !== 'false'
const AdminPage = IS_CMS_ENABLED ? lazy(() => import('./pages/admin/AdminPage.jsx')) : null

function renderPage(path) {
  switch (path) {
    case '/elektroinstalace':
      return <Elektroinstalace />
    case '/rekonstrukce':
      return <Rekonstrukce />
    case '/zabezpeceni-a-automatizace':
    case '/zabezpeceni':
    case '/automatizace':
      return <ZabezpeceniAutomatizace />
    case '/na-co-myslet-pri-rekonstrukcich':
      return <NaCoMysletPriRekonstrukcich />
    case '/opravy-a-servis':
      return <OpravyServis />
    case '/data-a-slaboproud':
      return <DataSlaboproud />
    case '/jak-pracujeme':
      return <JakPracujeme />
    case '/reference':
      return <Reference />
    case '/kontakt':
      return <Kontakt />
    case '/zasady-ochrany-osobnich-udaju':
    case '/ochrana-osobnich-udaju':
      return <ZasadyOchranyUdaju />
    case '/':
    default:
      return <Home />
  }
}

function MainContent() {
  const { currentPath } = useNavigation()

  if (IS_CMS_ENABLED && AdminPage && currentPath === '/admin') {
    return (
      <Suspense fallback={<div className="admin-loading-screen"><div className="admin-spinner" /><p>Načítám administraci…</p></div>}>
        <AdminPage />
      </Suspense>
    )
  }

  return (
    <>
      <Header />
      {renderPage(currentPath)}
      <Footer />
      <CookieConsent />
    </>
  )
}

function App() {
  return (
    <ContentProvider>
      <NavigationProvider>
        <MainContent />
      </NavigationProvider>
    </ContentProvider>
  )
}

export default App
