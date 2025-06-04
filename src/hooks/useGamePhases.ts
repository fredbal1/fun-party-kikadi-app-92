
import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GamePhase, MiniGameType } from '@/types/models';
import { GAME_PHASES } from '@/constants/gamePhases';

/**
 * Hook pour gérer les transitions entre phases de jeu
 * Logique centralisée pour éviter les erreurs de transition
 */
export const useGamePhases = () => {
  const {
    currentGame,
    currentPhase,
    setCurrentPhase,
    players,
    isHost
  } = useGameStore();

  const canAdvancePhase = useCallback((targetPhase: GamePhase): boolean => {
    if (!currentGame || !isHost) return false;

    const currentMiniJeu = currentGame.current_mini_jeu;
    const allowedPhases = GAME_PHASES[currentMiniJeu] || [];
    
    // Vérifier que la phase cible est valide pour ce mini-jeu
    if (!allowedPhases.includes(targetPhase)) return false;

    // Logique de validation selon la phase actuelle
    switch (currentPhase) {
      case 'intro':
        return targetPhase === 'answering';
      
      case 'answering':
        // Tous les joueurs doivent avoir répondu
        const allAnswered = players.every(p => 
          p.current_phase_state === 'answered' || p.role === 'bot'
        );
        return targetPhase === 'voting' && allAnswered;
      
      case 'voting':
        // Tous les joueurs doivent avoir voté
        const allVoted = players.every(p => 
          p.current_phase_state === 'voted' || p.role === 'bot'
        );
        return targetPhase === 'revealing' && allVoted;
      
      case 'revealing':
        return targetPhase === 'result';
      
      case 'result':
        return targetPhase === 'transition' || targetPhase === 'intro';
      
      case 'transition':
        return targetPhase === 'intro';
      
      default:
        return false;
    }
  }, [currentGame, currentPhase, players, isHost]);

  const advancePhase = useCallback(() => {
    if (!currentGame) return false;

    const currentMiniJeu = currentGame.current_mini_jeu;
    const phases = GAME_PHASES[currentMiniJeu] || [];
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      if (canAdvancePhase(nextPhase)) {
        setCurrentPhase(nextPhase);
        return true;
      }
    }
    
    return false;
  }, [currentGame, currentPhase, canAdvancePhase, setCurrentPhase]);

  const goToPhase = useCallback((targetPhase: GamePhase) => {
    if (canAdvancePhase(targetPhase)) {
      setCurrentPhase(targetPhase);
      return true;
    }
    return false;
  }, [canAdvancePhase, setCurrentPhase]);

  const getPhaseProgress = useCallback((): number => {
    if (!currentGame) return 0;
    
    const currentMiniJeu = currentGame.current_mini_jeu;
    const phases = GAME_PHASES[currentMiniJeu] || [];
    const currentIndex = phases.indexOf(currentPhase);
    return ((currentIndex + 1) / phases.length) * 100;
  }, [currentGame, currentPhase]);

  const getPhaseTimeLimit = useCallback((phase: GamePhase): number => {
    // Temps limite par phase en secondes
    const timeLimits: Record<GamePhase, number> = {
      intro: 10,
      answering: 60,
      voting: 30,
      revealing: 15,
      result: 10,
      transition: 5
    };
    
    return timeLimits[phase] || 30;
  }, []);

  return {
    currentPhase,
    canAdvancePhase,
    advancePhase,
    goToPhase,
    getPhaseProgress,
    getPhaseTimeLimit,
    isLastPhase: currentPhase === 'result',
    isFirstPhase: currentPhase === 'intro',
    isHost
  };
};
