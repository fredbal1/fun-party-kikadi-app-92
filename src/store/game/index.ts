
/**
 * Point d'entrée centralisé pour le store de jeu KIKADI
 * Combine état, actions et middlewares
 */

import { create } from 'zustand';
import { GameState, initialGameState } from './state';
import { GameActions, createGameActions } from './actions';
import { withMiddleware } from './middleware';

/**
 * Store principal pour la gestion des parties KIKADI
 * 
 * Utilise Zustand avec middleware devtools et persist
 * Sépare clairement l'état des actions pour une meilleure maintenabilité
 */
export const useGameStore = create<GameState & GameActions>()(
  withMiddleware((set, get) => ({
    ...initialGameState,
    ...createGameActions(set, get)
  }))
);

/**
 * Types utilitaires pour l'export
 */
export type { GameState, GameActions };

/**
 * Sélecteur pour récupérer tout le state (à éviter en production)
 * Utilisez plutôt les sélecteurs atomiques de gameSelectors.ts
 */
export const useFullGameState = () => useGameStore();

// Re-exports pour compatibilité (aliases corrects)
export { GameState as GameStoreState } from './state';
export { GameActions as GameStoreActions } from './actions';
