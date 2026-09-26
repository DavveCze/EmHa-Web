import { createContext, useContext } from 'react'
import defaultContent from '../data/defaultContent.json'

export const ContentContext = createContext({
  content: defaultContent,
  refreshContent: () => Promise.resolve(),
})

export function useContent() {
  return useContext(ContentContext)
}
