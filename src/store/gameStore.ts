
import { create } from 'zustand';
import { User, Game, Player } from '@/types';

interface GameStore {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateUserCoins: (newAmount: number) => void;
  updateUserXP: (newXP: number) => void;
  
  // Game state
  currentGame: Game | null;
  setCurrentGame: (game: Game | null) => void;
  
  // Players state
  players: Player[];
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  
  // Game flow state
  currentPhase: string;
  setCurrentPhase: (phase: string) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  
  // Real-time state
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  
  // Utility actions
  resetGameState: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // User state
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  updateUserCoins: (newAmount) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, pieces: newAmount } : null
  })),
  updateUserXP: (newXP) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, xp: newXP } : null
  })),
  
  // Game state
  currentGame: null,
  setCurrentGame: (game) => set({ currentGame: game }),
  
  // Players state
  players: [],
  setPlayers: (players) => set({ players }),
  addPlayer: (player) => set((state) => ({
    players: [...state.players, player]
  })),
  removePlayer: (playerId) => set((state) => ({
    players: state.players.filter(p => p.id !== playerId)
  })),
  updatePlayer: (playerId, updates) => set((state) => ({
    players: state.players.map(p => 
      p.id === playerId ? { ...p, ...updates } : p
    )
  })),
  
  // Game flow state
  currentPhase: 'intro',
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  currentRound: 1,
  setCurrentRound: (round) => set({ currentRound: round }),
  
  // Real-time state
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  
  // Utility actions
  resetGameState: () => set({
    currentGame: null,
    players: [],
    currentPhase: 'intro',
    currentRound: 1,
    isConnected: false
  })
}));
