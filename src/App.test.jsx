import { describe, it, expect } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('instantiates the App component without errors', () => {
    const tree = App()
    expect(tree).toBeDefined()
    expect(tree.type).toBeDefined()
  })
})
