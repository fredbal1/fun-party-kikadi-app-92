
import { useCallback } from 'react';
import { 
  useCurrentPlayer,
  useCurrentGame,
  useCurrentPhase,
  usePlayers 
} from '@/store/selectors/gameSelectors';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { UUID, Answer, Vote, ReactionType, Player } from '@/types/models';
import { PlayerService } from '@/services/supabase/playerService';

/**
 * Hook centralisé pour toutes les actions joueur dans KIKADI
 * Utilise les sélecteurs atomiques et prépare les intégrations Supabase
 */
export const usePlayerActions = () => {
  // Sélecteurs atomiques optimisés
  const currentPlayer = useCurrentPlayer();
  const currentGame = useCurrentGame();
  const currentPhase = useCurrentPhase();
  const players = usePlayers();
  
  // Actions du store
  const { updatePlayer } = useGameStore();
  const { addNotification, triggerEffect } = useUIStore();

  /**
   * Valide qu'un joueur peut effectuer une action
   * @param requiredPhase - Phase requise pour l'action (optionnelle)
   * @returns boolean - True si l'action est autorisée
   */
  const validatePlayerAction = useCallback((requiredPhase?: string): boolean => {
    if (!currentPlayer || !currentGame) {
      addNotification({
        type: 'error',
        message: 'Joueur ou partie non trouvée',
        duration: 3000
      });
      return false;
    }

    if (requiredPhase && currentPhase !== requiredPhase) {
      addNotification({
        type: 'warning',
        message: `Action non disponible en phase ${currentPhase}`,
        duration: 3000
      });
      return false;
    }

    return true;
  }, [currentPlayer, currentGame, currentPhase, addNotification]);

  /**
   * Soumet la réponse d'un joueur à la question courante
   * TODO: Intégrer avec PlayerService.saveAnswer()
   * 
   * @param content - Le contenu de la réponse
   * @param isBluff - Si c'est un bluff (mode bluff uniquement)
   * @returns Promise<boolean> - Succès de l'opération
   */
  const submitAnswer = useCallback(async (content: string, isBluff = false): Promise<boolean> => {
    if (!validatePlayerAction('answering')) return false;
    
    if (!content.trim()) {
      addNotification({
        type: 'warning',
        message: 'Veuillez saisir une réponse',
        duration: 3000
      });
      return false;
    }

    try {
      // TODO: Appeler PlayerService.saveAnswer(currentPlayer.id, currentGame.current_round, content, isBluff)
      console.log('📝 [PlayerActions] Soumission réponse:', { content, isBluff });
      
      // Mettre à jour l'état local
      updatePlayer(currentPlayer!.id, {
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
      console.error('❌ [PlayerActions] Erreur soumission réponse:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'envoi',
        duration: 4000
      });
      return false;
    }
  }, [validatePlayerAction, currentPlayer, updatePlayer, addNotification, triggerEffect]);

  /**
   * Enregistre un vote de joueur
   * TODO: Intégrer avec PlayerService.saveVote()
   * 
   * @param targetId - ID du joueur/réponse ciblé
   * @param voteType - Type de vote selon le mini-jeu
   * @param value - Valeur du vote
   * @returns Promise<boolean> - Succès de l'opération
   */
  const submitVote = useCallback(async (
    targetId: UUID,
    voteType: Vote['vote_type'],
    value: string
  ): Promise<boolean> => {
    if (!validatePlayerAction('voting')) return false;

    if (targetId === currentPlayer?.id) {
      addNotification({
        type: 'warning',
        message: 'Vous ne pouvez pas voter pour vous-même',
        duration: 3000
      });
      return false;
    }

    try {
      // TODO: Appeler PlayerService.saveVote(currentPlayer.id, targetId, voteType, value)
      console.log('🗳️ [PlayerActions] Soumission vote:', { targetId, voteType, value });
      
      // Mettre à jour l'état local
      updatePlayer(currentPlayer!.id, {
        current_phase_state: 'voted'
      });

      addNotification({
        type: 'success',
        message: 'Vote enregistré !',
        duration: 2000
      });

      return true;
    } catch (error) {
      console.error('❌ [PlayerActions] Erreur soumission vote:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors du vote',
        duration: 4000
      });
      return false;
    }
  }, [validatePlayerAction, currentPlayer, updatePlayer, addNotification]);

  /**
   * Envoie une réaction emoji en temps réel
   * TODO: Intégrer avec PlayerService.sendReaction()
   * 
   * @param reaction - Emoji de réaction
   * @returns Promise<boolean> - Succès de l'opération
   */
  const sendReaction = useCallback(async (reaction: ReactionType): Promise<boolean> => {
    if (!currentPlayer) return false;

    try {
      // TODO: Appeler PlayerService.sendReaction(currentPlayer.id, reaction)
      console.log('😄 [PlayerActions] Envoi réaction:', reaction);
      
      // Mettre à jour l'état local
      updatePlayer(currentPlayer.id, { reaction });

      triggerEffect('shake', 500);

      // Auto-clear après 3 secondes
      setTimeout(() => {
        updatePlayer(currentPlayer.id, { reaction: undefined });
      }, 3000);

      return true;
    } catch (error) {
      console.error('❌ [PlayerActions] Erreur envoi réaction:', error);
      return false;
    }
  }, [currentPlayer, updatePlayer, triggerEffect]);

  /**
   * Active un effet visuel acheté en boutique
   * TODO: Intégrer avec vérification d'inventaire Supabase
   * 
   * @param effectName - Nom de l'effet à activer
   * @returns Promise<boolean> - Succès de l'opération
   */
  const activateVisualEffect = useCallback(async (effectName: string): Promise<boolean> => {
    if (!currentPlayer) return false;

    try {
      // TODO: Vérifier PlayerService.checkInventoryItem(currentPlayer.user_id, effectName)
      console.log('✨ [PlayerActions] Activation effet:', effectName);
      
      updatePlayer(currentPlayer.id, {
        effet_active: effectName
      });

      triggerEffect('confetti', 2000);

      addNotification({
        type: 'info',
        message: `Effet ${effectName} activé !`,
        duration: 2000
      });

      return true;
    } catch (error) {
      console.error('❌ [PlayerActions] Erreur activation effet:', error);
      return false;
    }
  }, [currentPlayer, updatePlayer, triggerEffect, addNotification]);

  /**
   * Met à jour le statut "prêt" du joueur
   * TODO: Intégrer avec PlayerService.setReady()
   * 
   * @param isReady - Nouveau statut prêt
   * @returns Promise<boolean> - Succès de l'opération
   */
  const setPlayerReady = useCallback(async (isReady: boolean): Promise<boolean> => {
    if (!currentPlayer) return false;

    try {
      // TODO: Appeler PlayerService.setReady(currentPlayer.id, isReady)
      console.log('🎯 [PlayerActions] Changement statut prêt:', isReady);
      
      updatePlayer(currentPlayer.id, { is_ready: isReady });

      addNotification({
        type: 'info',
        message: isReady ? 'Vous êtes prêt !' : 'Statut mis à jour',
        duration: 2000
      });

      return true;
    } catch (error) {
      console.error('❌ [PlayerActions] Erreur changement statut:', error);
      return false;
    }
  }, [currentPlayer, updatePlayer, addNotification]);

  /**
   * Signale un comportement inapproprié
   * TODO: Intégrer avec système de modération Supabase
   * 
   * @param targetId - ID du joueur signalé
   * @param reason - Raison du signalement
   * @returns Promise<boolean> - Succès de l'opération
   */
  const reportPlayer = useCallback(async (targetId: UUID, reason: string): Promise<boolean> => {
    if (!currentPlayer) return false;

    try {
      // TODO: Appeler ModerationService.reportPlayer(currentPlayer.id, targetId, reason)
      console.log('🚨 [PlayerActions] Signalement joueur:', { targetId, reason });
      
      addNotification({
        type: 'success',
        message: 'Signalement envoyé',
        duration: 3000
      });

      return true;
    } catch (error) {
      console.error('❌ [PlayerActions] Erreur signalement:', error);
      return false;
    }
  }, [currentPlayer, addNotification]);

  /**
   * Envoie un ping pour vérifier la connexion
   * TODO: Intégrer avec système de heartbeat Supabase
   * 
   * @returns Promise<boolean> - Succès du ping
   */
  const sendHeartbeat = useCallback(async (): Promise<boolean> => {
    if (!currentPlayer) return false;

    try {
      // TODO: Appeler PlayerService.sendHeartbeat(currentPlayer.id)
      console.log('💓 [PlayerActions] Heartbeat envoyé');
      return true;
    } catch (error) {
      console.error('❌ [PlayerActions] Erreur heartbeat:', error);
      return false;
    }
  }, [currentPlayer]);

  // État dérivé pour les conditions d'actions
  const canSubmitAnswer = currentPhase === 'answering' && 
    currentPlayer?.current_phase_state !== 'answered';
  
  const canVote = currentPhase === 'voting' && 
    currentPlayer?.current_phase_state !== 'voted';
  
  const isReady = currentPlayer?.is_ready || false;
  const isConnected = currentPlayer?.is_connected || false;

  return {
    // Actions principales
    submitAnswer,
    submitVote,
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

/**
 * Types d'export pour faciliter les tests et la réutilisation
 */
export type PlayerActionsReturn = ReturnType<typeof usePlayerActions>;
