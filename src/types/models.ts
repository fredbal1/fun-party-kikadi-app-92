
// Types centralisés pour les entités métier KIKADI
export type UUID = string;

export interface User {
  id: UUID;
  pseudo: string;
  email: string;
  role: 'admin' | 'joueur' | 'bot';
  xp: number;
  pieces: number;
  niveau: number;
  avatar?: string;
  titre?: string;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: UUID;
  host_id: UUID;
  mode: 'classique' | 'bluff' | 'mixte';
  ambiance: 'safe' | 'intime' | 'no_filter';
  status: 'waiting' | 'running' | 'paused' | 'ended';
  mini_jeux: string[];
  nb_manches: number;
  current_round: number;
  current_phase: GamePhase;
  current_mini_jeu: MiniGameType;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: UUID;
  user_id: UUID;
  game_id: UUID;
  pseudo: string;
  avatar?: string;
  is_ready: boolean;
  is_host: boolean;
  is_connected: boolean;
  score: number;
  current_phase_state: string;
  reaction?: string;
  effet_active?: string;
  joined_at: string;
}

export interface Round {
  id: UUID;
  game_id: UUID;
  round_number: number;
  mini_jeu: MiniGameType;
  question_id?: UUID;
  question_content?: string;
  phase: GamePhase;
  time_remaining: number;
  started_at: string;
  ended_at?: string;
}

export interface Question {
  id: UUID;
  content: string;
  type: 'texte' | 'choix' | 'verite' | 'experience';
  ambiance: 'safe' | 'intime' | 'no_filter';
  mini_jeu: MiniGameType;
  validee: boolean;
  created_at: string;
}

export interface Answer {
  id: UUID;
  player_id: UUID;
  round_id: UUID;
  content: string;
  is_bluff?: boolean;
  submitted_at: string;
}

export interface Vote {
  id: UUID;
  voter_id: UUID;
  target_id: UUID;
  round_id: UUID;
  vote_type: 'association' | 'bluff' | 'categorie' | 'choice';
  value: string;
  submitted_at: string;
}

export interface Score {
  id: UUID;
  round_id: UUID;
  player_id: UUID;
  points: number;
  reason: string;
  awarded_at: string;
}

export interface ShopItem {
  id: UUID;
  type: 'avatar' | 'titre' | 'effet';
  nom: string;
  description: string;
  prix: number;
  rarete: 'common' | 'rare' | 'legendary';
  emoji?: string;
  preview_url?: string;
  is_active: boolean;
}

export interface Inventory {
  id: UUID;
  user_id: UUID;
  item_id: UUID;
  owned_at: string;
  is_equipped: boolean;
}

// Types pour les phases de jeu
export type GamePhase = 
  | 'intro' 
  | 'answering' 
  | 'voting' 
  | 'revealing' 
  | 'result' 
  | 'transition';

// Types pour les mini-jeux
export type MiniGameType = 'kikadi' | 'kidivrai' | 'kidenous' | 'kideja';

// Types pour les réactions
export type ReactionType = '😂' | '😮' | '🤔' | '😱' | '👏' | '🔥' | '💯' | '🎯';

// Types pour les effets visuels
export type VisualEffect = 'confetti' | 'shake' | 'zoom' | 'pulse' | 'none';
