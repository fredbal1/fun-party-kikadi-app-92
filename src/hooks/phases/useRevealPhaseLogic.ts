
import { useCallback } from 'react';
import { useGamePhases } from '@/hooks/useGamePhases';
import { useCurrentGame, useCurrentPhase, usePlayers } from '@/store/selectors/gameSelectors';
import { useXPProgression } from '@/hooks/useXPProgression';
import { useVisualEffects } from '@/components/effects/VisualEffects';
import { toast } from 'react-hot-toast';

/**
 * Hook pour gérer la logique spécifique à la phase de révélation
 * Gère l'affichage des résultats et le calcul des scores
 */
export const useRevealPhaseLogic = () => {
  const currentGame = useCurrentGame();
  const currentPhase = useCurrentPhase();
  const players = usePlayers();
  const { advancePhase } = useGamePhases();
  const { awardCorrectGuessXP } = useXPProgression();
  const { triggerConfetti } = useVisualEffects();

  /**
   * Révèle progressivement les résultats avec animations
   * TODO: Intégrer avec gameService.calculateRoundResults()
   */
  const revealResults = useCallback(async () => {
    if (!currentGame) return false;

    try {
      // TODO: Utiliser gameService.calculateRoundResults(currentGame.id)
      console.log('🎭 [RevealPhase] Révélation des résultats');
      
      // Déclencher les effets visuels
      triggerConfetti();
      
      // TODO: Calculer les scores réels depuis les votes Supabase
      // TODO: Mettre à jour les scores dans la base de données
      
      toast.success('Résultats révélés!');
      return true;
    } catch (error) {
      console.error('Error revealing results:', error);
      toast.error('Erreur lors de la révélation');
      return false;
    }
  }, [currentGame, triggerConfetti]);

  /**
   * Distribue les points XP selon les performances
   * TODO: Intégrer avec gameService.distributeXPRewards()
   */
  const distributeRewards = useCallback(async () => {
    try {
      // TODO: Utiliser gameService.distributeXPRewards(players, roundResults)
      console.log('🏆 [RevealPhase] Distribution des récompenses');
      
      // Simuler l'attribution de XP pour les bonnes réponses
      awardCorrectGuessXP();
      
      return true;
    } catch (error) {
      console.error('Error distributing rewards:', error);
      return false;
    }
  }, [awardCorrectGuessXP]);

  /**
   * Envoi d'une réaction emoji en temps réel
   * TODO: Intégrer avec gameService.sendReaction()
   * @param emoji - L'emoji de réaction
   */
  const sendReaction = useCallback(async (emoji: string) => {
    try {
      // TODO: Utiliser gameService.sendReaction(currentUser.id, emoji)
      console.log('😄 [RevealPhase] Envoi réaction:', emoji);
      
      toast.success(`Réaction envoyée: ${emoji}`);
      return true;
    } catch (error) {
      console.error('Error sending reaction:', error);
      return false;
    }
  }, []);

  /**
   * Passe à la phase de résultats/score
   */
  const proceedToResults = useCallback(() => {
    if (currentPhase !== 'revealing') return false;

    try {
      const success = advancePhase();
      
      if (success) {
        // TODO: Utiliser gameService.prepareResultsPhase()
        console.log('➡️ [RevealPhase] Transition vers result');
      }
      
      return success;
    } catch (error) {
      console.error('Error proceeding to results:', error);
      return false;
    }
  }, [currentPhase, advancePhase]);

  return {
    // Actions de phase
    revealResults,
    distributeRewards,
    sendReaction,
    proceedToResults,
    
    // État dérivé
    isRevealPhase: currentPhase === 'revealing',
    
    // TODO: Remplacer par les vraies données Supabase
    mockResults: {
      correctAnswers: {},
      playerScores: players.map(p => ({ id: p.id, score: p.score })),
      roundWinner: players[0]?.id || null,
    },
  };
};
