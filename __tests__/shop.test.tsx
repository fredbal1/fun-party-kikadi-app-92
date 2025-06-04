
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Shop from '@/pages/Shop'

// Mock du store pour les tests
vi.mock('@/store/gameStore', () => ({
  useGameStore: () => ({
    currentUser: {
      id: 'test-user',
      pseudo: 'TestUser',
      pieces: 500,
    },
    updateUserCoins: vi.fn(),
  }),
}))

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Boutique KIKADI', () => {
  const renderShop = () => {
    return render(
      <BrowserRouter>
        <Shop />
      </BrowserRouter>
    )
  }

  it('devrait afficher le titre de la boutique', () => {
    renderShop()
    expect(screen.getByText('Boutique')).toBeInTheDocument()
  })

  it('devrait afficher les onglets de catégories', () => {
    renderShop()
    expect(screen.getByText('Avatars')).toBeInTheDocument()
    expect(screen.getByText('Titres')).toBeInTheDocument()
    expect(screen.getByText('Effets')).toBeInTheDocument()
  })

  it('devrait afficher le nombre de pièces du joueur', () => {
    renderShop()
    expect(screen.getByText('500')).toBeInTheDocument()
  })
})
