
// Types centralisés pour l'application KIKADI

export interface User {
  id: string;
  pseudo: string;
  email: string;
  role: 'admin' | 'joueur' | 'bot';
  xp: number;
  pieces: number;
  niveau: number;
  avatar?: string;
  titre?: string;
}

// Types pour les modes de jeu
export type GameMode = 'classique' | 'bluff' | 'mixte';

// Types pour les ambiances
export type Ambiance = 'safe' | 'intime' | 'no_filter';

// Types pour les mini-jeux
export type MiniGame = 'kikadi' | 'kidivrai' | 'kideja' | 'kidenous';
export type MiniJeu = MiniGame; // Alias pour compatibilité

export interface Game {
  id: string;
  host_id: string;
  mode: GameMode;
  ambiance: Ambiance;
  status: 'waiting' | 'running' | 'ended';
  created_at: string;
  mini_jeux: string[];
  nb_manches: number;
}

export interface Player {
  id: string;
  user_id: string;
  game_id: string;
  is_ready: boolean;
  is_host: boolean;
  score: number;
  current_phase_state: string;
  reaction?: string;
  effet_active?: string;
  user?: User;
}

export interface Round {
  id: string;
  game_id: string;
  order: number;
  mini_jeu: MiniGame;
  question_id: string;
  state: 'waiting' | 'answering' | 'voting' | 'revealing' | 'result';
  question?: Question;
}

export interface Question {
  id: string;
  content: string;
  type: 'texte' | 'choix' | 'verite';
  ambiance: Ambiance;
  jeu: MiniGame;
  validee: boolean;
}

export interface Answer {
  id: string;
  player_id: string;
  round_id: string;
  content: string;
  is_bluff?: boolean;
}

export interface Vote {
  id: string;
  voter_id: string;
  target_id: string;
  round_id: string;
  vote_type: 'association' | 'bluff' | 'categorie';
}

export interface Score {
  id: string;
  round_id: string;
  player_id: string;
  points: number;
}

export interface ShopItem {
  id: string;
  type: 'avatar' | 'titre' | 'effet';
  nom: string;
  description: string;
  prix: number;
  rarete: 'common' | 'rare' | 'legendary';
  emoji?: string;
  preview?: string;
  icon?: string;
}

export interface Inventory {
  id: string;
  user_id: string;
  item_id: string;
  owned_at: string;
}

// Types pour les phases de jeu - corrigés
export type GamePhase = 
  | 'intro'
  | 'answering'
  | 'voting'
  | 'revealing'
  | 'result'
  | 'transition';

// Types pour les effets visuels
export type VisualEffect = 'confetti' | 'shake' | 'zoom' | 'pulse' | 'none';

// Types pour les réactions
export type ReactionType = '😂' | '😮' | '🤔' | '😱' | '👏' | '🔥' | '💯' | '🎯';

// Types pour les animations - étendu
export type AnimationVariant = 'blue' | 'purple' | 'orange' | 'green' | 'red' | 'rainbow';

// Types pour l'authentification
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Types pour les statistiques
export interface PlayerStats {
  partiesJouees: number;
  partiesGagnees: number;
  pointsTotal: number;
  meilleurScore: number;
  tempsMoyenParPartie: number;
  jeuFavori: MiniGame;
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
