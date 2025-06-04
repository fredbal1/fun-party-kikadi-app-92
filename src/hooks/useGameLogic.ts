
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentGame, useCurrentPhase, useGameProgress } from '@/store/selectors/gameSelectors';
import { useXPProgression } from '@/hooks/useXPProgression';
import { useVisualEffects } from '@/components/effects/VisualEffects';

// Import des hooks de phase spécialisés
import { useIntroPhaseLogic } from '@/hooks/phases/useIntroPhaseLogic';
import { useQuestionPhaseLogic } from '@/hooks/phases/useQuestionPhaseLogic';
import { useVotingPhaseLogic } from '@/hooks/phases/useVotingPhaseLogic';
import { useRevealPhaseLogic } from '@/hooks/phases/useRevealPhaseLogic';
import { useResultPhaseLogic } from '@/hooks/phases/useResultPhaseLogic';

/**
 * Hook principal de gestion de la logique d'une partie KIKADI
 * 
 * Orchestre les différents hooks de phase et fournit une interface unifiée
 * pour l'interaction avec les composants de jeu.
 * 
 * Utilise les sélecteurs atomiques optimisés pour éviter les re-rendus inutiles.
 */
export const useGameLogic = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  // Sélecteurs atomiques optimisés
  const currentGame = useCurrentGame();
  const currentPhase = useCurrentPhase();
  const { currentRound, totalRounds } = useGameProgress();

  // Hooks spécialisés par phase
  const introLogic = useIntroPhaseLogic();
  const questionLogic = useQuestionPhaseLogic();
  const votingLogic = useVotingPhaseLogic();
  const revealLogic = useRevealPhaseLogic();
  const resultLogic = useResultPhaseLogic();

  // Hooks transversaux
  const {
    currentXP,
    currentLevel,
    progressPercentage,
  } = useXPProgression();
  
  const {
    ConfettiComponent,
    ShakeWrapper
  } = useVisualEffects();

  /**
   * Soumet une réponse selon la phase courante
   * Route vers le bon hook de phase
   */
  const handleSubmitAnswer = (answer: string, isBluff?: boolean) => {
    switch (currentPhase) {
      case 'answering':
        return questionLogic.submitAnswer(answer, isBluff);
      default:
        console.warn('Submit answer called in wrong phase:', currentPhase);
        return Promise.resolve(false);
    }
  };

  /**
   * Soumet un vote selon la phase courante
   * Route vers le bon hook de phase
   */
  const handleSubmitVote = (targetId: string, voteType?: string) => {
    switch (currentPhase) {
      case 'voting':
        return votingLogic.submitVote(targetId, voteType);
      default:
        console.warn('Submit vote called in wrong phase:', currentPhase);
        return Promise.resolve(false);
    }
  };

  /**
   * Envoie une réaction selon la phase courante
   * Route vers le bon hook de phase
   */
  const handleReaction = (emoji: string) => {
    switch (currentPhase) {
      case 'revealing':
        return revealLogic.sendReaction(emoji);
      default:
        console.warn('Reaction sent in wrong phase:', currentPhase);
        return Promise.resolve(false);
    }
  };

  /**
   * Fait avancer la phase courante
   * Route vers le bon hook de phase
   */
  const handleAdvancePhase = () => {
    switch (currentPhase) {
      case 'intro':
        return introLogic.proceedToAnswering();
      case 'answering':
        return questionLogic.proceedToVoting();
      case 'voting':
        return votingLogic.proceedToRevealing();
      case 'revealing':
        return revealLogic.proceedToResults();
      case 'result':
        return resultLogic.progressGame();
      default:
        console.warn('Advance phase called in unknown phase:', currentPhase);
        return false;
    }
  };

  /**
   * Retourne au dashboard principal
   */
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  /**
   * Vérifie si la phase courante peut avancer
   * Délègue aux hooks de phase spécialisés
   */
  const canAdvanceCurrentPhase = () => {
    switch (currentPhase) {
      case 'intro':
        return introLogic.canProceed();
      case 'answering':
        return questionLogic.canProceedToVoting;
      case 'voting':
        return votingLogic.canProceedToRevealing;
      case 'revealing':
      case 'result':
        return true;
      default:
        return false;
    }
  };

  // État dérivé pour l'interface
  const isLastRound = currentRound >= totalRounds;

  return {
    // État de la partie (via sélecteurs atomiques)
    gameId,
    currentGame,
    currentPhase,
    currentRound,
    totalRounds,
    isLastRound,
    
    // Système XP et progression
    currentXP,
    currentLevel,
    progressPercentage,
    
    // Actions principales du joueur (orchestrées)
    handleSubmitAnswer,
    handleSubmitVote,
    handleReaction,
    handleAdvancePhase,
    handleBackToDashboard,
    
    // Vérifications d'état
    canAdvancePhase: canAdvanceCurrentPhase,
    
    // Accès direct aux hooks de phase (pour les composants avancés)
    phaseLogic: {
      intro: introLogic,
      question: questionLogic,
      voting: votingLogic,
      reveal: revealLogic,
      result: resultLogic,
    },
    
    // Composants d'effets visuels
    ConfettiComponent,
    ShakeWrapper
  };
};
