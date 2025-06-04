
import { useGameContext } from '@/context/GameContext';
import { GamePhase, MiniGameType } from '@/types/game';
import { useCallback } from 'react';

/**
 * Hook pour gérer les transitions entre phases de jeu
 * Logique centralisée pour éviter les erreurs de transition
 */
export const useGamePhases = () => {
  const { game, currentRound, setPhase, nextPhase: contextNextPhase } = useGameContext();

  const canAdvancePhase = useCallback((targetPhase: GamePhase): boolean => {
    if (!game || !currentRound) return false;

    // Logique de validation selon la phase actuelle
    switch (game.currentPhase) {
      case 'intro':
        return targetPhase === 'answering';
      
      case 'answering':
        return targetPhase === 'voting';
      
      case 'voting':
        return targetPhase === 'revealing';
      
      case 'revealing':
        return targetPhase === 'result';
      
      case 'result':
        return targetPhase === 'transition' || targetPhase === 'intro';
      
      case 'transition':
        return targetPhase === 'intro';
      
      default:
        return false;
    }
  }, [game?.currentPhase]);

  const advancePhase = useCallback(() => {
    if (!game) return false;

    const phases: GamePhase[] = ['intro', 'answering', 'voting', 'revealing', 'result'];
    const currentIndex = phases.indexOf(game.currentPhase);
    
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      if (canAdvancePhase(nextPhase)) {
        setPhase(nextPhase);
        return true;
      }
    }
    
    return false;
  }, [game?.currentPhase, canAdvancePhase, setPhase]);

  const goToPhase = useCallback((targetPhase: GamePhase) => {
    if (canAdvancePhase(targetPhase)) {
      setPhase(targetPhase);
      return true;
    }
    return false;
  }, [canAdvancePhase, setPhase]);

  const getPhaseProgress = useCallback((): number => {
    if (!game) return 0;
    
    const phases: GamePhase[] = ['intro', 'answering', 'voting', 'revealing', 'result'];
    const currentIndex = phases.indexOf(game.currentPhase);
    return ((currentIndex + 1) / phases.length) * 100;
  }, [game?.currentPhase]);

  return {
    currentPhase: game?.currentPhase || 'intro',
    canAdvancePhase,
    advancePhase,
    goToPhase,
    getPhaseProgress,
    isLastPhase: game?.currentPhase === 'result',
    isFirstPhase: game?.currentPhase === 'intro',
  };
};
