
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamePhases } from '@/hooks/useGamePhases';
import { useCurrentGame, useCurrentPhase, useGameProgress } from '@/store/selectors/gameSelectors';
import { useXPProgression } from '@/hooks/useXPProgression';
import { useGameStore } from '@/store/gameStore';
import { toast } from 'react-hot-toast';

/**
 * Hook pour gérer la logique spécifique à la phase de résultats
 * Gère la fin de manche et les transitions vers la suite
 */
export const useResultPhaseLogic = () => {
  const navigate = useNavigate();
  const currentGame = useCurrentGame();
  const currentPhase = useCurrentPhase();
  const { currentRound, totalRounds } = useGameProgress();
  const { awardGameCompletionXP } = useXPProgression();
  const { setCurrentRound, setCurrentPhase } = useGameStore();

  const isLastRound = currentRound >= totalRounds;

  /**
   * Affiche le classement final de la manche
   * TODO: Intégrer avec gameService.calculateFinalRanking()
   */
  const showFinalRanking = useCallback(async () => {
    if (!currentGame) return false;

    try {
      // TODO: Utiliser gameService.calculateFinalRanking(currentGame.id)
      console.log('🏆 [ResultPhase] Affichage classement final');
      
      return true;
    } catch (error) {
      console.error('Error showing final ranking:', error);
      return false;
    }
  }, [currentGame]);

  /**
   * Passe à la manche suivante ou termine la partie
   * TODO: Intégrer avec gameService.progressToNextRound()
   */
  const progressGame = useCallback(async () => {
    if (!currentGame) return false;

    try {
      if (isLastRound) {
        // Fin de partie - rediriger vers les résultats finaux
        awardGameCompletionXP();
        
        // TODO: Utiliser gameService.finalizeGame(currentGame.id)
        console.log('🎉 [ResultPhase] Fin de partie');
        
        toast.success('Partie terminée!');
        navigate(`/results/${currentGame.id}`);
      } else {
        // Manche suivante
        // TODO: Utiliser gameService.startNextRound(currentGame.id)
        console.log('➡️ [ResultPhase] Manche suivante');
        
        setCurrentRound(currentRound + 1);
        setCurrentPhase('intro');
        
        toast.success(`Manche ${currentRound + 1}/${totalRounds}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error progressing game:', error);
      toast.error('Erreur lors de la progression');
      return false;
    }
  }, [
    currentGame, 
    isLastRound, 
    awardGameCompletionXP, 
    navigate, 
    currentRound, 
    totalRounds,
    setCurrentRound,
    setCurrentPhase
  ]);

  /**
   * Retourne au dashboard (abandon de partie)
   * TODO: Intégrer avec gameService.leaveGame()
   */
  const exitGame = useCallback(() => {
    try {
      // TODO: Utiliser gameService.leaveGame(currentUser.id, currentGame.id)
      console.log('🚪 [ResultPhase] Sortie de partie');
      
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Error exiting game:', error);
      return false;
    }
  }, [navigate]);

  /**
   * Démarre une nouvelle partie avec les mêmes paramètres
   * TODO: Intégrer avec gameService.createRematch()
   */
  const requestRematch = useCallback(async () => {
    if (!currentGame) return false;

    try {
      // TODO: Utiliser gameService.createRematch(currentGame)
      console.log('🔄 [ResultPhase] Demande de revanche');
      
      toast.success('Nouvelle partie créée!');
      navigate('/lobby/new-game');
      return true;
    } catch (error) {
      console.error('Error requesting rematch:', error);
      toast.error('Erreur lors de la création');
      return false;
    }
  }, [currentGame, navigate]);

  return {
    // Actions de phase
    showFinalRanking,
    progressGame,
    exitGame,
    requestRematch,
    
    // État dérivé
    isResultPhase: currentPhase === 'result',
    isLastRound,
    currentRound,
    totalRounds,
    
    // Données de fin de partie
    gameCompleted: isLastRound,
    canProgressToNext: !isLastRound,
  };
};
