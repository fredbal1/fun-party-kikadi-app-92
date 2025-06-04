
import { MiniJeu, GamePhase } from '@/types';

export const GAME_PHASES: Record<string, GamePhase[]> = {
  kikadi: ['intro', 'answering', 'voting', 'revealing', 'results', 'transition'],
  kidivrai: ['intro', 'answering', 'voting', 'revealing', 'results', 'transition'],
  kideja: ['intro', 'answering', 'voting', 'revealing', 'results', 'transition'],
  kidenous: ['intro', 'answering', 'voting', 'revealing', 'results', 'transition'],
};

export const MINI_JEUX: Record<MiniJeu, { nom: string; description: string; emoji: string }> = {
  kikadi: {
    nom: 'KiKaDi',
    description: 'Devinez qui a écrit quoi !',
    emoji: '🧠'
  },
  kidivrai: {
    nom: 'KiDiVrai',
    description: 'Vérité ou bluff ?',
    emoji: '🤥'
  },
  kideja: {
    nom: 'KiDéjà',
    description: 'Qui a déjà fait ça ?',
    emoji: '🤔'
  },
  kidenous: {
    nom: 'KiDeNous',
    description: 'Qui de nous correspond ?',
    emoji: '🎭'
  }
};

export const AMBIANCES = {
  safe: {
    nom: 'Safe',
    description: 'Familial et bienveillant',
    emoji: '✅',
    color: 'from-green-400 to-emerald-500'
  },
  intime: {
    nom: 'Intime',
    description: 'Questions plus personnelles',
    emoji: '💗',
    color: 'from-pink-400 to-rose-500'
  },
  no_filter: {
    nom: 'No Filter',
    description: 'Sans limites, attention !',
    emoji: '🔞',
    color: 'from-red-400 to-orange-500'
  }
};

export const GAME_MODES = {
  classique: {
    nom: 'Classique',
    description: 'Le mode traditionnel pour tous',
    emoji: '👥'
  },
  bluff: {
    nom: 'Bluff',
    description: 'Ments et découvre les menteurs',
    emoji: '🃏'
  },
  mixte: {
    nom: 'Mixte',
    description: 'Un peu de tout pour plus de fun',
    emoji: '🎲'
  }
};

export const PHASE_TIMERS = {
  answering: 60,
  voting: 30,
  revealing: 10,
  results: 15,
  transition: 5
};
