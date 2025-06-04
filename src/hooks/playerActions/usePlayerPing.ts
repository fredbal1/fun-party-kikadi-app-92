
import { useCallback } from 'react';
import { useCurrentPlayer } from '@/store/selectors/gameSelectors';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { ReactionType } from '@/types';

/**
 * Hook spécialisé pour la gestion des pings et réactions dans KIKADI
 * 
 * @returns Fonctions pour les réactions et heartbeats
 */
export const usePlayerPing = () => {
  const currentPlayer = useCurrentPlayer();
  const { updatePlayer } = useGameStore();
  const { triggerEffect } = useUIStore();

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
      console.log('😄 [PlayerPing] Envoi réaction:', reaction);
      
      // Mettre à jour l'état local
      updatePlayer(currentPlayer.id, { reaction });

      triggerEffect('shake', 500);

      // Auto-clear après 3 secondes
      setTimeout(() => {
        updatePlayer(currentPlayer.id, { reaction: undefined });
      }, 3000);

      return true;
    } catch (error) {
      console.error('❌ [PlayerPing] Erreur envoi réaction:', error);
      return false;
    }
  }, [currentPlayer, updatePlayer, triggerEffect]);

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
      console.log('💓 [PlayerPing] Heartbeat envoyé');
      return true;
    } catch (error) {
      console.error('❌ [PlayerPing] Erreur heartbeat:', error);
      return false;
    }
  }, [currentPlayer]);

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
      console.log('🎯 [PlayerPing] Changement statut prêt:', isReady);
      
      updatePlayer(currentPlayer.id, { is_ready: isReady });

      return true;
    } catch (error) {
      console.error('❌ [PlayerPing] Erreur changement statut:', error);
      return false;
    }
  }, [currentPlayer, updatePlayer]);

  return {
    sendReaction,
    sendHeartbeat,
    setPlayerReady,
    isReady: currentPlayer?.is_ready || false,
    isConnected: currentPlayer?.is_connected || false
  };
};
