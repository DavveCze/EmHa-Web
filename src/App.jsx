import { NavigationProvider } from './context/NavigationContext.jsx'
import { useNavigation } from './context/navigation-core.js'
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
    case '/':
    default:
      return <Home />
  }
}

function MainContent() {
  const { currentPath } = useNavigation()

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
    <NavigationProvider>
      <MainContent />
    </NavigationProvider>
  )
}

export default App
