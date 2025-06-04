
// Types spécifiques au jeu et aux phases
export type GamePhase = 'intro' | 'answering' | 'voting' | 'revealing' | 'result' | 'transition';

export type MiniGameType = 'kikadi' | 'kidivrai' | 'kidenous' | 'kideja';

export interface GameSettings {
  mode: 'classique' | 'bluff' | 'mixte';
  ambiance: 'safe' | 'intime' | 'no_filter';
  miniJeux: MiniGameType[];
  nbManches: number;
  dureeManche: number;
}

export interface GameState {
  id: string;
  hostId: string;
  currentPhase: GamePhase;
  currentRound: number;
  currentMiniJeu: MiniGameType;
  settings: GameSettings;
  status: 'waiting' | 'playing' | 'paused' | 'ended';
  createdAt: string;
}

export interface PlayerState {
  id: string;
  userId: string;
  gameId: string;
  pseudo: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  score: number;
  currentAnswer?: string;
  currentVote?: string;
  reaction?: string;
  hasAnswered: boolean;
  hasVoted: boolean;
}

export interface Round {
  id: string;
  gameId: string;
  roundNumber: number;
  miniJeu: MiniGameType;
  questionId?: string;
  question?: string;
  phase: GamePhase;
  timeRemaining: number;
  startedAt: string;
}

export interface Answer {
  id: string;
  playerId: string;
  roundId: string;
  content: string;
  isBluff?: boolean;
  submittedAt: string;
}

export interface Vote {
  id: string;
  voterId: string;
  targetId: string;
  roundId: string;
  voteType: 'player' | 'answer' | 'choice';
  value: string;
  submittedAt: string;
}
