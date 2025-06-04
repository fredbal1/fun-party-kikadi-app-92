
import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle user login', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
    expect(result.current.user?.email).toBe('test@example.com');
  });

  it('should handle user logout', () => {
    const { result } = renderHook(() => useAuthStore());
    
    // First login
    act(() => {
      result.current.setUser({
        id: 'user-1',
        pseudo: 'TestUser',
        email: 'test@example.com',
        role: 'joueur',
        xp: 100,
        pieces: 50,
        niveau: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    
    // Then logout
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should update user profile', () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Set initial user
    act(() => {
      result.current.setUser({
        id: 'user-1',
        pseudo: 'OldName',
        email: 'test@example.com',
        role: 'joueur',
        xp: 100,
        pieces: 50,
        niveau: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });
    
    // Update profile
    act(() => {
      result.current.updateProfile({
        pseudo: 'NewName',
        xp: 150
      });
    });
    
    expect(result.current.user?.pseudo).toBe('NewName');
    expect(result.current.user?.xp).toBe(150);
    expect(result.current.user?.email).toBe('test@example.com'); // Unchanged
  });

  it('should return correct user role', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.getUserRole()).toBeNull();
    expect(result.current.isAdmin()).toBe(false);
    
    act(() => {
      result.current.setUser({
        id: 'admin-1',
        pseudo: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
        xp: 1000,
        pieces: 500,
        niveau: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });
    
    expect(result.current.getUserRole()).toBe('admin');
    expect(result.current.isAdmin()).toBe(true);
  });
});
