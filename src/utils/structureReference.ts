
/**
 * Référence de la structure technique de KIKADI
 * Utilisée pour la documentation et le développement futur
 */

export const KIKADI_STRUCTURE = {
  // Pages principales
  pages: {
    home: '/',
    auth: '/auth',
    dashboard: '/dashboard',
    create: '/create',
    lobby: '/lobby/:gameId',
    game: '/game/:gameId',
    results: '/results/:gameId',
    shop: '/shop',
    admin: '/admin',
    devMode: '/admin/dev-mode'
  },

  // Mini-jeux et leurs phases
  miniJeux: {
    kikadi: {
      nom: 'KiKaDi',
      description: 'Devinez qui a dit quoi',
      emoji: '🧠',
      phases: ['intro', 'answering', 'voting', 'revealing', 'result']
    },
    kidivrai: {
      nom: 'KiDiVrai',
      description: 'Vrai ou Faux',
      emoji: '🤔',
      phases: ['intro', 'answering', 'voting', 'revealing', 'result']
    },
    kidenous: {
      nom: 'KiDeNous',
      description: 'Qui est le plus susceptible de...',
      emoji: '👥',
      phases: ['intro', 'voting', 'revealing', 'result']
    },
    kideja: {
      nom: 'KiDéjà',
      description: 'Qui a déjà fait ça ?',
      emoji: '🎯',
      phases: ['intro', 'voting', 'revealing', 'result']
    }
  },

  // Composants par catégorie
  components: {
    games: {
      'GamePhaseController': 'Routeur principal des phases',
      'kikadi/': 'Composants du mini-jeu KiKaDi',
      'kidivrai/': 'Composants du mini-jeu KiDiVrai',
      'kidenous/': 'Composants du mini-jeu KiDeNous',
      'kideja/': 'Composants du mini-jeu KiDéjà'
    },
    ui: {
      'PlayerCard': 'Affichage d\'un joueur',
      'VoteBox': 'Interface de vote',
      'PhaseTimer': 'Timer de phase',
      'PhaseHeader': 'En-tête de phase'
    },
    animations: {
      'AnimatedBackground': 'Fond animé selon l\'ambiance',
      'VisualEffects': 'Effets visuels (confetti, shake...)'
    }
  },

  // Hooks spécialisés
  hooks: {
    'useGameContext': 'State global du jeu',
    'useGamePhases': 'Gestion des transitions de phases',
    'useLobby': 'Logique du lobby',
    'usePlayers': 'Gestion des joueurs',
    'useDevMode': 'Mode développeur et bots',
    'useTimer': 'Timer générique'
  },

  // Types principaux
  types: {
    'GameState': 'État d\'une partie',
    'PlayerState': 'État d\'un joueur',
    'Round': 'Données d\'une manche',
    'GamePhase': 'Phase de jeu actuelle',
    'MiniGameType': 'Type de mini-jeu'
  },

  // Future intégration Supabase
  supabasePreparation: {
    tables: [
      'games', 'players', 'rounds', 'questions', 
      'answers', 'votes', 'scores', 'users'
    ],
    realtime: [
      'players_presence', 'game_phases', 'votes_updates'
    ],
    auth: 'email_password'
  },

  // Architecture pour tests
  testing: {
    devMode: 'Mode test avec bots',
    mockData: 'Données simulées structurées',
    unitTests: 'Tests de hooks et composants'
  }
};

/**
 * Configuration des phases pour chaque mini-jeu
 * Utilisée pour valider les transitions et l'affichage
 */
export const MINI_JEU_PHASES = {
  kikadi: ['intro', 'answering', 'voting', 'revealing', 'result'],
  kidivrai: ['intro', 'answering', 'voting', 'revealing', 'result'],
  kidenous: ['intro', 'voting', 'revealing', 'result'],
  kideja: ['intro', 'voting', 'revealing', 'result']
} as const;

/**
 * Durées par défaut pour chaque phase (en secondes)
 */
export const DEFAULT_PHASE_DURATIONS = {
  intro: 10,
  answering: 120,
  voting: 90,
  revealing: 60,
  result: 30,
  transition: 5
} as const;
