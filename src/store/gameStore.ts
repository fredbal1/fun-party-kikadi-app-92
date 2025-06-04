
import { create } from 'zustand';
import { Game, Player, Round, GamePhase, User } from '@/types';

interface GameState {
  // Current game data
  currentGame: Game | null;
  currentRound: Round | null;
  currentPhase: GamePhase;
  players: Player[];
  currentUser: User | null;
  
  // Game flow
  roundNumber: number;
  timeRemaining: number;
  isHost: boolean;
  
  // Actions
  setCurrentGame: (game: Game | null) => void;
  setCurrentRound: (round: Round | null) => void;
  setCurrentPhase: (phase: GamePhase) => void;
  setPlayers: (players: Player[]) => void;
  setCurrentUser: (user: User | null) => void;
  setRoundNumber: (round: number) => void;
  setTimeRemaining: (time: number) => void;
  setIsHost: (isHost: boolean) => void;
  
  // Game actions
  nextPhase: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  currentGame: null,
  currentRound: null,
  currentPhase: 'intro',
  players: [],
  currentUser: null,
  roundNumber: 1,
  timeRemaining: 0,
  isHost: false,
  
  // Setters
  setCurrentGame: (game) => set({ currentGame: game }),
  setCurrentRound: (round) => set({ currentRound: round }),
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  setPlayers: (players) => set({ players }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setRoundNumber: (round) => set({ roundNumber: round }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setIsHost: (isHost) => set({ isHost }),
  
  // Game flow actions
  nextPhase: () => {
    const { currentPhase } = get();
    const phases: GamePhase[] = ['intro', 'answering', 'voting', 'revealing', 'results', 'transition'];
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      set({ currentPhase: phases[currentIndex + 1] });
    }
  },
  
  resetGame: () => set({
    currentGame: null,
    currentRound: null,
    currentPhase: 'intro',
    players: [],
    roundNumber: 1,
    timeRemaining: 0,
    isHost: false
  })
}));
