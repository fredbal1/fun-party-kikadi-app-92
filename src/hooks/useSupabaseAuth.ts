
import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { User } from '@/types';

/**
 * useSupabaseAuth — Gère l'authentification avec Supabase
 * Sera activé quand l'intégration Supabase sera configurée
 */

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSupabaseReady: boolean;
}

export const useSupabaseAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isSupabaseReady: false
  });

  const { setCurrentUser } = useGameStore();

  // Vérifier si Supabase est configuré
  useEffect(() => {
    // TODO: Remplacer par la vraie vérification
    const isReady = false; // import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    setState(prev => ({ ...prev, isSupabaseReady: isReady, isLoading: false }));
    
    if (!isReady) {
      console.log('🔐 Supabase Auth not configured yet');
      // Utiliser un utilisateur mock en attendant
      const mockUser: User = {
        id: 'mock-user-1',
        pseudo: 'Testeur',
        email: 'test@kikadi.com',
        role: 'joueur',
        xp: 1250,
        pieces: 85,
        niveau: 3,
        avatar: '🎮',
        titre: 'Nouveau joueur'
      };
      
      setState(prev => ({ 
        ...prev, 
        user: mockUser, 
        isAuthenticated: true 
      }));
      setCurrentUser(mockUser);
    }
  }, [setCurrentUser]);

  // Écouter les changements d'authentification Supabase
  useEffect(() => {
    if (!state.isSupabaseReady) return;

    // TODO: Implémenter l'écoute des changements Supabase
    /*
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          setState(prev => ({
            ...prev,
            user: userProfile,
            isAuthenticated: true,
            isLoading: false
          }));
          setCurrentUser(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            isLoading: false
          }));
          setCurrentUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
    */
  }, [state.isSupabaseReady, setCurrentUser]);

  // Actions d'authentification (préparées pour Supabase)
  const signIn = async (email: string, password: string) => {
    if (!state.isSupabaseReady) {
      console.log('🔐 Mock sign in:', email);
      return { success: true, user: state.user };
    }

    // TODO: Implémenter la vraie connexion Supabase
    /*
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
    */
  };

  const signUp = async (email: string, password: string, pseudo: string) => {
    if (!state.isSupabaseReady) {
      console.log('📝 Mock sign up:', email, pseudo);
      return { success: true };
    }

    // TODO: Implémenter la vraie inscription Supabase
  };

  const signOut = async () => {
    if (!state.isSupabaseReady) {
      console.log('👋 Mock sign out');
      setState(prev => ({ ...prev, user: null, isAuthenticated: false }));
      setCurrentUser(null);
      return;
    }

    // TODO: Implémenter la vraie déconnexion Supabase
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.isSupabaseReady || !state.user) return;

    // TODO: Implémenter la mise à jour du profil Supabase
    console.log('👤 Profile update will be sent to Supabase:', updates);
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    
    // Utilitaires
    isReady: state.isSupabaseReady,
    needsSupabaseSetup: !state.isSupabaseReady
  };
};
