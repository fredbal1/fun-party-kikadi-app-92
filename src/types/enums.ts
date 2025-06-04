
/**
 * Énumérations centralisées pour KIKADI
 * Contient tous les types union et constantes utilisées dans l'application
 */

// === PHASES DE JEU ===
export type GamePhase = 
  | 'intro' 
  | 'answering' 
  | 'voting' 
  | 'revealing' 
  | 'result' 
  | 'transition';

// === MODES DE JEU ===
export type GameMode = 'classique' | 'bluff' | 'mixte';

// === AMBIANCES ===
export type AmbianceType = 'safe' | 'intime' | 'no_filter';

// === MINI-JEUX ===
export type MiniGameType = 'kikadi' | 'kidivrai' | 'kidenous' | 'kideja';

// === STATUTS DE PARTIE ===
export type GameStatus = 'waiting' | 'running' | 'paused' | 'ended';

// === RÔLES UTILISATEUR ===
export type UserRole = 'admin' | 'joueur' | 'bot';

// === TYPES DE QUESTIONS ===
export type QuestionType = 'texte' | 'choix' | 'verite' | 'experience';

// === TYPES DE VOTES ===
export type VoteType = 'association' | 'bluff' | 'categorie' | 'choice';

// === TYPES D'OBJETS BOUTIQUE ===
export type ShopItemType = 'avatar' | 'titre' | 'effet';

// === RARETÉS D'OBJETS ===
export type ItemRarity = 'common' | 'rare' | 'legendary';

// === RÉACTIONS EMOJI ===
export type ReactionType = '😂' | '😮' | '🤔' | '😱' | '👏' | '🔥' | '💯' | '🎯';

// === EFFETS VISUELS ===
export type VisualEffectType = 'confetti' | 'shake' | 'zoom' | 'pulse' | 'none';

// === TYPES DE NOTIFICATIONS ===
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// === VARIANTES D'ANIMATIONS ===
export type AnimationVariant = 'blue' | 'purple' | 'orange' | 'green' | 'red' | 'rainbow';
