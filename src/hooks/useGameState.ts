
import { useGameStore } from '@/store/gameStore';
import { GamePhase, Player, Game, Round } from '@/types';

/**
 * useGameState — Gère la logique globale d'une partie en cours.
 * - Phase en cours
 * - Joueurs présents  
 * - Settings (mode, ambiance, manches)
 */
export const useGameState = () => {
  const {
    currentGame,
    currentRound,
    currentPhase,
    players,
    roundNumber,
    timeRemaining,
    isHost,
    setCurrentGame,
    setCurrentRound,
    setCurrentPhase,
    setPlayers,
    setRoundNumber,
    setTimeRemaining,
    setIsHost,
    nextPhase,
    resetGame
  } = useGameStore();

  const getPlayerById = (playerId: string): Player | undefined => {
    return players.find(player => player.id === playerId);
  };

  const getPlayersExceptCurrent = (currentUserId: string): Player[] => {
    return players.filter(player => player.user_id !== currentUserId);
  };

  const canAdvancePhase = (): boolean => {
    if (!isHost) return false;
    
    // Logic to check if all players are ready for next phase
    switch (currentPhase) {
      case 'answering':
        return players.every(player => player.current_phase_state === 'answering');
      case 'voting':
        return players.every(player => player.current_phase_state === 'voting');
      default:
        return true;
    }
  };

  return {
    // State
    currentGame,
    currentRound,
    currentPhase,
    players,
    roundNumber,
    timeRemaining,
    isHost,
    
    // Actions
    setCurrentGame,
    setCurrentRound,
    setCurrentPhase,
    setPlayers,
    setRoundNumber,
    setTimeRemaining,
    setIsHost,
    nextPhase,
    resetGame,
    
    // Derived state
    getPlayerById,
    getPlayersExceptCurrent,
    canAdvancePhase,
    playersCount: players.length,
    isGameReady: currentGame && players.length >= 3
  };
};
