
import { create } from 'zustand';
import { User, Game, Player, GamePhase } from '@/types';

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
  currentPhase: GamePhase;
  setCurrentPhase: (phase: GamePhase) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  roundNumber: number;
  setRoundNumber: (round: number) => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  isHost: boolean;
  setIsHost: (isHost: boolean) => void;
  
  // Real-time state
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  
  // Shop state
  inventory: string[];
  addToInventory: (itemId: string) => void;
  
  // Utility actions
  resetGameState: () => void;
  nextPhase: () => void;
  resetGame: () => void;
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
  roundNumber: 1,
  setRoundNumber: (round) => set({ roundNumber: round }),
  timeRemaining: 0,
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  isHost: false,
  setIsHost: (isHost) => set({ isHost }),
  
  // Real-time state
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  
  // Shop state
  inventory: [],
  addToInventory: (itemId) => set((state) => ({
    inventory: [...state.inventory, itemId]
  })),
  
  // Utility actions
  resetGameState: () => set({
    currentGame: null,
    players: [],
    currentPhase: 'intro',
    currentRound: 1,
    roundNumber: 1,
    timeRemaining: 0,
    isConnected: false
  }),
  
  nextPhase: () => {
    const { currentPhase } = get();
    const phases: GamePhase[] = ['intro', 'answering', 'voting', 'revealing', 'result', 'transition'];
    const currentIndex = phases.indexOf(currentPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    set({ currentPhase: phases[nextIndex] });
  },
  
  resetGame: () => {
    set({
      currentGame: null,
      players: [],
      currentPhase: 'intro',
      currentRound: 1,
      roundNumber: 1,
      timeRemaining: 0,
      isConnected: false
    });
  }
}));
