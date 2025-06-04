
import { lazy } from 'react';

/**
 * Lazy loading des pages principales pour optimiser le bundle initial
 */
export const LazyPages = {
  // Pages principales
  Dashboard: lazy(() => import('@/pages/Dashboard')),
  CreateGame: lazy(() => import('@/pages/CreateGame')),
  Lobby: lazy(() => import('@/pages/Lobby')),
  Game: lazy(() => import('@/pages/Game')),
  GameRemastered: lazy(() => import('@/pages/GameRemastered')),
  Results: lazy(() => import('@/pages/Results')),
  Shop: lazy(() => import('@/pages/Shop')),
  
  // Pages d'administration
  Admin: lazy(() => import('@/pages/Admin')),
  AdminDevMode: lazy(() => import('@/pages/AdminDevMode')),
  
  // Composants lourds
  AnimatedBackground: lazy(() => import('@/components/animations/AnimatedBackground')),
  VisualEffects: lazy(() => import('@/components/effects/VisualEffects'))
};

/**
 * Composant de fallback pour le lazy loading
 */
export const LazyFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
    <div className="text-center text-white">
      <div className="text-4xl mb-4 animate-pulse">🎮</div>
      <div className="text-xl font-semibold mb-2">KIKADI</div>
      <div className="text-sm opacity-80">Chargement en cours...</div>
    </div>
  </div>
);

/**
 * Configuration du lazy loading avec préchargement
 */
export const preloadComponent = (componentName: keyof typeof LazyPages) => {
  const Component = LazyPages[componentName];
  
  // Précharger le composant au survol ou focus
  return () => {
    Component.preload?.();
  };
};

/**
 * Utilitaire pour lazy loading conditionnel
 */
export const conditionalLazy = <T extends React.ComponentType<any>>(
  condition: boolean,
  lazyComponent: () => Promise<{ default: T }>,
  fallbackComponent: T
) => {
  if (condition) {
    return lazy(lazyComponent);
  }
  return fallbackComponent;
};
