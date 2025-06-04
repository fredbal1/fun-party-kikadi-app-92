
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ServiceWorkerState {
  isSupported: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false,
    isOnline: navigator.onLine,
    updateAvailable: false
  });

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Installation du service worker
  useEffect(() => {
    if (!state.isSupported) {
      console.warn('Service Worker not supported');
      return;
    }

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);
        
        setState(prev => ({ ...prev, isInstalled: true }));
        console.log('✅ Service Worker registered successfully');

        // Vérifier les mises à jour
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, updateAvailable: true }));
                toast('🎮 Nouvelle version disponible !', {
                  duration: 5000,
                  className: 'bg-blue-500 text-white'
                });
              }
            });
          }
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerSW();
  }, [state.isSupported]);

  // Écouter les changements de statut en ligne
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      toast.success('🌐 Connexion rétablie !');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      toast('📴 Mode hors ligne activé', {
        duration: 3000,
        className: 'bg-orange-500 text-white'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Messages du service worker
  useEffect(() => {
    if (!state.isSupported) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SW_UPDATED') {
        setState(prev => ({ ...prev, updateAvailable: true }));
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, [state.isSupported]);

  // Activer la mise à jour
  const activateUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  // Cache des données de jeu
  const cacheGameData = (gameId: string, data: any) => {
    if (registration?.active) {
      registration.active.postMessage({
        type: 'CACHE_GAME_DATA',
        payload: { gameId, ...data }
      });
    }
  };

  return {
    ...state,
    activateUpdate,
    cacheGameData,
    registration
  };
};
