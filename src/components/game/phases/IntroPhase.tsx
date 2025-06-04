
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PhaseHeader } from '@/components/game/PhaseHeader';
import { MiniGameType } from '@/types';

interface IntroPhaseProps {
  miniJeu: MiniGameType;
  roundNumber: number;
  totalRounds: number;
  onAdvance: () => void;
}

/**
 * Composant d'introduction de chaque mini-jeu
 * Affiche les règles et le bouton pour commencer
 */
export const IntroPhase: React.FC<IntroPhaseProps> = ({
  miniJeu,
  roundNumber,
  totalRounds,
  onAdvance
}) => {
  return (
    <div className="text-center space-y-8" data-testid="intro-phase">
      <PhaseHeader
        miniJeu={miniJeu}
        phase="intro"
        roundNumber={roundNumber}
        totalRounds={totalRounds}
      />

      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white/90">
          <p className="text-lg leading-relaxed">
            Préparez-vous pour ce nouveau défi ! 
            Lisez bien la question et donnez votre meilleure réponse.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Button
          onClick={onAdvance}
          size="lg"
          className="bg-white text-purple-600 hover:bg-white/90 font-bold px-8 py-3"
        >
          C'est parti ! 🚀
        </Button>
      </motion.div>
    </div>
  );
};
