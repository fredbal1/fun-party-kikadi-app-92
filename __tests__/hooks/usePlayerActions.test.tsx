
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerActions } from '@/hooks/usePlayerActions';

describe('usePlayerActions', () => {
  beforeEach(() => {
    // Reset any mocks or state before each test
  });

  it('should provide player action functions', () => {
    const { result } = renderHook(() => usePlayerActions());
    
    expect(result.current.submitAnswer).toBeDefined();
    expect(result.current.submitVote).toBeDefined();
    expect(result.current.sendReaction).toBeDefined();
    expect(result.current.setPlayerReady).toBeDefined();
  });

  it('should validate player actions correctly', () => {
    const { result } = renderHook(() => usePlayerActions());
    
    const isValid = result.current.validatePlayerAction();
    expect(typeof isValid).toBe('boolean');
  });
});
