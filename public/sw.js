
// Service Worker pour KIKADI - Mode hors ligne
const CACHE_NAME = 'kikadi-cache-v1';
const STATIC_CACHE = 'kikadi-static-v1';
const DYNAMIC_CACHE = 'kikadi-dynamic-v1';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/auth',
  '/dashboard',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Ressources critiques du jeu
const GAME_ASSETS = [
  '/create',
  '/shop'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('🎮 KIKADI Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache des ressources de jeu
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(GAME_ASSETS);
      })
    ])
  );
  
  // Force l'activation immédiate
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('✅ KIKADI Service Worker activated');
  
  event.waitUntil(
    // Nettoyer les anciens caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prendre le contrôle immédiatement
      return self.clients.claim();
    })
  );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;

  // Ignorer les requêtes non-GET
  if (method !== 'GET') return;

  // Ignorer les requêtes Supabase (toujours en ligne)
  if (url.includes('supabase.co') || url.includes('supabase.com')) {
    return;
  }

  // Stratégie Cache First pour les assets statiques
  if (url.includes('.css') || url.includes('.js') || url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((networkResponse) => {
          return caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Stratégie Network First pour les pages de jeu
  if (url.includes('/game/') || url.includes('/lobby/') || url.includes('/results/')) {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        return caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || caches.match('/dashboard');
        });
      })
    );
    return;
  }

  // Stratégie par défaut : Network First puis Cache
  event.respondWith(
    fetch(request).then((networkResponse) => {
      return caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    }).catch(() => {
      return caches.match(request);
    })
  );
});

// Gestion des messages du main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_GAME_DATA') {
    // Cache des données de jeu importantes
    const gameData = event.data.payload;
    caches.open(DYNAMIC_CACHE).then((cache) => {
      cache.put(`/game-data/${gameData.gameId}`, new Response(JSON.stringify(gameData)));
    });
  }
});

// Notification de mise à jour disponible
self.addEventListener('controllerchange', () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'SW_UPDATED',
        message: 'Une nouvelle version de KIKADI est disponible !'
      });
    });
  });
});
