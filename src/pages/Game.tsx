
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { PhaseTimer } from '@/components/ui/PhaseTimer';
import { PlayerCard } from '@/components/game/PlayerCard';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useXPProgression } from '@/hooks/useXPProgression';
import { useVisualEffects } from '@/components/effects/VisualEffects';
import { ReactionSystem } from '@/components/game/ReactionSystem';
import { KiKaDiGame } from '@/components/games/KiKaDiGame';
import { KiDiVraiGame } from '@/components/games/KiDiVraiGame';
import { KiDejaGame } from '@/components/games/KiDejaGame';
import { KiDeNousGame } from '@/components/games/KiDeNousGame';
import { GamePhase, MiniGame } from '@/types';
import { PHASE_TIMERS } from '@/constants/gamePhases';
import { toast } from 'react-hot-toast';

const Game = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { currentPhase, setCurrentPhase, nextPhase, players } = useGameState();
  
  // XP System
  const {
    currentXP,
    currentLevel,
    progressPercentage,
    awardAnswerXP,
    awardCorrectGuessXP,
    awardGameCompletionXP
  } = useXPProgression();

  // Visual Effects
  const {
    showConfetti,
    triggerConfetti,
    triggerShake,
    ConfettiComponent,
    ShakeWrapper
  } = useVisualEffects();

  // Game State
  const [currentMiniJeu, setCurrentMiniJeu] = useState<MiniGame>('kikadi');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 5;

  // Mock data - sera remplacé par Supabase
  const gameData = {
    kikadi: {
      question: "Quelle est votre citation inspirante préférée ?"
    },
    kidivrai: {
      statement: "Il est possible de survivre 30 jours sans manger"
    },
    kideja: {
      experiences: []
    },
    kidenous: {
      category: "Le plus susceptible de devenir célèbre"
    }
  };

  const handlePhaseComplete = () => {
    switch (currentPhase) {
      case 'intro':
        setCurrentPhase('answering');
        break;
      case 'answering':
        if (!hasAnswered && currentMiniJeu === 'kikadi') {
          toast.error('Vous devez répondre avant de continuer !');
          return;
        }
        setCurrentPhase('voting');
        break;
      case 'voting':
        if (!selectedPlayer && (currentMiniJeu === 'kikadi' || currentMiniJeu === 'kidenous')) {
          toast.error('Vous devez faire un choix !');
          return;
        }
        setCurrentPhase('revealing');
        break;
      case 'revealing':
        setCurrentPhase('result');
        triggerConfetti();
        awardCorrectGuessXP();
        break;
      case 'result':
        if (currentRound < totalRounds) {
          setCurrentPhase('transition');
          setCurrentRound(prev => prev + 1);
          // Changer de mini-jeu pour la prochaine manche
          const jeux: MiniGame[] = ['kikadi', 'kidivrai', 'kideja', 'kidenous'];
          const nextJeu = jeux[currentRound % jeux.length];
          setCurrentMiniJeu(nextJeu);
        } else {
          awardGameCompletionXP();
          navigate(`/results/${gameId}`);
        }
        break;
      case 'transition':
        setCurrentPhase('intro');
        setHasAnswered(false);
        setSelectedPlayer(null);
        break;
    }
  };

  const handleAnswer = (answer: string) => {
    setHasAnswered(true);
    awardAnswerXP();
    toast.success('Réponse envoyée !');
  };

  const handleVote = (targetId: string) => {
    setSelectedPlayer(targetId);
    toast.success('Vote enregistré !');
  };

  const handleReaction = (emoji: string) => {
    triggerShake('light');
    toast.success(`Réaction envoyée: ${emoji}`);
  };

  const renderMiniJeu = () => {
    const commonProps = {
      phase: currentPhase,
      players,
      currentRound,
      totalRounds,
      onNext: handlePhaseComplete
    };

    switch (currentMiniJeu) {
      case 'kikadi':
        return (
          <KiKaDiGame
            {...commonProps}
            question={gameData.kikadi.question}
            onAnswer={handleAnswer}
            onVote={handleVote}
            hasAnswered={hasAnswered}
            selectedVote={selectedPlayer}
          />
        );
      
      case 'kidivrai':
        return (
          <KiDiVraiGame
            {...commonProps}
            statement={gameData.kidivrai.statement}
            onVote={(choice) => {
              setSelectedPlayer(choice);
              toast.success(`Vote: ${choice}`);
            }}
            selectedChoice={selectedPlayer as 'vrai' | 'faux'}
          />
        );

      case 'kideja':
        return (
          <KiDejaGame
            {...commonProps}
            experiences={gameData.kideja.experiences}
            onVote={handleVote}
            selectedExperience={selectedPlayer}
          />
        );

      case 'kidenous':
        return (
          <KiDeNousGame
            {...commonProps}
            category={gameData.kidenous.category}
            onVote={handleVote}
            selectedPlayer={selectedPlayer}
          />
        );

      default:
        return null;
    }
  };

  const renderTransitionPhase = () => (
    <motion.div
      className="text-center space-y-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-6xl mb-4">🎯</div>
      <h2 className="text-3xl font-bold text-white">Manche suivante !</h2>
      <p className="text-white/80 text-lg">
        Préparez-vous pour le prochain défi...
      </p>
      <div className="text-white/60">
        Manche {currentRound} / {totalRounds}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={handlePhaseComplete}
          className="bg-white text-purple-600 hover:bg-white/90 font-bold"
          size="lg"
        >
          Commencer !
        </Button>
      </motion.div>
    </motion.div>
  );

  return (
    <AnimatedBackground variant="purple">
      <ConfettiComponent />
      
      <div className="min-h-screen px-6 py-8">
        {/* Game header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white">
            <div className="text-sm opacity-80">Partie {gameId}</div>
            <div className="font-semibold">Manche {currentRound}</div>
            <div className="text-xs opacity-60">
              XP: {currentXP} | Niveau {currentLevel}
            </div>
          </div>
          
          {currentPhase !== 'intro' && currentPhase !== 'transition' && (
            <PhaseTimer
              duration={PHASE_TIMERS[currentPhase] || 30}
              onComplete={handlePhaseComplete}
            />
          )}
        </motion.div>

        {/* XP Progress Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Main content */}
        <ShakeWrapper>
          <div className="max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPhase}-${currentMiniJeu}-${currentRound}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {currentPhase === 'transition' ? renderTransitionPhase() : renderMiniJeu()}
              </motion.div>
            </AnimatePresence>

            {/* Reaction System */}
            {currentPhase === 'revealing' && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <ReactionSystem onReaction={handleReaction} />
              </motion.div>
            )}

            {/* Next phase button for certain phases */}
            {(currentPhase === 'intro' || currentPhase === 'result') && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <Button
                  onClick={handlePhaseComplete}
                  className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
                  size="lg"
                >
                  {currentPhase === 'result' 
                    ? currentRound < totalRounds ? 'Manche suivante' : 'Voir les résultats finaux'
                    : 'Continuer'
                  }
                </Button>
              </motion.div>
            )}
          </div>
        </ShakeWrapper>
      </div>
    </AnimatedBackground>
  );
};

export default Game;
