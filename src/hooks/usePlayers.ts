
import { useGameContext } from '@/context/GameContext';
import { PlayerState } from '@/types/game';
import { useCallback } from 'react';

/**
 * Hook pour gérer les interactions avec les joueurs
 * Avatars, scores, réactions, statuts
 */
export const usePlayers = () => {
  const { players, currentPlayer, updatePlayer } = useGameContext();

  const getPlayerById = useCallback((playerId: string): PlayerState | undefined => {
    return players.find(p => p.id === playerId);
  }, [players]);

  const getPlayersByScore = useCallback((): PlayerState[] => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  const updatePlayerScore = useCallback((playerId: string, points: number) => {
    const player = getPlayerById(playerId);
    if (player) {
      updatePlayer(playerId, { score: player.score + points });
    }
  }, [getPlayerById, updatePlayer]);

  const setPlayerReaction = useCallback((playerId: string, reaction: string) => {
    updatePlayer(playerId, { reaction });
    
    // Auto-clear reaction après 3 secondes
    setTimeout(() => {
      updatePlayer(playerId, { reaction: '' });
    }, 3000);
  }, [updatePlayer]);

  const setPlayerAnswer = useCallback((playerId: string, answer: string) => {
    updatePlayer(playerId, { 
      currentAnswer: answer, 
      hasAnswered: true 
    });
  }, [updatePlayer]);

  const setPlayerVote = useCallback((playerId: string, vote: string) => {
    updatePlayer(playerId, { 
      currentVote: vote, 
      hasVoted: true 
    });
  }, [updatePlayer]);

  const resetPlayerAnswers = useCallback(() => {
    players.forEach(player => {
      updatePlayer(player.id, { 
        currentAnswer: undefined, 
        currentVote: undefined,
        hasAnswered: false,
        hasVoted: false,
        reaction: ''
      });
    });
  }, [players, updatePlayer]);

  const getConnectedPlayers = useCallback((): PlayerState[] => {
    return players.filter(p => p.isConnected);
  }, [players]);

  const getReadyPlayers = useCallback((): PlayerState[] => {
    return players.filter(p => p.isReady);
  }, [players]);

  return {
    players,
    currentPlayer,
    getPlayerById,
    getPlayersByScore,
    updatePlayerScore,
    setPlayerReaction,
    setPlayerAnswer,
    setPlayerVote,
    resetPlayerAnswers,
    getConnectedPlayers,
    getReadyPlayers,
    playersCount: players.length,
    connectedCount: getConnectedPlayers().length,
    readyCount: getReadyPlayers().length,
  };
};
