
/**
 * Types d'input pour les interactions Supabase
 * Utilisés par les services et hooks pour créer/modifier les entités
 */

import type {
  Game,
  Player,
  Question,
  Answer,
  Vote,
  Score,
  User,
  ShopItem,
  Bot,
  GameSettings,
  UUID,
  GameMode,
  AmbianceType,
  MiniGameType,
  QuestionType,
  VoteType,
  ShopItemType,
  ItemRarity,
  ReactionType
} from './models';

// ==========================================
// INPUTS POUR LES PARTIES
// ==========================================

/**
 * Input pour créer une nouvelle partie
 */
export interface NewGameInput {
  host_id: UUID;
  mode: GameMode;
  ambiance: AmbianceType;
  mini_jeux: MiniGameType[];
  nb_manches: number;
  settings?: Partial<GameSettings>;
}

/**
 * Input pour mettre à jour l'état d'une partie
 */
export interface UpdateGameStateInput {
  status?: Game['status'];
  current_round?: number;
  current_phase?: Game['current_phase'];
  current_mini_jeu?: MiniGameType;
}

/**
 * Input pour rejoindre une partie
 */
export interface JoinGameInput {
  game_code: string;
  user_id: UUID;
}

// ==========================================
// INPUTS POUR LES JOUEURS
// ==========================================

/**
 * Input pour ajouter un joueur à une partie
 */
export interface NewPlayerInput {
  user_id: UUID;
  game_id: UUID;
  is_host?: boolean;
}

/**
 * Input pour mettre à jour le statut d'un joueur
 */
export interface UpdatePlayerStatusInput {
  is_ready?: boolean;
  is_connected?: boolean;
  current_phase_state?: string;
  reaction?: ReactionType;
  effet_active?: string;
}

/**
 * Input pour mettre à jour le score d'un joueur
 */
export interface UpdatePlayerScoreInput {
  player_id: UUID;
  points_delta: number;
  reason: string;
}

// ==========================================
// INPUTS POUR LES QUESTIONS
// ==========================================

/**
 * Input pour créer une nouvelle question
 */
export interface NewQuestionInput {
  content: string;
  type: QuestionType;
  ambiance: AmbianceType;
  mini_jeu: MiniGameType;
  validee?: boolean;
}

/**
 * Input pour mettre à jour une question
 */
export interface UpdateQuestionInput {
  content?: string;
  validee?: boolean;
}

// ==========================================
// INPUTS POUR LES RÉPONSES ET VOTES
// ==========================================

/**
 * Input pour soumettre une réponse
 */
export interface SubmitAnswerInput {
  player_id: UUID;
  round_id: UUID;
  content: string;
  is_bluff?: boolean;
}

/**
 * Input pour soumettre un vote
 */
export interface SubmitVoteInput {
  voter_id: UUID;
  target_id: UUID;
  round_id: UUID;
  vote_type: VoteType;
  value: string;
}

// ==========================================
// INPUTS POUR LA BOUTIQUE
// ==========================================

/**
 * Input pour créer un objet de boutique
 */
export interface NewShopItemInput {
  type: ShopItemType;
  nom: string;
  description: string;
  prix: number;
  rarete: ItemRarity;
  emoji?: string;
  preview_url?: string;
}

/**
 * Input pour acheter un objet
 */
export interface PurchaseItemInput {
  user_id: UUID;
  item_id: UUID;
}

/**
 * Input pour équiper un objet
 */
export interface EquipItemInput {
  user_id: UUID;
  item_id: UUID;
  equip: boolean;
}

// ==========================================
// INPUTS POUR LES UTILISATEURS
// ==========================================

/**
 * Input pour mettre à jour le profil utilisateur
 */
export interface UpdateUserProfileInput {
  pseudo?: string;
  avatar?: string;
  titre?: string;
}

/**
 * Input pour mettre à jour l'XP et les pièces
 */
export interface UpdateUserProgressInput {
  xp_delta?: number;
  pieces_delta?: number;
}

// ==========================================
// INPUTS POUR LES BOTS
// ==========================================

/**
 * Input pour créer un bot
 */
export interface CreateBotInput {
  name: string;
  personality: Bot['personality'];
  difficulty: Bot['difficulty'];
  game_id: UUID;
}

/**
 * Input pour une action de bot
 */
export interface BotActionInput {
  bot_id: UUID;
  action_type: 'answer' | 'vote' | 'reaction';
  content?: string;
  target_id?: UUID;
  reaction?: ReactionType;
}

// ==========================================
// INPUTS POUR LE TEMPS RÉEL
// ==========================================

/**
 * Input pour ping de connexion
 */
export interface HeartbeatInput {
  user_id: UUID;
  game_id?: UUID;
}

/**
 * Input pour signaler un joueur
 */
export interface ReportPlayerInput {
  reporter_id: UUID;
  reported_id: UUID;
  reason: string;
  game_id?: UUID;
}

// ==========================================
// TYPES UTILITAIRES POUR LES FILTRES
// ==========================================

/**
 * Filtres pour récupérer des questions
 */
export interface QuestionFilters {
  ambiance?: AmbianceType;
  mini_jeu?: MiniGameType;
  validee?: boolean;
  type?: QuestionType;
}

/**
 * Filtres pour récupérer des parties
 */
export interface GameFilters {
  status?: Game['status'];
  mode?: GameMode;
  host_id?: UUID;
}

/**
 * Filtres pour récupérer des objets de boutique
 */
export interface ShopItemFilters {
  type?: ShopItemType;
  rarete?: ItemRarity;
  is_active?: boolean;
  max_prix?: number;
}
