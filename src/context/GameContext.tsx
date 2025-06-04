
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, PlayerState, Round, GamePhase, MiniGameType } from '@/types/game';

interface GameContextState {
  game: GameState | null;
  players: PlayerState[];
  currentRound: Round | null;
  currentPlayer: PlayerState | null;
  isHost: boolean;
  isConnected: boolean;
}

type GameAction = 
  | { type: 'SET_GAME'; payload: GameState }
  | { type: 'SET_PLAYERS'; payload: PlayerState[] }
  | { type: 'ADD_PLAYER'; payload: PlayerState }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'UPDATE_PLAYER'; payload: { playerId: string; updates: Partial<PlayerState> } }
  | { type: 'SET_CURRENT_ROUND'; payload: Round }
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'SET_CURRENT_PLAYER'; payload: PlayerState }
  | { type: 'RESET_GAME' };

const initialState: GameContextState = {
  game: null,
  players: [],
  currentRound: null,
  currentPlayer: null,
  isHost: false,
  isConnected: false,
};

function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'SET_GAME':
      return { ...state, game: action.payload };
    
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] };
    
    case 'REMOVE_PLAYER':
      return { 
        ...state, 
        players: state.players.filter(p => p.id !== action.payload) 
      };
    
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(p => 
          p.id === action.payload.playerId 
            ? { ...p, ...action.payload.updates }
            : p
        )
      };
    
    case 'SET_CURRENT_ROUND':
      return { ...state, currentRound: action.payload };
    
    case 'SET_PHASE':
      return {
        ...state,
        game: state.game ? { ...state.game, currentPhase: action.payload } : null
      };
    
    case 'SET_CURRENT_PLAYER':
      return { ...state, currentPlayer: action.payload };
    
    case 'RESET_GAME':
      return initialState;
    
    default:
      return state;
  }
}

interface GameContextValue extends GameContextState {
  dispatch: React.Dispatch<GameAction>;
  // Actions helpers
  setGame: (game: GameState) => void;
  setPlayers: (players: PlayerState[]) => void;
  addPlayer: (player: PlayerState) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<PlayerState>) => void;
  setCurrentRound: (round: Round) => void;
  setPhase: (phase: GamePhase) => void;
  nextPhase: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Action helpers
  const setGame = (game: GameState) => dispatch({ type: 'SET_GAME', payload: game });
  const setPlayers = (players: PlayerState[]) => dispatch({ type: 'SET_PLAYERS', payload: players });
  const addPlayer = (player: PlayerState) => dispatch({ type: 'ADD_PLAYER', payload: player });
  const removePlayer = (playerId: string) => dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
  const updatePlayer = (playerId: string, updates: Partial<PlayerState>) => 
    dispatch({ type: 'UPDATE_PLAYER', payload: { playerId, updates } });
  const setCurrentRound = (round: Round) => dispatch({ type: 'SET_CURRENT_ROUND', payload: round });
  const setPhase = (phase: GamePhase) => dispatch({ type: 'SET_PHASE', payload: phase });
  const resetGame = () => dispatch({ type: 'RESET_GAME' });

  const nextPhase = () => {
    if (!state.game) return;
    
    const phases: GamePhase[] = ['intro', 'answering', 'voting', 'revealing', 'result', 'transition'];
    const currentIndex = phases.indexOf(state.game.currentPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    setPhase(phases[nextIndex]);
  };

  const value: GameContextValue = {
    ...state,
    dispatch,
    setGame,
    setPlayers,
    addPlayer,
    removePlayer,
    updatePlayer,
    setCurrentRound,
    setPhase,
    nextPhase,
    resetGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
