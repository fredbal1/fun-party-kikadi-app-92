
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { PhaseTimer } from '@/components/ui/PhaseTimer';
import { GamePhaseRenderer } from '@/components/game/GamePhaseRenderer';
import { DevBotTrigger } from '@/components/dev/DevBotTrigger';
import { useGameLogic } from '@/hooks/useGameLogic';
import { PHASE_TIMERS } from '@/constants/gamePhases';

/**
 * Page principale du jeu KIKADI
 * 
 * Composant UI pur qui délègue toute la logique métier au hook useGameLogic.
 * 
 * Note sur le lazy loading : Les composants de phases ne nécessitent pas de lazy()
 * car ils sont légers (< 200 lignes chacun) et sans dépendances lourdes.
 * Le gain de performance serait négligeable vs la complexité ajoutée.
 */
const Game: React.FC = () => {
  const {
    // État
    gameId,
    currentGame,
    currentPhase,
    currentRound,
    totalRounds,
    players,
    
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
  } = useGameLogic();

  // État de chargement
  if (!currentGame || !gameId) {
    return (
      <AnimatedBackground variant="purple">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-center space-y-4">
            <div className="text-6xl animate-pulse">🎮</div>
            <h2 className="text-2xl font-bold">Chargement de la partie...</h2>
            <p className="text-white/70">Connexion en cours...</p>
            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2" size={16} />
              Retour au dashboard
            </Button>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  const showTimer = currentPhase !== 'intro' && currentPhase !== 'result';

  return (
    <AnimatedBackground variant="purple">
      <ConfettiComponent />
      
      <div className="min-h-screen">
        {/* Header fixe */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm border-b border-white/10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          data-testid="game-header"
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Bouton retour */}
            <Button
              onClick={handleBackToDashboard}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              data-testid="back-button"
            >
              <ArrowLeft size={16} />
            </Button>
            
            {/* Infos de partie */}
            <div className="text-white text-center">
              <div className="text-sm opacity-80">Partie {gameId}</div>
              <div className="font-semibold">
                {currentGame.current_mini_jeu} • {currentPhase}
              </div>
              <div className="text-xs opacity-60">
                Manche {currentRound}/{totalRounds}
              </div>
            </div>

            {/* Timer ou spacer */}
            <div className="w-16 flex justify-end">
              {showTimer && (
                <PhaseTimer
                  duration={PHASE_TIMERS[currentPhase] || 30}
                  onComplete={handleAdvancePhase}
                />
              )}
            </div>
          </div>
        </motion.header>

        {/* Barre de progression XP */}
        <motion.div
          className="fixed top-16 left-0 right-0 z-10 px-6 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between text-white/70 text-xs mb-1">
              <span>XP: {currentXP}</span>
              <span>Niveau {currentLevel}</span>
            </div>
            <div className="bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Contenu principal */}
        <main className="pt-24 pb-8 px-6">
          <ShakeWrapper>
            <GamePhaseRenderer
              currentPhase={currentPhase}
              miniJeu={currentGame.current_mini_jeu}
              roundNumber={currentRound}
              totalRounds={totalRounds}
              players={players}
              onSubmitAnswer={handleSubmitAnswer}
              onSubmitVote={handleSubmitVote}
              onReaction={handleReaction}
              onAdvance={handleAdvancePhase}
              timeRemaining={PHASE_TIMERS[currentPhase]}
            />
          </ShakeWrapper>
        </main>

        {/* Debug info en développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 space-y-2">
            {/* Panel debug existant */}
            <div className="bg-black/50 text-white p-2 rounded text-xs">
              <div>Phase: {currentPhase}</div>
              <div>Joueurs: {players.length}</div>
              <div>Can Advance: {canAdvancePhase(currentPhase).toString()}</div>
            </div>
            
            {/* Bouton bot test */}
            <DevBotTrigger 
              onTrigger={() => console.log('Bot triggered from Game.tsx')}
            />
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default Game;
