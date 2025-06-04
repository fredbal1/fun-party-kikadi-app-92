
import { useCallback, useState } from 'react';
import { useGamePhases } from '@/hooks/useGamePhases';
import { useCurrentGame, useCurrentPhase, usePlayers } from '@/store/selectors/gameSelectors';
import { useXPProgression } from '@/hooks/useXPProgression';
import { toast } from 'react-hot-toast';

/**
 * Hook pour gérer la logique spécifique à la phase de question/réponse
 * Gère les soumissions de réponses et les transitions
 */
export const useQuestionPhaseLogic = () => {
  const currentGame = useCurrentGame();
  const currentPhase = useCurrentPhase();
  const players = usePlayers();
  const { advancePhase, canAdvancePhase } = useGamePhases();
  const { awardAnswerXP } = useXPProgression();

  const [playerAnswer, setPlayerAnswer] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Soumet une réponse du joueur pour la question courante
   * TODO: Intégrer avec gameService.savePlayerAnswer()
   * @param answer - La réponse du joueur
   * @param isBluff - Si la réponse est un bluff (pour certains modes)
   */
  const submitAnswer = useCallback(async (answer: string, isBluff?: boolean) => {
    if (currentPhase !== 'answering' || isSubmitting) return false;

    setIsSubmitting(true);
    
    try {
      // TODO: Utiliser gameService.savePlayerAnswer(currentUser.id, answer, isBluff)
      console.log('✍️ [QuestionPhase] Soumission réponse:', answer);
      
      setPlayerAnswer(answer);
      awardAnswerXP();
      toast.success('Réponse envoyée !');

      // Vérifier si tous les joueurs ont répondu
      if (canAdvancePhase('voting')) {
        // TODO: Déclencher gameService.triggerAllBotsAnswers() si bots présents
        setTimeout(() => advancePhase(), 1000);
      }

      return true;
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Erreur lors de l\'envoi');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [currentPhase, isSubmitting, awardAnswerXP, canAdvancePhase, advancePhase]);

  /**
   * Simule les réponses des bots pour accélérer la phase
   * TODO: Intégrer avec gameService.simulateAllBotAnswers()
   */
  const triggerBotAnswers = useCallback(async () => {
    if (!currentGame) return false;

    try {
      const botPlayers = players.filter(p => p.role === 'bot');
      
      // TODO: Utiliser gameService.simulateAllBotAnswers(currentGame.id, botPlayers)
      console.log('🤖 [QuestionPhase] Simulation réponses bots:', botPlayers.length);
      
      // Simulation : attendre 2-3 secondes puis avancer
      setTimeout(() => {
        if (canAdvancePhase('voting')) {
          advancePhase();
        }
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error triggering bot answers:', error);
      return false;
    }
  }, [currentGame, players, canAdvancePhase, advancePhase]);

  /**
   * Passe automatiquement à la phase de vote
   */
  const proceedToVoting = useCallback(() => {
    if (currentPhase !== 'answering') return false;

    try {
      const success = advancePhase();
      
      if (success) {
        // TODO: Utiliser gameService.prepareVotingPhase()
        console.log('➡️ [QuestionPhase] Transition vers voting');
        toast.success('Place aux votes!');
      }
      
      return success;
    } catch (error) {
      console.error('Error proceeding to voting:', error);
      return false;
    }
  }, [currentPhase, advancePhase]);

  /**
   * Vérifie si tous les joueurs ont répondu
   */
  const allPlayersAnswered = useCallback(() => {
    return players.every(p => 
      p.current_phase_state === 'answered' || p.role === 'bot'
    );
  }, [players]);

  return {
    // Actions de phase
    submitAnswer,
    triggerBotAnswers,
    proceedToVoting,
    
    // État local
    playerAnswer,
    isSubmitting,
    setPlayerAnswer,
    
    // Validations
    canProceedToVoting: canAdvancePhase('voting'),
    allPlayersAnswered: allPlayersAnswered(),
    
    // État dérivé
    isQuestionPhase: currentPhase === 'answering',
    playersWhoAnswered: players.filter(p => p.current_phase_state === 'answered').length,
    totalPlayers: players.length,
  };
};
