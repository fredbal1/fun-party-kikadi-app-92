
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';
import { GamePhase, MiniGameType } from '@/types/game';

// Import des composants de phases pour chaque mini-jeu
import { KiKaDiIntro, KiKaDiPlay, KiKaDiVote, KiKaDiReveal, KiKaDiResult } from '@/components/games/kikadi';
import { KiDiVraiIntro, KiDiVraiPlay, KiDiVraiVote, KiDiVraiReveal, KiDiVraiResult } from '@/components/games/kidivrai';
import { KiDeNousIntro, KiDeNousPlay, KiDeNousVote, KiDeNousReveal, KiDeNousResult } from '@/components/games/kidenous';
import { KiDejaIntro, KiDejaPlay, KiDejaVote, KiDejaReveal, KiDejaResult } from '@/components/games/kideja';

interface GamePhaseControllerProps {
  gameId: string;
  onPhaseComplete?: (nextPhase: GamePhase) => void;
}

/**
 * Contrôleur principal des phases de jeu
 * Route dynamiquement vers le bon composant selon le mini-jeu et la phase
 */
export const GamePhaseController: React.FC<GamePhaseControllerProps> = ({
  gameId,
  onPhaseComplete
}) => {
  const { game, currentRound } = useGameContext();

  if (!game || !currentRound) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Chargement du jeu...</div>
      </div>
    );
  }

  const currentMiniJeu = game.currentMiniJeu;
  const currentPhase = game.currentPhase;

  /**
   * Sélectionne le composant approprié selon le mini-jeu et la phase
   */
  const renderPhaseComponent = () => {
    const commonProps = {
      gameId,
      roundData: currentRound,
      onPhaseComplete: onPhaseComplete || (() => {}),
    };

    switch (currentMiniJeu) {
      case 'kikadi':
        switch (currentPhase) {
          case 'intro':
            return <KiKaDiIntro {...commonProps} />;
          case 'answering':
            return <KiKaDiPlay {...commonProps} />;
          case 'voting':
            return <KiKaDiVote {...commonProps} />;
          case 'revealing':
            return <KiKaDiReveal {...commonProps} />;
          case 'result':
            return <KiKaDiResult {...commonProps} />;
          default:
            return null;
        }

      case 'kidivrai':
        switch (currentPhase) {
          case 'intro':
            return <KiDiVraiIntro {...commonProps} />;
          case 'answering':
            return <KiDiVraiPlay {...commonProps} />;
          case 'voting':
            return <KiDiVraiVote {...commonProps} />;
          case 'revealing':
            return <KiDiVraiReveal {...commonProps} />;
          case 'result':
            return <KiDiVraiResult {...commonProps} />;
          default:
            return null;
        }

      case 'kidenous':
        switch (currentPhase) {
          case 'intro':
            return <KiDeNousIntro {...commonProps} />;
          case 'answering':
            return <KiDeNousPlay {...commonProps} />;
          case 'voting':
            return <KiDeNousVote {...commonProps} />;
          case 'revealing':
            return <KiDeNousReveal {...commonProps} />;
          case 'result':
            return <KiDeNousResult {...commonProps} />;
          default:
            return null;
        }

      case 'kideja':
        switch (currentPhase) {
          case 'intro':
            return <KiDejaIntro {...commonProps} />;
          case 'answering':
            return <KiDejaPlay {...commonProps} />;
          case 'voting':
            return <KiDejaVote {...commonProps} />;
          case 'revealing':
            return <KiDejaReveal {...commonProps} />;
          case 'result':
            return <KiDejaResult {...commonProps} />;
          default:
            return null;
        }

      default:
        return (
          <div className="text-center text-white">
            <h2 className="text-2xl mb-4">Mini-jeu non reconnu</h2>
            <p>Le mini-jeu "{currentMiniJeu}" n'est pas encore implémenté.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentMiniJeu}-${currentPhase}-${currentRound.roundNumber}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {renderPhaseComponent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
