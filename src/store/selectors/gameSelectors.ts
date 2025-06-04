
import { useGameStore } from '@/store/gameStore';
import { Player, Game, GamePhase } from '@/types/models';

/**
 * Sélecteurs atomiques pour le store de jeu
 * Permettent d'éviter les re-rendus inutiles en ne souscrivant qu'aux parties nécessaires du state
 */

/**
 * Hook pour récupérer uniquement la liste des joueurs
 * Optimisé pour les composants qui n'affichent que les joueurs
 */
export const usePlayers = () => useGameStore(state => state.players);

/**
 * Hook pour récupérer uniquement la phase actuelle
 * Optimisé pour les composants de navigation entre phases
 */
export const useCurrentPhase = () => useGameStore(state => state.currentPhase);

/**
 * Hook pour récupérer uniquement les informations de la partie courante
 * Optimisé pour l'affichage des métadonnées de jeu
 */
export const useCurrentGame = () => useGameStore(state => state.currentGame);

/**
 * Hook pour récupérer uniquement l'utilisateur actuel
 * Optimisé pour les composants d'authentification
 */
export const useCurrentUser = () => useGameStore(state => state.currentUser);

/**
 * Hook pour récupérer uniquement le numéro de manche actuel
 * Optimisé pour l'affichage de progression
 */
export const useCurrentRound = () => useGameStore(state => state.currentRound);

/**
 * Hook pour vérifier si l'utilisateur est host
 * Optimisé pour l'affichage conditionnel des contrôles host
 */
export const useIsHost = () => useGameStore(state => state.isHost);

/**
 * Hook pour récupérer le statut de connexion
 * Optimisé pour les indicateurs de connexion
 */
export const useConnectionStatus = () => useGameStore(state => state.isConnected);

/**
 * Hook pour récupérer l'inventaire du joueur
 * Optimisé pour la boutique et l'affichage des objets possédés
 */
export const useInventory = () => useGameStore(state => state.inventory);

/**
 * Hook composé pour récupérer le joueur actuel avec ses infos complètes
 * Combine currentUser et players pour éviter les calculs répétés
 */
export const useCurrentPlayer = (): Player | null => {
  return useGameStore(state => {
    if (!state.currentUser) return null;
    return state.players.find(p => p.user_id === state.currentUser!.id) || null;
  });
};

/**
 * Hook composé pour récupérer les statistiques de progression
 * Combine plusieurs états pour l'affichage du dashboard
 */
export const useGameProgress = () => {
  return useGameStore(state => ({
    currentRound: state.currentRound,
    totalRounds: state.currentGame?.nb_manches || 0,
    currentPhase: state.currentPhase,
    playersCount: state.players.length
  }));
};

/**
 * Hook composé pour vérifier si la partie peut avancer
 * Logique métier centralisée pour les contrôles de phase
 */
export const useCanAdvancePhase = (): boolean => {
  return useGameStore(state => {
    if (!state.isHost || !state.currentGame) return false;
    
    // Logique selon la phase actuelle
    switch (state.currentPhase) {
      case 'answering':
        return state.players.every(p => 
          p.current_phase_state === 'answered' || p.role === 'bot'
        );
      case 'voting':
        return state.players.every(p => 
          p.current_phase_state === 'voted' || p.role === 'bot'
        );
      default:
        return true;
    }
  });
};
