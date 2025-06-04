
import { useCallback, useState } from 'react';
import { useGamePhases } from '@/hooks/useGamePhases';
import { useCurrentGame, useCurrentPhase, usePlayers } from '@/store/selectors/gameSelectors';
import { toast } from 'react-hot-toast';

/**
 * Hook pour gérer la logique spécifique à la phase de vote
 * Gère les soumissions de votes et les transitions vers reveal
 */
export const useVotingPhaseLogic = () => {
  const currentGame = useCurrentGame();
  const currentPhase = useCurrentPhase();
  const players = usePlayers();
  const { advancePhase, canAdvancePhase } = useGamePhases();

  const [selectedVote, setSelectedVote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Soumet un vote du joueur
   * TODO: Intégrer avec gameService.savePlayerVote()
   * @param targetId - L'ID du joueur ciblé par le vote
   * @param voteType - Le type de vote selon le mini-jeu
   */
  const submitVote = useCallback(async (targetId: string, voteType: string = 'association') => {
    if (currentPhase !== 'voting' || isSubmitting) return false;

    setIsSubmitting(true);
    
    try {
      // TODO: Utiliser gameService.savePlayerVote(currentUser.id, targetId, voteType)
      console.log('🗳️ [VotingPhase] Soumission vote:', targetId, voteType);
      
      setSelectedVote(targetId);
      toast.success('Vote enregistré !');

      // Vérifier si tous les joueurs ont voté
      if (canAdvancePhase('revealing')) {
        // TODO: Déclencher gameService.triggerAllBotsVotes() si bots présents
        setTimeout(() => advancePhase(), 1000);
      }

      return true;
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error('Erreur lors du vote');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [currentPhase, isSubmitting, canAdvancePhase, advancePhase]);

  /**
   * Simule les votes des bots pour accélérer la phase
   * TODO: Intégrer avec gameService.simulateAllBotVotes()
   */
  const triggerBotVotes = useCallback(async () => {
    if (!currentGame) return false;

    try {
      const botPlayers = players.filter(p => p.role === 'bot');
      const availableTargets = players.filter(p => p.role !== 'bot').map(p => p.id);
      
      // TODO: Utiliser gameService.simulateAllBotVotes(currentGame.id, botPlayers, availableTargets)
      console.log('🤖 [VotingPhase] Simulation votes bots:', botPlayers.length);
      
      // Simulation : attendre 1-2 secondes puis avancer
      setTimeout(() => {
        if (canAdvancePhase('revealing')) {
          advancePhase();
        }
      }, 1500);

      return true;
    } catch (error) {
      console.error('Error triggering bot votes:', error);
      return false;
    }
  }, [currentGame, players, canAdvancePhase, advancePhase]);

  /**
   * Passe automatiquement à la phase de révélation
   */
  const proceedToRevealing = useCallback(() => {
    if (currentPhase !== 'voting') return false;

    try {
      const success = advancePhase();
      
      if (success) {
        // TODO: Utiliser gameService.prepareRevealPhase()
        console.log('➡️ [VotingPhase] Transition vers revealing');
        toast.success('Révélation des résultats!');
      }
      
      return success;
    } catch (error) {
      console.error('Error proceeding to revealing:', error);
      return false;
    }
  }, [currentPhase, advancePhase]);

  /**
   * Vérifie si tous les joueurs ont voté
   */
  const allPlayersVoted = useCallback(() => {
    return players.every(p => 
      p.current_phase_state === 'voted' || p.role === 'bot'
    );
  }, [players]);

  return {
    // Actions de phase
    submitVote,
    triggerBotVotes,
    proceedToRevealing,
    
    // État local
    selectedVote,
    isSubmitting,
    setSelectedVote,
    
    // Validations
    canProceedToRevealing: canAdvancePhase('revealing'),
    allPlayersVoted: allPlayersVoted(),
    
    // État dérivé
    isVotingPhase: currentPhase === 'voting',
    playersWhoVoted: players.filter(p => p.current_phase_state === 'voted').length,
    totalPlayers: players.length,
    availableTargets: players.filter(p => p.role !== 'bot'),
  };
};
