
import { useGameStore } from '@/store/gameStore';
import { Player } from '@/types';

/**
 * usePlayerState — Gère l'état du joueur actuel dans la partie
 * - Score, réactions, statut ready
 */
export const usePlayerState = () => {
  const { currentUser, players } = useGameStore();
  
  const currentPlayer = players.find(player => player.user_id === currentUser?.id);
  
  const updatePlayerReaction = (emoji: string) => {
    // This will be connected to Supabase
    console.log('Player reaction:', emoji);
  };
  
  const setPlayerReady = (ready: boolean) => {
    // This will be connected to Supabase
    console.log('Player ready:', ready);
  };

  return {
    currentPlayer,
    isReady: currentPlayer?.is_ready || false,
    score: currentPlayer?.score || 0,
    reaction: currentPlayer?.reaction,
    isHost: currentPlayer?.is_host || false,
    
    // Actions
    updatePlayerReaction,
    setPlayerReady
  };
};
