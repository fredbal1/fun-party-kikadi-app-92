
import { useCallback } from 'react';
import { useCurrentPlayer, useCurrentPhase } from '@/store/selectors/gameSelectors';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';

/**
 * Hook spécialisé pour la soumission de réponses dans KIKADI
 * 
 * @returns Fonction pour soumettre une réponse et état dérivé
 */
export const useSubmitAnswer = () => {
  const currentPlayer = useCurrentPlayer();
  const currentPhase = useCurrentPhase();
  const { updatePlayer } = useGameStore();
  const { addNotification, triggerEffect } = useUIStore();

  /**
   * Soumet la réponse d'un joueur à la question courante
   * TODO: Intégrer avec AnswerService.submitAnswer()
   * 
   * @param content - Le contenu de la réponse
   * @param isBluff - Si c'est un bluff (mode bluff uniquement)
   * @returns Promise<boolean> - Succès de l'opération
   */
  const submitAnswer = useCallback(async (content: string, isBluff = false): Promise<boolean> => {
    if (!currentPlayer) {
      addNotification({
        type: 'error',
        message: 'Joueur non trouvé',
        duration: 3000
      });
      return false;
    }

    if (currentPhase !== 'answering') {
      addNotification({
        type: 'warning',
        message: `Action non disponible en phase ${currentPhase}`,
        duration: 3000
      });
      return false;
    }
    
    if (!content.trim()) {
      addNotification({
        type: 'warning',
        message: 'Veuillez saisir une réponse',
        duration: 3000
      });
      return false;
    }

    try {
      // TODO: Appeler AnswerService.submitAnswer(currentPlayer.id, currentGame.current_round, content, isBluff)
      console.log('📝 [SubmitAnswer] Soumission réponse:', { content, isBluff });
      
      // Mettre à jour l'état local
      updatePlayer(currentPlayer.id, {
        current_phase_state: 'answered'
      });

      addNotification({
        type: 'success',
        message: 'Réponse envoyée !',
        duration: 2000
      });

      triggerEffect('pulse', 800);
      return true;
    } catch (error) {
      console.error('❌ [SubmitAnswer] Erreur soumission réponse:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'envoi',
        duration: 4000
      });
      return false;
    }
  }, [currentPlayer, currentPhase, updatePlayer, addNotification, triggerEffect]);

  // État dérivé
  const canSubmitAnswer = currentPhase === 'answering' && 
    currentPlayer?.current_phase_state !== 'answered';

  return {
    submitAnswer,
    canSubmitAnswer
  };
};
