import { useState, useEffect, useCallback } from 'react'
import defaultContent from '../data/defaultContent.json'
import { ContentContext } from './content-core.js'

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent)

  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content.php')
      if (res.ok) {
        const json = await res.json()
        if (json && json.business) {
          setContent(json)
        }
      }
    } catch {
      // Keep bundled defaultContent
    }
  }, [])

  useEffect(() => {
    let ignore = false
    async function initFetch() {
      try {
        const res = await fetch('/api/content.php')
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
    return () => {
      ignore = true
    }
  }, [])

  return (
    <ContentContext.Provider value={{ content, refreshContent }}>
      {children}
    </ContentContext.Provider>
  )
}
