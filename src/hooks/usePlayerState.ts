
import { 
  useCurrentUser, 
  useCurrentPlayer,
  usePlayers 
} from '@/store/selectors/gameSelectors';
import { useGameStore } from '@/store/gameStore';
import { Player } from '@/types/models';

/**
 * usePlayerState — Hook optimisé pour l'état du joueur actuel
 * 
 * Utilise les sélecteurs atomiques pour éviter les re-rendus inutiles
 */
export const usePlayerState = () => {
  // Sélecteurs atomiques optimisés
  const currentUser = useCurrentUser();
  const currentPlayer = useCurrentPlayer();
  
  // Actions pour mettre à jour le joueur
  const { updatePlayer } = useGameStore();
  
  const updatePlayerReaction = (emoji: string) => {
    if (!currentPlayer) return;
    
    // TODO: Synchroniser avec Supabase realtime
    updatePlayer(currentPlayer.id, { reaction: emoji });
    
    console.log('Player reaction:', emoji);
  };
  
  const setPlayerReady = (ready: boolean) => {
    if (!currentPlayer) return;
    
    // TODO: Synchroniser avec Supabase
    updatePlayer(currentPlayer.id, { is_ready: ready });
    
    console.log('Player ready:', ready);
  };

  return {
    // État du joueur via sélecteurs optimisés
    currentPlayer,
    currentUser,
    isReady: currentPlayer?.is_ready || false,
    score: currentPlayer?.score || 0,
    reaction: currentPlayer?.reaction,
    isHost: currentPlayer?.is_host || false,
    isConnected: currentPlayer?.is_connected || false,
    
    // Actions
    updatePlayerReaction,
    setPlayerReady,
    
    // État dérivé
    hasPlayer: !!currentPlayer,
    playerId: currentPlayer?.id,
    userId: currentUser?.id
  };
};
