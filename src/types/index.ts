
/**
 * Point d'entrée centralisé pour tous les types KIKADI
 * Import depuis ce fichier pour avoir accès à tous les types
 */

// === ENTITÉS MÉTIER ===
export type {
  UUID,
  Timestamp,
  User,
  Game,
  Round,
  Player,
  Question,
  Answer,
  Vote,
  Score,
  ShopItem,
  Inventory,
  GameSettings,
  Bot,
  GameStats,
  Notification,
  ConnectionStatus
} from './models';

// === VUES ENRICHIES ===
export type {
  PlayerWithUser,
  GameWithPlayers,
  RoundWithQuestion,
  VoteWithPlayer,
  AnswerWithPlayer
} from './models';

// === ÉNUMÉRATIONS ===
export type {
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
  VisualEffectType,
  NotificationType,
  AnimationVariant
} from './enums';

// === TYPES D'INPUT SUPABASE ===
export type {
  NewGameInput,
  UpdateGameStateInput,
  JoinGameInput,
  NewPlayerInput,
  UpdatePlayerStatusInput,
  UpdatePlayerScoreInput,
  NewQuestionInput,
  UpdateQuestionInput,
  SubmitAnswerInput,
  SubmitVoteInput,
  NewShopItemInput,
  PurchaseItemInput,
  EquipItemInput,
  UpdateUserProfileInput,
  UpdateUserProgressInput,
  CreateBotInput,
  BotActionInput,
  HeartbeatInput,
  ReportPlayerInput
} from './inputs';

// === TYPES DE FILTRES ===
export type {
  QuestionFilters,
  GameFilters,
  ShopItemFilters
} from './inputs';

// === TYPES UI (existants) ===
export type {
  VisualEffect
} from './ui';

// === TYPES LEGACY (à migrer progressivement) ===
export type {
  GameState as LegacyGameState,
  PlayerState as LegacyPlayerState,
  MiniGame,
  Ambiance
} from './game';

// === ALIASES POUR COMPATIBILITÉ ===
export type { MiniGameType as MiniJeu } from './enums';
export type { AmbianceType as Ambiance } from './enums';
