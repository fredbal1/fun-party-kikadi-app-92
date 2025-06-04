
import React, { Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LazyFallback } from '@/utils/lazyComponents';
import { GamePhase, MiniGameType, PlayerState } from '@/types';

// Import des composants de phase
import { IntroPhase } from './phases/IntroPhase';
import { QuestionPhase } from './phases/QuestionPhase';
import { ActionPhase } from './phases/ActionPhase';
import { RevealPhase } from './phases/RevealPhase';
import { ScorePhase } from './phases/ScorePhase';

interface GamePhaseRendererProps {
  currentPhase: GamePhase;
  miniJeu: MiniGameType;
  roundNumber: number;
  totalRounds: number;
  players: PlayerState[];
  onSubmitAnswer: (answer: string) => void;
  onSubmitVote: (targetId: string) => void;
  onReaction: (emoji: string) => void;
  onAdvance: () => void;
  selectedVote?: string;
  timeRemaining?: number;
}

/**
 * Composant de rendu dynamique des phases de jeu
 * Route vers le bon composant selon la phase courante
 */
export const GamePhaseRenderer: React.FC<GamePhaseRendererProps> = ({
  currentPhase,
  miniJeu,
  roundNumber,
  totalRounds,
  players,
  onSubmitAnswer,
  onSubmitVote,
  onReaction,
  onAdvance,
  selectedVote,
  timeRemaining
}) => {
  const renderPhase = () => {
    const commonProps = {
      miniJeu,
      roundNumber,
      totalRounds,
      players
    };

    switch (currentPhase) {
      case 'intro':
        return (
          <IntroPhase
            {...commonProps}
            onAdvance={onAdvance}
          />
        );

      case 'answering':
        return (
          <QuestionPhase
            {...commonProps}
            question="TODO: Question depuis Supabase" // TODO: Récupérer depuis Supabase
            onSubmitAnswer={onSubmitAnswer}
            timeRemaining={timeRemaining}
          />
        );

      case 'voting':
        return (
          <ActionPhase
            {...commonProps}
            onSubmitVote={onSubmitVote}
            selectedVote={selectedVote}
          />
        );

      case 'revealing':
        return (
          <RevealPhase
            {...commonProps}
            correctAnswers={{}} // TODO: Récupérer depuis Supabase
            onReaction={onReaction}
          />
        );

      case 'result':
        return (
          <ScorePhase
            {...commonProps}
            isLastRound={roundNumber >= totalRounds}
            onAdvance={onAdvance}
          />
        );

      default:
        return (
          <div className="text-center text-white">
            <h2 className="text-2xl mb-4">Phase inconnue</h2>
            <p>La phase "{currentPhase}" n'est pas implémentée.</p>
          </div>
        );
    }
  };

  return (
    <Suspense fallback={<LazyFallback />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPhase}-${roundNumber}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {renderPhase()}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};
