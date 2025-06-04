
import { useCallback } from 'react';
import { useGamePhases } from '@/hooks/useGamePhases';
import { useCurrentGame, useCurrentPhase } from '@/store/selectors/gameSelectors';
import { toast } from 'react-hot-toast';

/**
 * Hook pour gérer la logique spécifique à la phase d'introduction
 * Orchestre les transitions et validations de la phase intro
 */
export const useIntroPhaseLogic = () => {
  const currentGame = useCurrentGame();
  const currentPhase = useCurrentPhase();
  const { advancePhase, canAdvancePhase } = useGamePhases();

  /**
   * Lance automatiquement la phase d'introduction
   * TODO: Intégrer avec gameService.startIntroPhase()
   */
  const startIntroduction = useCallback(() => {
    if (!currentGame) return false;

    try {
      // TODO: Utiliser gameService.announceGameStart(currentGame.id)
      console.log('🎮 [IntroPhase] Démarrage introduction', currentGame.current_mini_jeu);
      
      toast.success(`Début du ${currentGame.current_mini_jeu}!`);
      return true;
    } catch (error) {
      console.error('Error starting introduction:', error);
      toast.error('Erreur lors du démarrage');
      return false;
    }
  }, [currentGame]);

  /**
   * Passe à la phase de question depuis l'intro
   * TODO: Intégrer avec gameService.transitionToAnswering()
   */
  const proceedToAnswering = useCallback(() => {
    if (currentPhase !== 'intro') return false;

    try {
      const success = advancePhase();
      
      if (success) {
        // TODO: Utiliser gameService.prepareQuestionPhase()
        console.log('➡️ [IntroPhase] Transition vers answering');
        toast.success('Préparez-vous à répondre!');
      }
      
      return success;
    } catch (error) {
      console.error('Error proceeding to answering:', error);
      return false;
    }
  }, [currentPhase, advancePhase]);

  /**
   * Vérifie si la phase intro peut avancer
   */
  const canProceed = useCallback(() => {
    return canAdvancePhase('answering');
  }, [canAdvancePhase]);

  return {
    // Actions de phase
    startIntroduction,
    proceedToAnswering,
    
    // Validations
    canProceed,
    
    // État dérivé
    isIntroPhase: currentPhase === 'intro',
    miniJeu: currentGame?.current_mini_jeu,
  };
};
