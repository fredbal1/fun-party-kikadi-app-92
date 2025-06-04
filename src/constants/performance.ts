
// Constantes pour optimiser les performances de l'application

export const PERFORMANCE_CONFIG = {
  // Lazy loading
  LAZY_LOAD_DELAY: 100,
  IMAGE_LAZY_THRESHOLD: '50px',
  
  // Memoization
  MEMO_EQUALITY_CHECK: true,
  SHALLOW_COMPARISON: true,
  
  // Animation performance
  REDUCED_MOTION_QUERY: '(prefers-reduced-motion: reduce)',
  ANIMATION_DURATION_FAST: 150,
  ANIMATION_DURATION_NORMAL: 300,
  ANIMATION_DURATION_SLOW: 500,
  
  // Virtual scrolling
  VIRTUAL_LIST_ITEM_HEIGHT: 80,
  VIRTUAL_LIST_OVERSCAN: 5,
  
  // Debounce delays
  SEARCH_DEBOUNCE: 300,
  RESIZE_DEBOUNCE: 100,
  SCROLL_DEBOUNCE: 16, // ~60fps
  
  // Cache configuration
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100,
  
  // Network optimization
  REQUEST_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Configuration des composants lourds à mémoriser
export const HEAVY_COMPONENTS = [
  'PlayerCard',
  'GameBoard',
  'ShopItemCard',
  'RevealPanel',
  'AnimatedBackground'
] as const;

// Seuils de performance
export const PERFORMANCE_THRESHOLDS = {
  // FPS monitoring
  MIN_FPS: 30,
  TARGET_FPS: 60,
  
  // Memory usage (MB)
  MAX_MEMORY_USAGE: 150,
  MEMORY_WARNING_THRESHOLD: 100,
  
  // Bundle size (KB)
  MAX_CHUNK_SIZE: 500,
  MAX_INITIAL_BUNDLE: 1024,
  
  // Network
  SLOW_NETWORK_THRESHOLD: 2000, // 2 seconds
  FAST_NETWORK_THRESHOLD: 500   // 0.5 seconds
};
