
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Round } from '@/types/game';

interface KiDiVraiIntroProps {
  gameId: string;
  roundData: Round;
  onPhaseComplete: () => void;
}

export const KiDiVraiIntro: React.FC<KiDiVraiIntroProps> = ({
  roundData,
  onPhaseComplete
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8"
      >
        <div className="text-8xl">🤔</div>
        <h1 className="text-4xl font-black text-white">KiDiVrai</h1>
        <p className="text-xl text-white/90 max-w-md">
          Vrai ou Faux ? Testez vos connaissances et bluffez vos amis !
        </p>
        <Button
          onClick={onPhaseComplete}
          size="lg"
          className="bg-white text-purple-600 hover:bg-white/90 font-bold px-8 py-4"
        >
          Commencer
        </Button>
      </motion.div>
    </div>
  );
};
