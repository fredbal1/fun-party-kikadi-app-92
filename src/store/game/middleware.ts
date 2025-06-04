
import { StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GameState, GameActions } from '../gameStore';

/**
 * Configuration pour le middleware persist
 * Persiste seulement certaines parties du state
 */
export const persistConfig = {
  name: 'kikadi-game-store',
  partialize: (state: GameState & GameActions) => ({
    currentUser: state.currentUser,
    inventory: state.inventory,
    // Ne pas persister l'état de la partie en cours pour éviter les conflits
  }),
};

/**
 * Configuration pour le middleware devtools
 */
export const devtoolsConfig = {
  name: 'KIKADI Game Store',
};

/**
 * Type pour le store avec middlewares
 */
export type GameStoreCreator = StateCreator<
  GameState & GameActions,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  GameState & GameActions
>;

/**
 * Applique tous les middlewares au store
 */
export const withMiddleware = <T>(
  storeCreator: StateCreator<T, [], [], T>
) => {
  return devtools(
    persist(storeCreator, persistConfig),
    devtoolsConfig
  );
};
