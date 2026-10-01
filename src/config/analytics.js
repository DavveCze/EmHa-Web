/**
 * Analytics configuration & dynamic loader for EmHa Elektro
 * Supports Google Analytics 4 (GA4) and Microsoft Clarity.
 *
 * IMPORTANT (CZ/EU ePrivacy & GDPR):
 * Scripts MUST NOT be loaded until the user explicitly grants
 * analytical cookie consent in the Cookie Consent Banner.
 */

export const ANALYTICS_CONFIG = {
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-7XNY22YM55',
  clarityProjectId: import.meta.env.VITE_CLARITY_PROJECT_ID || 'yqtth3sc26',
}

let isInitialized = false

/**
 * Validates whether an ID is a real value and not an empty or template placeholder.
 */
function isValidId(id) {
  if (!id) return false
  const trimmed = id.trim()
  if (trimmed === '' || trimmed.includes('XXXXXXXXXX') || trimmed === 'G-XXXXXXXXXX') {
    return false
  }
  return true
}

/**
 * Loads the Google Analytics 4 gtag.js script and initializes dataLayer.
 */
export function loadGoogleAnalytics(measurementId) {
  if (typeof window === 'undefined') return
  if (!isValidId(measurementId)) {
    // In development or prior to real ID setup, maintain a stub dataLayer for event safety
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments)
    }
    return
  }

  // Check if gtag script is already present
  if (document.getElementById('ga-gtag-script')) return

  const script = document.createElement('script')
  script.id = 'ga-gtag-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  // Disable automatic initial pageview so React SPA can manage virtual pageviews precisely
  window.gtag('config', measurementId, {
    send_page_view: false,
    anonymize_ip: true,
  })
}

/**
 * Loads Microsoft Clarity tracking script.
 */
export function loadMicrosoftClarity(projectId) {
  if (typeof window === 'undefined') return
  if (!isValidId(projectId)) return

  // Check if Clarity is already injected
  if (window.clarity) return

  ;(function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        ;(c[a].q = c[a].q || []).push(arguments)
      }
    t = l.createElement(r)
    t.async = 1
    t.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(i)
    y = l.getElementsByTagName(r)[0]
    if (y && y.parentNode) {
      y.parentNode.insertBefore(t, y)
    } else {
      document.head.appendChild(t)
    }
  })(window, document, 'clarity', 'script', projectId)
}

/**
 * Initializes all consented analytical services.
 * Call only when analytical consent is confirmed by the visitor.
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return
  if (isInitialized) return

  const { gaMeasurementId, clarityProjectId } = ANALYTICS_CONFIG

  if (gaMeasurementId) {
    loadGoogleAnalytics(gaMeasurementId)
  }

  if (clarityProjectId) {
    loadMicrosoftClarity(clarityProjectId)
  }

  isInitialized = true
}

/**
 * Sends a virtual pageview to Google Analytics upon client-side SPA navigation.
 */
export function trackPageView(path, title) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  })
}

/**
 * Sends a custom conversion or engagement event.
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}

export function isAnalyticsActive() {
  return isInitialized
}
