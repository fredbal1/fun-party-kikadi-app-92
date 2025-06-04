
import { useGameContext } from '@/context/GameContext';
import { PlayerState, GameState, GameSettings } from '@/types/game';
import { generateBotPlayer, generateMockGameState } from '@/utils/devMode';
import { useCallback, useState } from 'react';

/**
 * Hook pour le mode développeur
 * Permet de tester l'application avec des bots et données simulées
 */
export const useDevMode = () => {
  const { setGame, addPlayer, players } = useGameContext();
  const [isDevMode, setIsDevMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const createDevGame = useCallback(() => {
    const mockGame = generateMockGameState();
    setGame(mockGame);
    setIsDevMode(true);
    return mockGame;
  }, [setGame]);

  const addRandomBot = useCallback(() => {
    if (!isDevMode) {
      console.warn('Dev mode not enabled');
      return null;
    }

    const bot = generateBotPlayer('dev-game-id');
    addPlayer(bot);
    return bot;
  }, [isDevMode, addPlayer]);

  const addMultipleBots = useCallback((count: number) => {
    const bots: PlayerState[] = [];
    for (let i = 0; i < count; i++) {
      const bot = addRandomBot();
      if (bot) bots.push(bot);
    }
    return bots;
  }, [addRandomBot]);

  const simulateBotAnswers = useCallback(() => {
    if (!isDevMode) return;

    const botAnswers = [
      "Ma plus grande peur c'est les araignées",
      "Je rêve de voyager en Islande",
      "Mon plat préféré c'est les tacos",
      "Je ne supporte pas le bruit de la craie",
      "J'aimerais apprendre le piano",
    ];

    players.forEach((player, index) => {
      if (player.pseudo.startsWith('Bot_')) {
        const randomAnswer = botAnswers[index % botAnswers.length];
        // Simuler une réponse de bot
        setTimeout(() => {
          console.log(`${player.pseudo} répond: ${randomAnswer}`);
        }, Math.random() * 2000);
      }
    });
  }, [isDevMode, players]);

  const simulateBotVotes = useCallback(() => {
    if (!isDevMode) return;

    const botPlayers = players.filter(p => p.pseudo.startsWith('Bot_'));
    const humanPlayers = players.filter(p => !p.pseudo.startsWith('Bot_'));

    botPlayers.forEach(bot => {
      if (humanPlayers.length > 0) {
        const randomTarget = humanPlayers[Math.floor(Math.random() * humanPlayers.length)];
        setTimeout(() => {
          console.log(`${bot.pseudo} vote pour ${randomTarget.pseudo}`);
        }, Math.random() * 3000);
      }
    });
  }, [isDevMode, players]);

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay(prev => !prev);
  }, []);

  const resetDevMode = useCallback(() => {
    setIsDevMode(false);
    setAutoPlay(false);
  }, []);

  return {
    isDevMode,
    autoPlay,
    createDevGame,
    addRandomBot,
    addMultipleBots,
    simulateBotAnswers,
    simulateBotVotes,
    toggleAutoPlay,
    resetDevMode,
    botsCount: players.filter(p => p.pseudo.startsWith('Bot_')).length,
  };
};
