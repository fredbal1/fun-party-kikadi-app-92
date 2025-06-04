
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

export interface Game {
  id: string;
  host_id: string;
  mode: 'classique' | 'bluff' | 'mixte';
  ambiance: 'safe' | 'intime' | 'no_filter';
  status: 'waiting' | 'running' | 'ended';
  created_at: string;
  players_count: number;
  max_players: number;
  rounds_total: number;
}

export interface Player {
  id: string;
  user_id: string;
  game_id: string;
  is_ready: boolean;
  is_host: boolean;
  score: number;
  current_phase_state: GamePhase;
  reaction?: string;
  effet_active?: string;
  user?: User;
}

export interface Round {
  id: string;
  game_id: string;
  order: number;
  mini_jeu: MiniJeu;
  question_id: string;
  state: 'waiting' | 'answering' | 'voting' | 'revealing' | 'result';
  question?: Question;
}

export interface Question {
  id: string;
  content: string;
  type: 'texte' | 'choix' | 'verite';
  ambiance: 'safe' | 'intime' | 'no_filter';
  jeu: MiniJeu;
  validee: boolean;
}

export interface Answer {
  id: string;
  player_id: string;
  round_id: string;
  content: string;
  bluff: boolean;
}

export interface Vote {
  id: string;
  voter_id: string;
  target_id: string;
  round_id: string;
  vote_type: 'association' | 'bluff' | 'categorie';
}

export interface ShopItem {
  id: string;
  type: 'avatar' | 'titre' | 'effet';
  nom: string;
  description: string;
  prix: number;
  rarete: 'common' | 'rare' | 'legendary';
  icon?: string;
}

export type MiniJeu = 'kikadi' | 'kidivrai' | 'kideja' | 'kidenous';

export type GamePhase = 
  | 'intro'
  | 'answering' 
  | 'voting'
  | 'revealing'
  | 'results'
  | 'transition';

export type Ambiance = 'safe' | 'intime' | 'no_filter';

export type GameMode = 'classique' | 'bluff' | 'mixte';
