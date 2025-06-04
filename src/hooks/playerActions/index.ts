
/**
 * Point d'entrée centralisé pour les hooks d'actions joueur
 * Combine tous les hooks spécialisés en un seul hook orchestrateur
 */

import { useSubmitAnswer } from './useSubmitAnswer';
import { useCastVote } from './useCastVote';
import { usePlayerPing } from './usePlayerPing';
import { usePlayerReport } from './usePlayerReport';
import { useCurrentPlayer } from '@/store/selectors/gameSelectors';

/**
 * Hook principal orchestrant toutes les actions joueur
 * Remplace l'ancien usePlayerActions monolithique
 */
export const usePlayerActions = () => {
  const currentPlayer = useCurrentPlayer();
  
  // Hooks spécialisés
  const { submitAnswer, canSubmitAnswer } = useSubmitAnswer();
  const { castVote, canVote } = useCastVote();
  const { sendReaction, sendHeartbeat, setPlayerReady, isReady, isConnected } = usePlayerPing();
  const { reportPlayer, activateVisualEffect } = usePlayerReport();

  /**
   * Valide qu'un joueur peut effectuer une action
   * @param requiredPhase - Phase requise pour l'action (optionnelle)
   * @returns boolean - True si l'action est autorisée
   */
  const validatePlayerAction = (requiredPhase?: string): boolean => {
    return !!currentPlayer;
  };

  return {
    // Actions principales
    submitAnswer,
    submitVote: castVote, // Alias pour compatibilité
    sendReaction,
    activateVisualEffect,
    setPlayerReady,
    reportPlayer,
    sendHeartbeat,
    
    // État dérivé
    canSubmitAnswer,
    canVote,
    isReady,
    isConnected,
    currentPlayer,
    
    // Utilitaires
    validatePlayerAction
  };
};

// Exports individuels pour usage spécialisé
export { useSubmitAnswer } from './useSubmitAnswer';
export { useCastVote } from './useCastVote';
export { usePlayerPing } from './usePlayerPing';
export { usePlayerReport } from './usePlayerReport';

/**
 * Types d'export pour faciliter les tests et la réutilisation
 */
export type PlayerActionsReturn = ReturnType<typeof usePlayerActions>;
