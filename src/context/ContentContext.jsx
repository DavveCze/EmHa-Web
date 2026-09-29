import { useState, useEffect, useCallback } from 'react'
import defaultContent from '../data/defaultContent.json'
import { ContentContext } from './content-core.js'

const IS_CMS_ENABLED = import.meta.env.VITE_CMS_ENABLED !== 'false'

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent)

  const refreshContent = useCallback(async (newContent) => {
    if (!IS_CMS_ENABLED) return

    if (newContent && typeof newContent === 'object' && newContent.business) {
      setContent(newContent)
      try {
        localStorage.setItem('emha_content_updated', String(Date.now()))
      } catch {
        // LocalStorage not available or quota exceeded
      }
      return
    }

    try {
      const res = await fetch(`/api/content.php?t=${Date.now()}`, { cache: 'no-cache' })
      if (res.ok) {
        const json = await res.json()
        if (json && json.business) {
          setContent(json)
          try {
            localStorage.setItem('emha_content_updated', String(Date.now()))
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // Keep bundled defaultContent
    }
  }, [])

  useEffect(() => {
    if (!IS_CMS_ENABLED) return

    let ignore = false
    async function initFetch() {
      try {
        const res = await fetch(`/api/content.php?t=${Date.now()}`)
        if (!ignore && res.ok) {
          const json = await res.json()
          if (!ignore && json && json.business) {
            setContent(json)
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error)
      }
    }

    initFetch()

    const handleStorage = (e) => {
      if (e.key === 'emha_content_updated') {
        refreshContent()
      }
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      ignore = true
      window.removeEventListener('storage', handleStorage)
    }
  }, [refreshContent])

  return (
    <ContentContext.Provider value={{ content, refreshContent }}>
      {children}
    </ContentContext.Provider>
  )
}
