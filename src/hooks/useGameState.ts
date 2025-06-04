
import { useGameStore } from '@/store/gameStore';
import { 
  usePlayers, 
  useCurrentGame, 
  useCurrentPhase, 
  useCurrentRound,
  useCanAdvancePhase 
} from '@/store/selectors/gameSelectors';
import { GamePhase, Player, Game } from '@/types/models';

/**
 * useGameState — Hook de compatibilité pour l'API existante
 * 
 * Utilise les nouveaux sélecteurs atomiques pour optimiser les performances
 * tout en gardant la même interface que l'ancien hook
 */
export const useGameState = () => {
  // Utilisation des sélecteurs atomiques
  const currentGame = useCurrentGame();
  const currentRound = useCurrentRound();
  const currentPhase = useCurrentPhase();
  const players = usePlayers();
  const canAdvancePhase = useCanAdvancePhase();
  
  // Actions du store
  const {
    setCurrentGame,
    setCurrentRound,
    setCurrentPhase,
    setPlayers,
    setTimeRemaining,
    setIsHost,
    nextPhase,
    resetGame,
    timeRemaining,
    isHost
  } = useGameStore();

  const getPlayerById = (playerId: string): Player | undefined => {
    return players.find(player => player.id === playerId);
  };

  const getPlayersExceptCurrent = (currentUserId: string): Player[] => {
    return players.filter(player => player.user_id !== currentUserId);
  };

  return {
    // State (via sélecteurs atomiques)
    currentGame,
    currentRound,
    currentPhase,
    players,
    timeRemaining,
    isHost,
    
    // Actions
    setCurrentGame,
    setCurrentRound,
    setCurrentPhase,
    setPlayers,
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
