
import { useCallback } from 'react';
import { useCurrentPlayer, useCurrentPhase } from '@/store/selectors/gameSelectors';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { UUID, Vote } from '@/types';

/**
 * Hook spécialisé pour la gestion des votes dans KIKADI
 * 
 * @returns Fonction pour voter et état dérivé
 */
export const useCastVote = () => {
  const currentPlayer = useCurrentPlayer();
  const currentPhase = useCurrentPhase();
  const { updatePlayer } = useGameStore();
  const { addNotification } = useUIStore();

  /**
   * Enregistre un vote de joueur
   * TODO: Intégrer avec VoteService.submitVote()
   * 
   * @param targetId - ID du joueur/réponse ciblé
   * @param voteType - Type de vote selon le mini-jeu
   * @param value - Valeur du vote
   * @returns Promise<boolean> - Succès de l'opération
   */
  const castVote = useCallback(async (
    targetId: UUID,
    voteType: Vote['vote_type'],
    value: string
  ): Promise<boolean> => {
    if (!currentPlayer) {
      addNotification({
        type: 'error',
        message: 'Joueur non trouvé',
        duration: 3000
      });
      return false;
    }

    if (currentPhase !== 'voting') {
      addNotification({
        type: 'warning',
        message: `Action non disponible en phase ${currentPhase}`,
        duration: 3000
      });
      return false;
    }

    if (targetId === currentPlayer.id) {
      addNotification({
        type: 'warning',
        message: 'Vous ne pouvez pas voter pour vous-même',
        duration: 3000
      });
      return false;
    }

    try {
      // TODO: Appeler VoteService.submitVote(currentPlayer.id, targetId, voteType, value)
      console.log('🗳️ [CastVote] Soumission vote:', { targetId, voteType, value });
      
      // Mettre à jour l'état local
      updatePlayer(currentPlayer.id, {
        current_phase_state: 'voted'
      });

      addNotification({
        type: 'success',
        message: 'Vote enregistré !',
        duration: 2000
      });

      return true;
    } catch (error) {
      console.error('❌ [CastVote] Erreur soumission vote:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors du vote',
        duration: 4000
      });
      return false;
    }
  }, [currentPlayer, currentPhase, updatePlayer, addNotification]);

  // État dérivé
  const canVote = currentPhase === 'voting' && 
    currentPlayer?.current_phase_state !== 'voted';

  return {
    castVote,
    canVote
  };
};
