
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
 * Centralise toute la logique métier : états, transitions, actions
 * @returns Objet avec phase courante, actions disponibles, handlers
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
   * TODO: Remplacer par chargement Supabase réel
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
   * Gestion de la soumission d'une réponse
   * TODO: Envoyer à Supabase via playerService
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
   * Gestion du vote/choix du joueur
   * TODO: Envoyer à Supabase via playerService
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
   * Gestion des réactions emoji
   * TODO: Envoyer à Supabase en temps réel
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
   * Avancement manuel de phase (bouton host)
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
   * Retour au dashboard
   */
  const handleBackToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  return {
    // État
    gameId,
    currentGame,
    currentPhase,
    currentRound,
    totalRounds,
    players,
    isLastRound,
    
    // XP System
    currentXP,
    currentLevel,
    progressPercentage,
    
    // Actions
    handleSubmitAnswer,
    handleSubmitVote,
    handleReaction,
    handleAdvancePhase,
    handleBackToDashboard,
    
    // Utilitaires
    canAdvancePhase,
    
    // Composants d'effets
    ConfettiComponent,
    ShakeWrapper
  };
};
