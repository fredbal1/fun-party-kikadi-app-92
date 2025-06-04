
import { PlayerState, GameState, GameSettings } from '@/types/game';

const BOT_NAMES = [
  'Bot_Alex', 'Bot_Marie', 'Bot_Sam', 'Bot_Julie', 
  'Bot_Tom', 'Bot_Lisa', 'Bot_Paul', 'Bot_Emma'
];

const BOT_AVATARS = ['🤖', '👾', '🎭', '🎪', '🎨', '🎯', '🎲', '🎪'];

/**
 * Génère un joueur bot pour les tests
 */
export const generateBotPlayer = (gameId: string): PlayerState => {
  const usedNames = new Set();
  let botName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
  
  // Éviter les doublons
  let counter = 1;
  while (usedNames.has(botName)) {
    botName = `${BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]}_${counter}`;
    counter++;
  }
  
  usedNames.add(botName);

  return {
    id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: `bot-user-${Date.now()}`,
    gameId,
    pseudo: botName,
    avatar: BOT_AVATARS[Math.floor(Math.random() * BOT_AVATARS.length)],
    isHost: false,
    isReady: true, // Les bots sont toujours prêts
    isConnected: true,
    score: 0,
    hasAnswered: false,
    hasVoted: false,
  };
};

/**
 * Génère un état de jeu mock pour les tests
 */
export const generateMockGameState = (): GameState => {
  const settings: GameSettings = {
    mode: 'classique',
    ambiance: 'safe',
    miniJeux: ['kikadi', 'kidivrai', 'kidenous', 'kideja'],
    nbManches: 3,
    dureeManche: 60,
  };

  return {
    id: `dev-game-${Date.now()}`,
    hostId: 'dev-host',
    currentPhase: 'intro',
    currentRound: 1,
    currentMiniJeu: 'kikadi',
    settings,
    status: 'waiting',
    createdAt: new Date().toISOString(),
  };
};

/**
 * Génère des questions mock pour les mini-jeux
 */
export const generateMockQuestions = () => {
  return {
    kikadi: [
      "Quelle est votre plus grande peur ?",
      "Quel super-pouvoir aimeriez-vous avoir ?",
      "Quel est votre rêve le plus fou ?",
      "Quelle est votre habitude la plus bizarre ?",
    ],
    kidivrai: [
      "Il est impossible de se lécher le coude",
      "Les bananes sont radioactives",
      "Le miel ne périme jamais",
      "Les requins existaient avant les arbres",
    ],
    kidenous: [
      "Le plus susceptible de devenir célèbre",
      "Le plus probable pour survivre à un zombie apocalypse",
      "Le plus enclin à adopter 20 chats",
      "Le plus apte à devenir millionnaire",
    ],
    kideja: [
      "Dormir à la belle étoile",
      "Manger un insecte",
      "Faire du parapente",
      "Rencontrer une célébrité",
    ],
  };
};

/**
 * Simule des réponses aléatoires pour les bots
 */
export const generateBotAnswer = (question: string, miniJeu: string): string => {
  const responses = {
    kikadi: [
      "C'est un secret !",
      "Je préfère ne pas le dire...",
      "Ça dépend du contexte",
      "C'est compliqué à expliquer",
      "Hmm, bonne question !",
    ],
    kidivrai: ["Vrai", "Faux"],
    kidenous: ["Cette personne", "Quelqu'un d'autre", "Difficile à dire"],
    kideja: ["Oui, déjà fait", "Non, jamais", "Peut-être un jour"],
  };

  const options = responses[miniJeu as keyof typeof responses] || responses.kikadi;
  return options[Math.floor(Math.random() * options.length)];
};
