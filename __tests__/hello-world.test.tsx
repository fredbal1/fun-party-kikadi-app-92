
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Composant simple pour tester la configuration
const HelloWorld = () => <div>Hello KIKADI!</div>

describe('Configuration de test', () => {
  it('devrait rendre le composant Hello World', () => {
    render(<HelloWorld />)
    expect(screen.getByText('Hello KIKADI!')).toBeInTheDocument()
  })

  it('devrait faire un test mathématique simple', () => {
    expect(2 + 2).toBe(4)
  })

  it('devrait vérifier que les imports TypeScript fonctionnent', () => {
    const testArray: string[] = ['test', 'vitest', 'kikadi']
    expect(testArray).toHaveLength(3)
    expect(testArray.includes('kikadi')).toBe(true)
  })
})
