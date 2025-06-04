
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface XPProgressionData {
  currentXP: number;
  currentLevel: number;
  xpForNextLevel: number;
  totalXPForCurrentLevel: number;
  progressPercentage: number;
}

interface XPGain {
  amount: number;
  reason: string;
  bonus?: boolean;
}

// Formule de calcul XP requis par niveau (progression exponentielle)
const getXPRequiredForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Points XP par action
export const XP_REWARDS = {
  ANSWER_SUBMITTED: 10,
  CORRECT_GUESS: 25,
  PERFECT_ROUND: 50,
  GAME_COMPLETED: 30,
  FIRST_PLACE: 100,
  SECOND_PLACE: 60,
  THIRD_PLACE: 30,
  BLUFF_SUCCESS: 40,
  CREATIVE_ANSWER: 20,
  PARTICIPATION: 5
} as const;

export const useXPProgression = (initialXP: number = 0, initialLevel: number = 1) => {
  const [currentXP, setCurrentXP] = useState(initialXP);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [recentGains, setRecentGains] = useState<XPGain[]>([]);

  // Calculer les données de progression
  const getProgressionData = useCallback((): XPProgressionData => {
    const totalXPForCurrentLevel = currentLevel === 1 ? 0 : 
      Array.from({ length: currentLevel - 1 }, (_, i) => getXPRequiredForLevel(i + 1))
        .reduce((sum, xp) => sum + xp, 0);
    
    const xpForNextLevel = getXPRequiredForLevel(currentLevel);
    const xpInCurrentLevel = currentXP - totalXPForCurrentLevel;
    const progressPercentage = Math.min((xpInCurrentLevel / xpForNextLevel) * 100, 100);

    return {
      currentXP,
      currentLevel,
      xpForNextLevel,
      totalXPForCurrentLevel,
      progressPercentage
    };
  }, [currentXP, currentLevel]);

  // Ajouter de l'XP
  const addXP = useCallback((amount: number, reason: string, bonus: boolean = false) => {
    const gain: XPGain = { amount, reason, bonus };
    setRecentGains(prev => [...prev.slice(-4), gain]); // Garder les 5 derniers gains

    setCurrentXP(prevXP => {
      const newXP = prevXP + amount;
      
      // Vérifier si level up
      const progression = getProgressionData();
      let newLevel = currentLevel;
      let tempXP = newXP;
      
      // Calculer le nouveau niveau
      while (tempXP >= progression.totalXPForCurrentLevel + getXPRequiredForLevel(newLevel)) {
        tempXP -= getXPRequiredForLevel(newLevel);
        newLevel++;
      }
      
      if (newLevel > currentLevel) {
        setCurrentLevel(newLevel);
        toast.success(`🎉 Niveau ${newLevel} atteint ! Félicitations !`, {
          duration: 4000,
          className: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold'
        });
      } else {
        // Toast normal pour gain XP
        const emoji = bonus ? '⭐' : '✨';
        toast.success(`${emoji} +${amount} XP - ${reason}`, {
          duration: 2000
        });
      }
      
      return newXP;
    });
  }, [currentLevel, getProgressionData]);

  // Raccourcis pour les actions communes
  const awardAnswerXP = () => addXP(XP_REWARDS.ANSWER_SUBMITTED, 'Réponse soumise');
  const awardCorrectGuessXP = () => addXP(XP_REWARDS.CORRECT_GUESS, 'Bonne association', true);
  const awardPerfectRoundXP = () => addXP(XP_REWARDS.PERFECT_ROUND, 'Manche parfaite', true);
  const awardGameCompletionXP = () => addXP(XP_REWARDS.GAME_COMPLETED, 'Partie terminée');
  const awardRankingXP = (position: 1 | 2 | 3) => {
    const rewards = {
      1: XP_REWARDS.FIRST_PLACE,
      2: XP_REWARDS.SECOND_PLACE,
      3: XP_REWARDS.THIRD_PLACE
    };
    const labels = {
      1: '🥇 1ère place',
      2: '🥈 2ème place', 
      3: '🥉 3ème place'
    };
    addXP(rewards[position], labels[position], true);
  };

  // Nettoyer les gains récents
  const clearRecentGains = () => setRecentGains([]);

  return {
    // État actuel
    ...getProgressionData(),
    recentGains,
    
    // Actions
    addXP,
    awardAnswerXP,
    awardCorrectGuessXP,
    awardPerfectRoundXP,
    awardGameCompletionXP,
    awardRankingXP,
    clearRecentGains,
    
    // Utilitaires
    getXPRequiredForLevel,
    XP_REWARDS
  };
};
