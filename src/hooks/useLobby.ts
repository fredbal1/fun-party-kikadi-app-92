
import { useState, useEffect, useCallback } from 'react';
import { useGameContext } from '@/context/GameContext';
import { PlayerState } from '@/types/game';
import { generateBotPlayer } from '@/utils/devMode';

/**
 * Hook pour gérer l'état du lobby
 * Gestion des joueurs en attente et préparation de la partie
 */
export const useLobby = (gameId: string) => {
  const { players, addPlayer, removePlayer, updatePlayer, isHost } = useGameContext();
  const [isLoading, setIsLoading] = useState(false);
  const [lobbyCode, setLobbyCode] = useState<string>('');

  // Génération du code lobby
  useEffect(() => {
    if (gameId) {
      // En production, ce sera l'ID réel de la partie
      setLobbyCode(gameId.slice(-6).toUpperCase());
    }
  }, [gameId]);

  const joinLobby = useCallback(async (playerData: Partial<PlayerState>) => {
    setIsLoading(true);
    try {
      // Simuler l'ajout d'un joueur
      const newPlayer: PlayerState = {
        id: `player-${Date.now()}`,
        userId: playerData.userId || `user-${Date.now()}`,
        gameId,
        pseudo: playerData.pseudo || 'Joueur',
        avatar: playerData.avatar || '🎮',
        isHost: false,
        isReady: false,
        isConnected: true,
        score: 0,
        hasAnswered: false,
        hasVoted: false,
      };
      
      addPlayer(newPlayer);
      return newPlayer;
    } catch (error) {
      console.error('Erreur lors de la connexion au lobby:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [gameId, addPlayer]);

  const leaveLobby = useCallback(async (playerId: string) => {
    try {
      removePlayer(playerId);
      return true;
    } catch (error) {
      console.error('Erreur lors de la déconnexion du lobby:', error);
      return false;
    }
  }, [removePlayer]);

  const togglePlayerReady = useCallback((playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      updatePlayer(playerId, { isReady: !player.isReady });
    }
  }, [players, updatePlayer]);

  const addBotPlayer = useCallback(() => {
    const botPlayer = generateBotPlayer(gameId);
    addPlayer(botPlayer);
  }, [gameId, addPlayer]);

  const canStartGame = useCallback((): boolean => {
    return players.length >= 3 && 
           players.length <= 8 && 
           players.every(p => p.isReady) &&
           isHost;
  }, [players, isHost]);

  const getShareUrl = useCallback((): string => {
    return `${window.location.origin}/lobby/${gameId}`;
  }, [gameId]);

  return {
    players,
    lobbyCode,
    isLoading,
    joinLobby,
    leaveLobby,
    togglePlayerReady,
    addBotPlayer,
    canStartGame,
    getShareUrl,
    playersCount: players.length,
    readyPlayersCount: players.filter(p => p.isReady).length,
  };
};
