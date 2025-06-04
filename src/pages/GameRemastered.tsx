
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { GamePhaseController } from '@/components/game/GamePhaseController';
import { useGameContext } from '@/context/GameContext';
import { useGamePhases } from '@/hooks/useGamePhases';
import { useDevMode } from '@/hooks/useDevMode';
import { generateMockGameState } from '@/utils/devMode';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Page de jeu remastérisée avec la nouvelle architecture
 * Utilise le GamePhaseController pour gérer les phases dynamiquement
 */
const GameRemastered = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { game, setGame, setCurrentRound } = useGameContext();
  const { advancePhase, currentPhase } = useGamePhases();
  const { isDevMode, createDevGame, addMultipleBots } = useDevMode();

  // Initialisation du jeu (mock pour le moment)
  useEffect(() => {
    if (gameId && !game) {
      // En mode dev, créer un jeu de test
      if (gameId.includes('dev')) {
        const mockGame = createDevGame();
        setGame(mockGame);
        
        // Ajouter des bots pour tester
        setTimeout(() => {
          addMultipleBots(3);
        }, 500);
      } else {
        // Production : charger le jeu depuis Supabase
        const mockGame = generateMockGameState();
        mockGame.id = gameId;
        setGame(mockGame);
      }

      // Mock round
      setCurrentRound({
        id: `round-${Date.now()}`,
        gameId: gameId,
        roundNumber: 1,
        miniJeu: 'kikadi',
        phase: 'intro',
        timeRemaining: 60,
        startedAt: new Date().toISOString(),
        question: "Quel est votre rêve le plus fou ?"
      });
    }
  }, [gameId, game, setGame, setCurrentRound, createDevGame, addMultipleBots]);

  const handlePhaseComplete = () => {
    const success = advancePhase();
    
    if (!success && currentPhase === 'result') {
      // Fin de la partie, rediriger vers les résultats
      navigate(`/results/${gameId}`);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (!game || !gameId) {
    return (
      <AnimatedBackground variant="purple">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-center">
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-2xl mb-4">Chargement de la partie...</h2>
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

  return (
    <AnimatedBackground variant="purple">
      {/* Header de jeu */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            onClick={handleBackToDashboard}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft size={16} />
          </Button>
          
          <div className="text-white text-center">
            <div className="text-sm opacity-80">Partie {gameId}</div>
            <div className="font-semibold">{game.currentMiniJeu} • {currentPhase}</div>
            {isDevMode && (
              <div className="text-xs bg-orange-500/20 px-2 py-1 rounded mt-1">
                MODE DEV
              </div>
            )}
          </div>

          <div className="w-8" /> {/* Spacer pour centrer le titre */}
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div className="pt-20">
        <GamePhaseController
          gameId={gameId}
          onPhaseComplete={handlePhaseComplete}
        />
      </div>
    </AnimatedBackground>
  );
};

export default GameRemastered;
