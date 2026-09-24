import { useState, useEffect, useCallback } from 'react'
import { NavigationContext } from './navigation-core.js'


const ROUTE_CONFIG = {
  '/': {
    page: 'index',
    title: 'Poctivá práce. Spolehlivá elektřina. | EmHa Elektro',
    description: 'Poctivá práce. Spolehlivá elektřina. — EmHa Elektro. Elektroinstalace, rekonstrukce a chytrá domácnost v Ostravě a okolí.',
  },
  '/elektroinstalace': {
    page: 'elektroinstalace',
    title: 'Elektroinstalace v novostavbách | EmHa Elektro',
    description: 'Elektroinstalace v novostavbách — EmHa Elektro. Elektroinstalace, rekonstrukce a chytrá domácnost v Ostravě a okolí.',
  },
  '/rekonstrukce': {
    page: 'rekonstrukce',
    title: 'Rekonstrukce bytů a domů | EmHa Elektro',
    description: 'Rekonstrukce bytů a domů — EmHa Elektro. Elektroinstalace, rekonstrukce a chytrá domácnost v Ostravě a okolí.',
  },
  '/zabezpeceni-a-automatizace': {
    page: 'zabezpeceni-a-automatizace',
    title: 'Zabezpečení a automatizace | EmHa Elektro',
    description: 'Zabezpečení a automatizace — EmHa Elektro. Komplexní ochrana domácnosti a chytré scénáře Ajax v Ostravě a okolí.',
  },
  '/na-co-myslet-pri-rekonstrukcich': {
    page: 'na-co-myslet-pri-rekonstrukcich',
    title: 'Na co myslet při rekonstrukcích | EmHa Elektro',
    description: 'Na co myslet při rekonstrukci bytu či domu — EmHa Elektro. Praktický průvodce elektroinstalací, zásuvkami, osvětlením a koordinací řemesel.',
  },
  '/zabezpeceni': {
    page: 'zabezpeceni',
    title: 'Zabezpečení a automatizace | EmHa Elektro',
    description: 'Zabezpečení a automatizace — EmHa Elektro. Komplexní ochrana domácnosti a chytré scénáře Ajax v Ostravě a okolí.',
  },
  '/automatizace': {
    page: 'automatizace',
    title: 'Zabezpečení a automatizace | EmHa Elektro',
    description: 'Zabezpečení a automatizace — EmHa Elektro. Komplexní ochrana domácnosti a chytré scénáře Ajax v Ostravě a okolí.',
  },
  '/opravy-a-servis': {
    page: 'opravy-a-servis',
    title: 'Opravy a servis | EmHa Elektro',
    description: 'Opravy a servis — EmHa Elektro. Elektroinstalace, rekonstrukce a chytrá domácnost v Ostravě a okolí.',
  },
  '/data-a-slaboproud': {
    page: 'data-a-slaboproud',
    title: 'Data a slaboproud | EmHa Elektro',
    description: 'Data a slaboproud — EmHa Elektro. Elektroinstalace, rekonstrukce a chytrá domácnost v Ostravě a okolí.',
  },
  '/jak-pracujeme': {
    page: 'jak-pracujeme',
    title: 'Jak pracujeme | EmHa Elektro',
    description: 'Jak pracujeme — EmHa Elektro. Elektroinstalace, rekonstrukce a chytrá domácnost v Ostravě a okolí.',
  },
  '/reference': {
    page: 'reference',
    title: 'Reference | EmHa Elektro',
    description: 'Reference — EmHa Elektro. Elektroinstalace, rekonstrukce a chytrá domácnost v Ostravě a okolí.',
  },
  '/kontakt': {
    page: 'kontakt',
    title: 'Kontakt | EmHa Elektro',
    description: 'Kontakt — EmHa Elektro. Elektroinstalace, rekonstrukce a chytrá domácnost v Ostravě a okolí.',
  },
}

function normalizePath(rawPath) {
  if (!rawPath) return '/'
  let path = rawPath.split('?')[0].split('#')[0]
  if (path.endsWith('.html')) {
    path = path.slice(0, -5)
  }
  if (path === '/index' || path === '') {
    path = '/'
  }
  return path || '/'
}

export function NavigationProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') return '/'
    return normalizePath(window.location.pathname)
  })

  const navigate = useCallback((to, options = {}) => {
    if (typeof window === 'undefined') return
    const { replace = false } = options

    if (to.startsWith('#')) {
      const el = document.getElementById(to.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', to)
      }
      return
    }

    const [targetPath, hash] = to.split('#')
    const normalized = normalizePath(targetPath)

    if (replace) {
      window.history.replaceState(null, '', to)
    } else {
      window.history.pushState(null, '', to)
    }

    setCurrentPath(normalized)

    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      const normalized = normalizePath(window.location.pathname)
      setCurrentPath(normalized)
      if (window.location.hash) {
        const el = document.getElementById(window.location.hash.slice(1))
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const meta = ROUTE_CONFIG[currentPath] || ROUTE_CONFIG['/']
    document.title = meta.title
    document.body.dataset.page = meta.page

    let descEl = document.querySelector('meta[name="description"]')
    if (!descEl) {
      descEl = document.createElement('meta')
      descEl.name = 'description'
      document.head.appendChild(descEl)
    }
    descEl.content = meta.description
  }, [currentPath])

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }

      if (href.startsWith('#')) {
        e.preventDefault()
        navigate(href)
        return
      }

      e.preventDefault()
      navigate(href)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [navigate])

  return (
    <NavigationContext.Provider
      value={{ currentPath, navigate, pageId: ROUTE_CONFIG[currentPath]?.page || 'index' }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
