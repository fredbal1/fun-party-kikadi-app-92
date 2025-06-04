
import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { useGamePhases } from '@/hooks/useGamePhases';
import { useXPProgression } from '@/hooks/useXPProgression';
import { useVisualEffects } from '@/components/effects/VisualEffects';
import { GamePhase, MiniGameType } from '@/types';
import { toast } from 'react-hot-toast';

/**
 * Hook principal de gestion de la logique d'une partie KIKADI
 * 
 * Centralise toute la logique métier : états, transitions, actions joueur.
 * Gère les interactions avec le store global et prépare l'intégration Supabase.
 * 
 * @returns {Object} Objet contenant :
 *   - État : gameId, currentGame, currentPhase, players, etc.
 *   - Actions : handleSubmitAnswer, handleSubmitVote, handleReaction, etc.
 *   - Utilitaires : canAdvancePhase, composants d'effets visuels
 * 
 * @example
 * ```tsx
 * const {
 *   currentPhase,
 *   handleSubmitAnswer,
 *   handleAdvancePhase
 * } = useGameLogic();
 * ```
 */
export const useGameLogic = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  // Store global
  const {
    currentGame,
    currentPhase,
    currentRound,
    players,
    setCurrentGame,
    setCurrentPhase,
    setCurrentRound
  } = useGameStore();

  // Hooks spécialisés
  const { advancePhase, canAdvancePhase } = useGamePhases();
  const {
    currentXP,
    currentLevel,
    progressPercentage,
    awardAnswerXP,
    awardCorrectGuessXP,
    awardGameCompletionXP
  } = useXPProgression();
  
  const {
    triggerConfetti,
    triggerShake,
    ConfettiComponent,
    ShakeWrapper
  } = useVisualEffects();

  // État dérivé
  const totalRounds = currentGame?.nb_manches || 5;
  const isLastRound = currentRound >= totalRounds;

  /**
   * Initialisation du jeu au montage du composant
   * TODO: Remplacer par chargement Supabase réel via gameService.loadGame()
   */
  useEffect(() => {
    if (gameId && !currentGame) {
      // TODO: Charger la partie depuis Supabase
      const mockGame = {
        id: gameId,
        host_id: 'user-1',
        mode: 'classique' as const,
        ambiance: 'safe' as const,
        status: 'running' as const,
        mini_jeux: ['kikadi', 'kidivrai'],
        nb_manches: 5,
        current_round: 1,
        current_phase: 'intro' as GamePhase,
        current_mini_jeu: 'kikadi' as MiniGameType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCurrentGame(mockGame);
      setCurrentPhase('intro');
      setCurrentRound(1);
    }
  }, [gameId, currentGame, setCurrentGame, setCurrentPhase, setCurrentRound]);

  /**
   * Soumet une réponse de joueur pour la phase courante
   * 
   * @param {string} answer - La réponse du joueur (texte libre)
   * @throws {Error} Si la soumission échoue
   * 
   * TODO: Intégrer playerService.submitAnswer(gameId, playerId, answer)
   */
  const handleSubmitAnswer = useCallback(async (answer: string) => {
    try {
      // TODO: Utiliser playerService.submitAnswer(answer)
      console.log('Answer submitted:', answer);
      
      awardAnswerXP();
      toast.success('Réponse envoyée !');
      
      // Avancer automatiquement si possible
      if (canAdvancePhase('voting')) {
        advancePhase();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  }, [awardAnswerXP, canAdvancePhase, advancePhase]);

  /**
   * Soumet un vote/choix du joueur pour la phase de vote
   * 
   * @param {string} targetId - ID du joueur/réponse ciblé(e)
   * @throws {Error} Si le vote échoue
   * 
   * TODO: Intégrer playerService.submitVote(gameId, playerId, targetId)
   */
  const handleSubmitVote = useCallback(async (targetId: string) => {
    try {
      // TODO: Utiliser playerService.submitVote(targetId)
      console.log('Vote submitted:', targetId);
      
      toast.success('Vote enregistré !');
      
      // Avancer automatiquement si possible
      if (canAdvancePhase('revealing')) {
        advancePhase();
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error('Erreur lors du vote');
    }
  }, [canAdvancePhase, advancePhase]);

  /**
   * Envoie une réaction emoji en temps réel
   * 
   * @param {string} emoji - L'emoji à envoyer (ex: "😂", "🔥")
   * @throws {Error} Si l'envoi de réaction échoue
   * 
   * TODO: Intégrer realtimeService.sendReaction(gameId, playerId, emoji)
   */
  const handleReaction = useCallback(async (emoji: string) => {
    try {
      // TODO: Utiliser playerService.sendReaction(emoji)
      console.log('Reaction sent:', emoji);
      
      triggerShake('light');
      toast.success(`Réaction envoyée: ${emoji}`);
    } catch (error) {
      console.error('Error sending reaction:', error);
    }
  }, [triggerShake]);

  /**
   * Fait avancer manuellement la phase (bouton host uniquement)
   * Gère la logique de fin de partie et transitions entre manches
   * 
   * @throws {Error} Si la transition échoue
   * 
   * TODO: Synchroniser avec gameService.updateGamePhase()
   */
  const handleAdvancePhase = useCallback(() => {
    const success = advancePhase();
    
    if (!success && currentPhase === 'result') {
      // Fin de partie ou manche suivante
      if (isLastRound) {
        awardGameCompletionXP();
        navigate(`/results/${gameId}`);
      } else {
        // Manche suivante
        setCurrentRound(currentRound + 1);
        setCurrentPhase('intro');
        // TODO: Changer de mini-jeu selon la logique métier
      }
    } else if (currentPhase === 'revealing') {
      triggerConfetti();
      awardCorrectGuessXP();
    }
  }, [
    advancePhase, 
    currentPhase, 
    isLastRound, 
    awardGameCompletionXP, 
    navigate, 
    gameId,
    setCurrentRound,
    setCurrentPhase,
    currentRound,
    triggerConfetti,
    awardCorrectGuessXP
  ]);

  /**
   * Retourne au dashboard principal (abandon de partie)
   * 
   * TODO: Intégrer gameService.leaveGame() si nécessaire
   */
  const handleBackToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  /**
   * Réinitialise complètement l'état du jeu
   * Utilisé en cas d'erreur critique ou redémarrage
   * 
   * TODO: Synchroniser avec gameService.resetGame()
   */
  const resetGame = useCallback(() => {
    setCurrentGame(null);
    setCurrentPhase('intro');
    setCurrentRound(1);
    navigate('/dashboard');
  }, [setCurrentGame, setCurrentPhase, setCurrentRound, navigate]);

  /**
   * Passe automatiquement à la phase suivante selon la logique du mini-jeu
   * 
   * @returns {boolean} true si la transition a réussi, false sinon
   */
  const goToNextPhase = useCallback(() => {
    return advancePhase();
  }, [advancePhase]);

  return {
    // État de la partie
    gameId,
    currentGame,
    currentPhase,
    currentRound,
    totalRounds,
    players,
    isLastRound,
    
    // Système XP et progression
    currentXP,
    currentLevel,
    progressPercentage,
    
    // Actions principales du joueur
    handleSubmitAnswer,
    handleSubmitVote,
    handleReaction,
    handleAdvancePhase,
    handleBackToDashboard,
    
    // Actions utilitaires
    resetGame,
    goToNextPhase,
    
    // Vérifications d'état
    canAdvancePhase,
    
    // Composants d'effets visuels
    ConfettiComponent,
    ShakeWrapper
  };
};
