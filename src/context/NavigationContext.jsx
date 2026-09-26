import { useState, useEffect, useCallback } from 'react'
import { NavigationContext } from './navigation-core.js'
import { ROUTE_SEO, generateJsonLd } from '../utils/seoData.js'
import { trackPageView } from '../config/analytics.js'

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
      if (to === '#top' || to === '#') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        if (window.location.hash) {
          window.history.pushState(null, '', window.location.pathname)
        }
        return
      }
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
        if (window.location.hash === '#top' || window.location.hash === '#') {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        } else {
          const el = document.getElementById(window.location.hash.slice(1))
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const meta = ROUTE_SEO[currentPath] || ROUTE_SEO['/']
    document.title = meta.title
    document.body.dataset.page = meta.page

    // Meta description
    let descEl = document.querySelector('meta[name="description"]')
    if (!descEl) {
      descEl = document.createElement('meta')
      descEl.name = 'description'
      document.head.appendChild(descEl)
    }
    descEl.content = meta.description

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.rel = 'canonical'
      document.head.appendChild(canonicalEl)
    }
    canonicalEl.href = meta.canonical

    // Open Graph tags
    const ogTags = {
      'og:title': meta.title,
      'og:description': meta.description,
      'og:url': meta.canonical,
      'og:type': 'website',
      'og:site_name': 'EmHa Elektro',
      'og:locale': 'cs_CZ',
    }
    Object.entries(ogTags).forEach(([property, content]) => {
      let ogEl = document.querySelector(`meta[property="${property}"]`)
      if (!ogEl) {
        ogEl = document.createElement('meta')
        ogEl.setAttribute('property', property)
        document.head.appendChild(ogEl)
      }
      ogEl.content = content
    })

    // JSON-LD structured data
    const jsonLd = generateJsonLd(currentPath)
    let jsonLdEl = document.getElementById('schema-jsonld')
    if (!jsonLdEl) {
      jsonLdEl = document.createElement('script')
      jsonLdEl.id = 'schema-jsonld'
      jsonLdEl.type = 'application/ld+json'
      document.head.appendChild(jsonLdEl)
    }
    jsonLdEl.textContent = JSON.stringify(jsonLd)

    // Virtual page view tracking for SPA analytics (if consented)
    trackPageView(currentPath, meta.title)
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
      value={{ currentPath, navigate, pageId: ROUTE_SEO[currentPath]?.page || 'index' }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
