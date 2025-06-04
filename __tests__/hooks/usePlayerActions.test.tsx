
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePlayerActions } from '@/hooks/usePlayerActions';

// Mock des stores et sélecteurs
const mockCurrentPlayer = {
  id: 'player-1',
  user_id: 'user-1',
  game_id: 'game-1',
  pseudo: 'TestPlayer',
  is_ready: false,
  is_connected: true,
  current_phase_state: 'ready',
  score: 0,
  is_host: false
};

const mockCurrentGame = {
  id: 'game-1',
  current_round: 1,
  current_phase: 'answering'
};

const mockUpdatePlayer = vi.fn();
const mockAddNotification = vi.fn();
const mockTriggerEffect = vi.fn();

vi.mock('@/store/selectors/gameSelectors', () => ({
  useCurrentPlayer: () => mockCurrentPlayer,
  useCurrentGame: () => mockCurrentGame,
  useCurrentPhase: () => 'answering',
  usePlayers: () => [mockCurrentPlayer]
}));

vi.mock('@/store/gameStore', () => ({
  useGameStore: () => ({ updatePlayer: mockUpdatePlayer })
}));

vi.mock('@/store/uiStore', () => ({
  useUIStore: () => ({
    addNotification: mockAddNotification,
    triggerEffect: mockTriggerEffect
  })
}));

describe('usePlayerActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit answer successfully', async () => {
    const { result } = renderHook(() => usePlayerActions());
    
    await act(async () => {
      const success = await result.current.submitAnswer('Ma réponse test');
      expect(success).toBe(true);
    });

    expect(mockUpdatePlayer).toHaveBeenCalledWith('player-1', {
      current_phase_state: 'answered'
    });
    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        message: 'Réponse envoyée !'
      })
    );
  });

  it('should not submit empty answer', async () => {
    const { result } = renderHook(() => usePlayerActions());
    
    await act(async () => {
      const success = await result.current.submitAnswer('');
      expect(success).toBe(false);
    });

    expect(mockUpdatePlayer).not.toHaveBeenCalled();
    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'warning',
        message: 'Veuillez saisir une réponse'
      })
    );
  });

  it('should submit vote successfully', async () => {
    // Change phase to voting
    vi.mocked(require('@/store/selectors/gameSelectors').useCurrentPhase).mockReturnValue('voting');
    
    const { result } = renderHook(() => usePlayerActions());
    
    await act(async () => {
      const success = await result.current.submitVote('player-2', 'association', 'vote-value');
      expect(success).toBe(true);
    });

    expect(mockUpdatePlayer).toHaveBeenCalledWith('player-1', {
      current_phase_state: 'voted'
    });
  });

  it('should not allow self-voting', async () => {
    vi.mocked(require('@/store/selectors/gameSelectors').useCurrentPhase).mockReturnValue('voting');
    
    const { result } = renderHook(() => usePlayerActions());
    
    await act(async () => {
      const success = await result.current.submitVote('player-1', 'association', 'vote-value');
      expect(success).toBe(false);
    });

    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'warning',
        message: 'Vous ne pouvez pas voter pour vous-même'
      })
    );
  });

  it('should send reaction with auto-clear', async () => {
    vi.useFakeTimers();
    
    const { result } = renderHook(() => usePlayerActions());
    
    await act(async () => {
      const success = await result.current.sendReaction('😂');
      expect(success).toBe(true);
    });

    expect(mockUpdatePlayer).toHaveBeenCalledWith('player-1', {
      reaction: '😂'
    });

    // Avancer le temps pour tester l'auto-clear
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockUpdatePlayer).toHaveBeenCalledWith('player-1', {
      reaction: undefined
    });

    vi.useRealTimers();
  });

  it('should set player ready status', async () => {
    const { result } = renderHook(() => usePlayerActions());
    
    await act(async () => {
      const success = await result.current.setPlayerReady(true);
      expect(success).toBe(true);
    });

    expect(mockUpdatePlayer).toHaveBeenCalledWith('player-1', {
      is_ready: true
    });
  });

  it('should return correct derived state', () => {
    const { result } = renderHook(() => usePlayerActions());
    
    expect(result.current.canSubmitAnswer).toBe(true);
    expect(result.current.isReady).toBe(false);
    expect(result.current.isConnected).toBe(true);
    expect(result.current.currentPlayer).toEqual(mockCurrentPlayer);
  });
});
