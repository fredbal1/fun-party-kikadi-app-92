
import { User, Game, Player, GamePhase } from '@/types/models';

/**
 * Interface pour l'état du store de jeu
 * Contient uniquement les données, sans les actions
 */
export interface GameState {
  // === État utilisateur ===
  /** Utilisateur actuellement connecté */
  currentUser: User | null;
  
  // === État de la partie ===
  /** Partie en cours */
  currentGame: Game | null;
  /** Liste des joueurs dans la partie */
  players: Player[];
  
  // === État du flow de jeu ===
  /** Phase actuelle de la partie */
  currentPhase: GamePhase;
  /** Numéro de la manche courante */
  currentRound: number;
  /** Temps restant pour la phase courante (en secondes) */
  timeRemaining: number;
  /** L'utilisateur actuel est-il le host de la partie */
  isHost: boolean;
  
  // === État temps réel ===
  /** Statut de la connexion Supabase realtime */
  isConnected: boolean;
  
  // === État boutique ===
  /** Liste des IDs d'objets possédés par l'utilisateur */
  inventory: string[];
}

/**
 * État initial du store de jeu
 */
export const initialGameState: GameState = {
  // État utilisateur
  currentUser: null,
  
  // État partie
  currentGame: null,
  players: [],
  
  // État flow de jeu
  currentPhase: 'intro',
  currentRound: 1,
  timeRemaining: 0,
  isHost: false,
  
  // État temps réel
  isConnected: false,
  
  // État boutique
  inventory: [],
};
