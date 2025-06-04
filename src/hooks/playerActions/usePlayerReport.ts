import { useCallback } from 'react';
import { useCurrentPlayer } from '@/store/selectors/gameSelectors';
import { useGameStore } from '@/store/gameStore';
import { useUIStore } from '@/store/uiStore';
import { UUID } from '@/types';

/**
 * Hook spécialisé pour la gestion des signalements et effets visuels dans KIKADI
 * 
 * @returns Fonctions pour signaler et activer des effets
 */
export const usePlayerReport = () => {
  const currentPlayer = useCurrentPlayer();
  const { updatePlayer } = useGameStore();
  const { addNotification, triggerEffect } = useUIStore();

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
      console.log('🚨 [PlayerReport] Signalement joueur:', { targetId, reason });
      
      addNotification({
        type: 'success',
        message: 'Signalement envoyé',
        duration: 3000
      });

      return true;
    } catch (error) {
      console.error('❌ [PlayerReport] Erreur signalement:', error);
      return false;
    }
  }, [currentPlayer, addNotification]);

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
      console.log('✨ [PlayerReport] Activation effet:', effectName);
      
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
      console.error('❌ [PlayerReport] Erreur activation effet:', error);
      return false;
    }
  }, [currentPlayer, updatePlayer, triggerEffect, addNotification]);

  return {
    reportPlayer,
    activateVisualEffect
  };
};
