
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '@/types/models';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  
  // Getters
  getUserRole: () => 'admin' | 'joueur' | 'bot' | null;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // TODO: Intégrer avec Supabase Auth
          console.log('Login attempt:', { email });
          // Mock login pour le moment
          const mockUser: User = {
            id: 'user-1',
            pseudo: 'TestUser',
            email,
            role: 'joueur',
            xp: 100,
            pieces: 50,
            niveau: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          set({ 
            user: mockUser, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },
      
      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              ...updates,
              updated_at: new Date().toISOString()
            }
          });
        }
      },
      
      // Getters
      getUserRole: () => {
        const { user } = get();
        return user?.role || null;
      },
      
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      }
    }),
    { name: 'auth-store' }
  )
);
