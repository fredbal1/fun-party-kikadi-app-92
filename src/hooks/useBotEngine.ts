
import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Player, MiniGameType, GamePhase } from '@/types/models';

/**
 * Hook pour gérer la logique des bots
 * Automatise les actions des joueurs IA
 */
export const useBotEngine = () => {
  const {
    currentGame,
    players,
    currentPhase,
    updatePlayer
  } = useGameStore();
  
  const botsTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const getBots = useCallback((): Player[] => {
    return players.filter(p => p.pseudo.startsWith('BOT_') || p.role === 'bot');
  }, [players]);

  const generateBotAnswer = useCallback((miniJeu: MiniGameType, question?: string): string => {
    const answers = {
      kikadi: [
        "La vie est belle quand on sait l'apprécier",
        "Chaque jour est une nouvelle opportunité",
        "Le bonheur se trouve dans les petites choses",
        "Il faut savoir rire de tout, même de soi",
        "L'amitié est le plus beau des trésors"
      ],
      kidivrai: [
        "Je pense que c'est vrai",
        "Ça me semble faux",
        "Difficile à dire...",
        "Je vote pour vrai",
        "Non, c'est faux"
      ],
      kidenous: [
        "player1", "player2", "player3"
      ],
      kideja: [
        "Oui, je l'ai déjà fait",
        "Non jamais",
        "Une fois dans ma vie",
        "Plusieurs fois"
      ]
    };

    const possibleAnswers = answers[miniJeu] || answers.kikadi;
    return possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
  }, []);

  const generateBotVote = useCallback((miniJeu: MiniGameType, players: Player[]): string => {
    // Vote aléatoire parmi les joueurs humains
    const humanPlayers = players.filter(p => p.role !== 'bot');
    if (humanPlayers.length === 0) return players[0]?.id || '';
    
    const randomPlayer = humanPlayers[Math.floor(Math.random() * humanPlayers.length)];
    return randomPlayer.id;
  }, []);

  const processBotActions = useCallback(async (phase: GamePhase) => {
    const bots = getBots();
    if (bots.length === 0 || !currentGame) return;

    for (const bot of bots) {
      // Ajouter un délai aléatoire pour simuler un comportement humain
      const delay = Math.random() * 3000 + 1000; // 1-4 secondes
      
      const timer = setTimeout(async () => {
        try {
          switch (phase) {
            case 'answering':
              if (bot.current_phase_state !== 'answered') {
                const answer = generateBotAnswer(currentGame.current_mini_jeu);
                console.log(`Bot ${bot.pseudo} answers:`, answer);
                
                updatePlayer(bot.id, {
                  current_phase_state: 'answered'
                });
              }
              break;

            case 'voting':
              if (bot.current_phase_state !== 'voted') {
                const vote = generateBotVote(currentGame.current_mini_jeu, players);
                console.log(`Bot ${bot.pseudo} votes for:`, vote);
                
                updatePlayer(bot.id, {
                  current_phase_state: 'voted'
                });
              }
              break;

            default:
              // Les bots sont automatiquement prêts pour les autres phases
              if (!bot.is_ready) {
                updatePlayer(bot.id, {
                  is_ready: true
                });
              }
              break;
          }
        } catch (error) {
          console.error(`Error processing bot ${bot.pseudo} action:`, error);
        }
      }, delay);

      botsTimersRef.current.set(bot.id, timer);
    }
  }, [getBots, currentGame, generateBotAnswer, generateBotVote, players, updatePlayer]);

  const addBot = useCallback(async (gameId: string): Promise<Player | null> => {
    try {
      const existingBots = getBots();
      const botNumber = existingBots.length + 1;
      
      // TODO: Créer le bot via Supabase
      const newBot: Player = {
        id: `bot-${Date.now()}`,
        user_id: `bot-user-${botNumber}`,
        game_id: gameId,
        pseudo: `BOT_${botNumber}`,
        avatar: `🤖`,
        is_ready: true,
        is_host: false,
        is_connected: true,
        score: 0,
        current_phase_state: 'ready',
        role: 'bot',
        joined_at: new Date().toISOString()
      };

      console.log('Bot added:', newBot);
      return newBot;
    } catch (error) {
      console.error('Error adding bot:', error);
      return null;
    }
  }, [getBots]);

  const removeBot = useCallback(async (botId: string) => {
    try {
      // Nettoyer les timers
      const timer = botsTimersRef.current.get(botId);
      if (timer) {
        clearTimeout(timer);
        botsTimersRef.current.delete(botId);
      }

      // TODO: Supprimer le bot de Supabase
      console.log('Bot removed:', botId);
    } catch (error) {
      console.error('Error removing bot:', error);
    }
  }, []);

  const clearAllBotTimers = useCallback(() => {
    botsTimersRef.current.forEach(timer => clearTimeout(timer));
    botsTimersRef.current.clear();
  }, []);

  // Auto-process bot actions when phase changes
  useEffect(() => {
    if (currentPhase && currentGame) {
      const timer = setTimeout(() => {
        processBotActions(currentPhase);
      }, 500); // Petit délai pour laisser les humains agir en premier

      return () => clearTimeout(timer);
    }
  }, [currentPhase, currentGame, processBotActions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllBotTimers();
    };
  }, [clearAllBotTimers]);

  return {
    getBots,
    addBot,
    removeBot,
    processBotActions,
    clearAllBotTimers,
    
    // État dérivé
    botCount: getBots().length,
    hasActiveBots: getBots().length > 0
  };
};
