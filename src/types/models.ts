
/**
 * Types centralisés pour les entités métier KIKADI
 * Compatible avec Supabase et organisé par domaine fonctionnel
 * 
 * Conventions :
 * - Tous les IDs sont de type UUID (string)
 * - Les champs readonly correspondent aux champs auto-générés
 * - Les commentaires RLS indiquent les contraintes Supabase anticipées
 */

import type {
  GamePhase,
  GameMode,
  AmbianceType,
  MiniGameType,
  GameStatus,
  UserRole,
  QuestionType,
  VoteType,
  ShopItemType,
  ItemRarity,
  ReactionType,
  VisualEffectType
} from './enums';

// === TYPES UTILITAIRES ===
export type UUID = string;
export type Timestamp = string; // Format ISO 8601

// ==========================================
// DOMAINE : UTILISATEURS
// ==========================================

/**
 * Entité utilisateur principale
 * RLS: users can read/update their own data only
 */
export interface User {
  readonly id: UUID;
  pseudo: string;
  email: string;
  role: UserRole;
  xp: number;
  pieces: number;
  niveau: number;
  avatar?: string;
  titre?: string;
  readonly created_at: Timestamp;
  readonly updated_at: Timestamp;
}

// ==========================================
// DOMAINE : PARTIES
// ==========================================

/**
 * Entité partie de jeu
 * RLS: host can read/update, players can read only
 */
export interface Game {
  readonly id: UUID;
  host_id: UUID;
  mode: GameMode;
  ambiance: AmbianceType;
  status: GameStatus;
  mini_jeux: MiniGameType[];
  nb_manches: number;
  current_round: number;
  current_phase: GamePhase;
  current_mini_jeu: MiniGameType;
  code_partie?: string; // Code à 6 chiffres pour rejoindre
  readonly created_at: Timestamp;
  readonly updated_at: Timestamp;
}

/**
 * Entité manche de jeu
 * RLS: players in game can read, system updates
 */
export interface Round {
  readonly id: UUID;
  game_id: UUID;
  round_number: number;
  mini_jeu: MiniGameType;
  question_id?: UUID;
  question_content?: string;
  phase: GamePhase;
  time_remaining: number;
  readonly started_at: Timestamp;
  ended_at?: Timestamp;
}

// ==========================================
// DOMAINE : JOUEURS
// ==========================================

/**
 * Entité joueur dans une partie
 * RLS: players can read all players in their game, update only themselves
 */
export interface Player {
  readonly id: UUID;
  user_id: UUID;
  game_id: UUID;
  pseudo: string;
  avatar?: string;
  is_ready: boolean;
  is_host: boolean;
  is_connected: boolean;
  score: number;
  current_phase_state: string; // État spécifique à la phase courante
  reaction?: ReactionType;
  effet_active?: string; // Nom de l'effet visuel activé
  readonly joined_at: Timestamp;
}

// ==========================================
// DOMAINE : QUESTIONS
// ==========================================

/**
 * Entité question de mini-jeu
 * RLS: public read for active questions, admin write
 */
export interface Question {
  readonly id: UUID;
  content: string;
  type: QuestionType;
  ambiance: AmbianceType;
  mini_jeu: MiniGameType;
  validee: boolean;
  readonly created_at: Timestamp;
}

// ==========================================
// DOMAINE : RÉPONSES ET VOTES
// ==========================================

/**
 * Entité réponse de joueur
 * RLS: player can create own answers, read during reveal phase only
 */
export interface Answer {
  readonly id: UUID;
  player_id: UUID;
  round_id: UUID;
  content: string;
  is_bluff?: boolean; // Pour le mode bluff uniquement
  readonly submitted_at: Timestamp;
}

/**
 * Entité vote de joueur
 * RLS: player can create own votes, read during reveal phase only
 */
export interface Vote {
  readonly id: UUID;
  voter_id: UUID;
  target_id: UUID; // ID du joueur ou de la réponse ciblée
  round_id: UUID;
  vote_type: VoteType;
  value: string; // Valeur du vote selon le type
  readonly submitted_at: Timestamp;
}

// ==========================================
// DOMAINE : SCORES
// ==========================================

/**
 * Entité score par manche
 * RLS: players can read scores in their game, system writes
 */
export interface Score {
  readonly id: UUID;
  round_id: UUID;
  player_id: UUID;
  points: number;
  reason: string; // Explication du gain de points
  readonly awarded_at: Timestamp;
}

// ==========================================
// DOMAINE : BOUTIQUE
// ==========================================

/**
 * Entité objet de boutique
 * RLS: public read for active items, admin write
 */
export interface ShopItem {
  readonly id: UUID;
  type: ShopItemType;
  nom: string;
  description: string;
  prix: number;
  rarete: ItemRarity;
  emoji?: string;
  preview_url?: string;
  is_active: boolean;
  readonly created_at: Timestamp;
}

/**
 * Entité inventaire utilisateur
 * RLS: users can read/manage their own inventory only
 */
export interface Inventory {
  readonly id: UUID;
  user_id: UUID;
  item_id: UUID;
  readonly owned_at: Timestamp;
  is_equipped: boolean;
}

// ==========================================
// DOMAINE : SYSTÈME
// ==========================================

/**
 * Entité paramètres de partie
 * Stockage des configurations avancées
 */
export interface GameSettings {
  mode: GameMode;
  ambiance: AmbianceType;
  mini_jeux: MiniGameType[];
  nb_manches: number;
  duree_manche_sec: number;
  allow_bots: boolean;
  max_players: number;
}

/**
 * Entité bot pour les tests
 * RLS: admin and dev mode only
 */
export interface Bot {
  readonly id: UUID;
  name: string;
  personality: 'random' | 'creative' | 'logical' | 'funny';
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  readonly created_at: Timestamp;
}

/**
 * Entité statistiques de partie
 * Données calculées post-partie
 */
export interface GameStats {
  readonly id: UUID;
  game_id: UUID;
  total_players: number;
  total_rounds: number;
  duration_minutes: number;
  winner_id?: UUID;
  average_response_time: number;
  most_voted_player_id?: UUID;
  readonly calculated_at: Timestamp;
}

// ==========================================
// TYPES DE RELATIONS ET VUES
// ==========================================

/**
 * Vue enrichie d'un joueur avec données utilisateur
 */
export interface PlayerWithUser extends Player {
  user: Pick<User, 'pseudo' | 'avatar' | 'niveau' | 'titre'>;
}

/**
 * Vue enrichie d'une partie avec joueurs
 */
export interface GameWithPlayers extends Game {
  players: PlayerWithUser[];
  host: Pick<User, 'pseudo' | 'avatar'>;
}

/**
 * Vue enrichie d'une manche avec question
 */
export interface RoundWithQuestion extends Round {
  question?: Question;
}

/**
 * Vue enrichie d'un vote avec informations joueur
 */
export interface VoteWithPlayer extends Vote {
  voter: Pick<Player, 'pseudo' | 'avatar'>;
  target: Pick<Player, 'pseudo' | 'avatar'>;
}

/**
 * Vue enrichie d'une réponse avec informations joueur
 */
export interface AnswerWithPlayer extends Answer {
  player: Pick<Player, 'pseudo' | 'avatar'>;
}

// ==========================================
// TYPES DE NOTIFICATION ET UI
// ==========================================

/**
 * Entité notification utilisateur
 */
export interface Notification {
  readonly id: UUID;
  user_id: UUID;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  readonly created_at: Timestamp;
}

/**
 * Entité état de connexion temps réel
 */
export interface ConnectionStatus {
  user_id: UUID;
  game_id?: UUID;
  is_online: boolean;
  last_ping: Timestamp;
}
