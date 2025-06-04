
/**
 * Point d'entrée legacy pour le store de jeu
 * Redirige vers la nouvelle structure modulaire
 * 
 * @deprecated Utilisez directement ./game/index.ts
 */

export { 
  useGameStore, 
  useFullGameState, 
  type GameState, 
  type GameActions 
} from './game';

// Re-exports pour compatibilité totale
export type { 
  GameState as GameStoreState,
  GameActions as GameStoreActions 
} from './game';
