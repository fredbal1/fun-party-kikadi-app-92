
import { lazy } from 'react';

/**
 * Lazy loading des pages principales pour optimiser le bundle initial
 */
export const LazyHome = lazy(() => import('../pages/Index'));
export const LazyAuth = lazy(() => import('../pages/Auth'));
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyCreateGame = lazy(() => import('../pages/CreateGame'));
export const LazyLobby = lazy(() => import('../pages/Lobby'));
export const LazyGame = lazy(() => import('../pages/Game'));
export const LazyGameRemastered = lazy(() => import('../pages/GameRemastered'));
export const LazyResults = lazy(() => import('../pages/Results'));
export const LazyShop = lazy(() => import('../pages/Shop'));
export const LazyAdmin = lazy(() => import('../pages/Admin'));
export const LazyAdminDevMode = lazy(() => import('../pages/AdminDevMode'));

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
