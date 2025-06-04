
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamePhases } from '@/hooks/useGamePhases';

// Mock du store
const mockGameStore = {
  currentGame: {
    id: 'game-1',
    current_mini_jeu: 'kikadi',
    current_phase: 'intro'
  },
  currentPhase: 'intro',
  setCurrentPhase: vi.fn(),
  players: [
    { id: 'player-1', current_phase_state: 'ready', role: 'joueur' },
    { id: 'player-2', current_phase_state: 'ready', role: 'joueur' }
  ],
  isHost: true
};

vi.mock('@/store/selectors/gameSelectors', () => ({
  useCurrentGame: () => mockGameStore.currentGame,
  useCurrentPhase: () => mockGameStore.currentPhase,
  usePlayers: () => mockGameStore.players,
  useIsHost: () => mockGameStore.isHost
}));

vi.mock('@/store/gameStore', () => ({
  useGameStore: () => ({ setCurrentPhase: mockGameStore.setCurrentPhase })
}));

describe('useGamePhases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return current phase correctly', () => {
    const { result } = renderHook(() => useGamePhases());
    
    expect(result.current.currentPhase).toBe('intro');
    expect(result.current.isFirstPhase).toBe(true);
    expect(result.current.isLastPhase).toBe(false);
  });

  it('should validate phase transitions correctly', () => {
    const { result } = renderHook(() => useGamePhases());
    
    // From intro, can only go to answering
    expect(result.current.canAdvancePhase('answering')).toBe(true);
    expect(result.current.canAdvancePhase('voting')).toBe(false);
  });

  it('should calculate phase progress correctly', () => {
    const { result } = renderHook(() => useGamePhases());
    
    const progress = result.current.getPhaseProgress();
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThanOrEqual(100);
  });

  it('should return correct time limits for phases', () => {
    const { result } = renderHook(() => useGamePhases());
    
    expect(result.current.getPhaseTimeLimit('answering')).toBe(60);
    expect(result.current.getPhaseTimeLimit('voting')).toBe(30);
    expect(result.current.getPhaseTimeLimit('intro')).toBe(10);
  });

  it('should advance phase when conditions are met', () => {
    // Simulate all players answered
    mockGameStore.players = [
      { id: 'player-1', current_phase_state: 'answered', role: 'joueur' },
      { id: 'player-2', current_phase_state: 'answered', role: 'joueur' }
    ];
    mockGameStore.currentPhase = 'answering';

    const { result } = renderHook(() => useGamePhases());
    
    act(() => {
      const success = result.current.advancePhase();
      expect(success).toBe(true);
    });
  });

  it('should not advance phase when not host', () => {
    mockGameStore.isHost = false;
    
    const { result } = renderHook(() => useGamePhases());
    
    expect(result.current.canAdvancePhase('answering')).toBe(false);
  });
});
