
import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { UUID, Answer, Vote, ReactionType } from '@/types/models';

/**
 * Hook pour gérer les interactions joueur
 * Actions centralisées pour répondre, voter, réagir
 */
export const usePlayerActions = () => {
  const {
    currentGame,
    currentUser,
    updatePlayer,
    players
  } = useGameStore();
  
  const { 
    addNotification, 
    triggerEffect 
  } = useUIStore();

  const getCurrentPlayer = useCallback(() => {
    if (!currentUser || !currentGame) return null;
    return players.find(p => p.user_id === currentUser.id);
  }, [currentUser, currentGame, players]);

  const submitAnswer = useCallback(async (content: string, isBluff = false) => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer || !currentGame) {
      throw new Error('Joueur ou partie non trouvée');
    }

    try {
      // TODO: Envoyer à Supabase
      const answer: Omit<Answer, 'id'> = {
        player_id: currentPlayer.id,
        round_id: currentGame.current_round.toString(),
        content,
        is_bluff: isBluff,
        submitted_at: new Date().toISOString()
      };

      console.log('Answer submitted:', answer);

      // Mettre à jour l'état local
      updatePlayer(currentPlayer.id, {
        current_phase_state: 'answered'
      });

      addNotification({
        type: 'success',
        message: 'Réponse envoyée avec succès !',
        duration: 3000
      });

      triggerEffect('pulse', 1000);
      
      return true;
    } catch (error) {
      console.error('Error submitting answer:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'envoi de la réponse',
        duration: 5000
      });
      throw error;
    }
  }, [getCurrentPlayer, currentGame, updatePlayer, addNotification, triggerEffect]);

  const submitVote = useCallback(async (
    targetId: UUID, 
    voteType: Vote['vote_type'], 
    value: string
  ) => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer || !currentGame) {
      throw new Error('Joueur ou partie non trouvée');
    }

    try {
      // TODO: Envoyer à Supabase
      const vote: Omit<Vote, 'id'> = {
        voter_id: currentPlayer.id,
        target_id: targetId,
        round_id: currentGame.current_round.toString(),
        vote_type: voteType,
        value,
        submitted_at: new Date().toISOString()
      };

      console.log('Vote submitted:', vote);

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
      console.error('Error submitting vote:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors du vote',
        duration: 5000
      });
      throw error;
    }
  }, [getCurrentPlayer, currentGame, updatePlayer, addNotification]);

  const sendReaction = useCallback(async (reaction: ReactionType) => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    try {
      // Mettre à jour l'état local
      updatePlayer(currentPlayer.id, {
        reaction
      });

      triggerEffect('shake', 500);

      // Auto-clear reaction après 3 secondes
      setTimeout(() => {
        updatePlayer(currentPlayer.id, {
          reaction: undefined
        });
      }, 3000);

      return true;
    } catch (error) {
      console.error('Error sending reaction:', error);
      throw error;
    }
  }, [getCurrentPlayer, updatePlayer, triggerEffect]);

  const useVisualEffect = useCallback(async (effect: string) => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    try {
      // Vérifier si le joueur possède cet effet
      // TODO: Vérifier dans l'inventaire Supabase
      
      updatePlayer(currentPlayer.id, {
        effet_active: effect
      });

      triggerEffect('confetti', 2000);

      addNotification({
        type: 'info',
        message: `Effet ${effect} activé !`,
        duration: 2000
      });

      return true;
    } catch (error) {
      console.error('Error using visual effect:', error);
      throw error;
    }
  }, [getCurrentPlayer, updatePlayer, triggerEffect, addNotification]);

  const setReady = useCallback(async (isReady: boolean) => {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    try {
      updatePlayer(currentPlayer.id, {
        is_ready: isReady
      });

      addNotification({
        type: 'info',
        message: isReady ? 'Vous êtes prêt !' : 'Statut mis à jour',
        duration: 2000
      });

      return true;
    } catch (error) {
      console.error('Error setting ready status:', error);
      throw error;
    }
  }, [getCurrentPlayer, updatePlayer, addNotification]);

  return {
    getCurrentPlayer,
    submitAnswer,
    submitVote,
    sendReaction,
    useVisualEffect,
    setReady,
    
    // État dérivé
    canSubmitAnswer: getCurrentPlayer()?.current_phase_state !== 'answered',
    canVote: getCurrentPlayer()?.current_phase_state !== 'voted',
    isReady: getCurrentPlayer()?.is_ready || false
  };
};
