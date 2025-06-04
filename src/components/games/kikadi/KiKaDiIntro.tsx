
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Round } from '@/types/game';

interface KiKaDiIntroProps {
  gameId: string;
  roundData: Round;
  onPhaseComplete: () => void;
}

/**
 * Phase d'introduction du mini-jeu KiKaDi
 * Présente les règles et le contexte de la manche
 */
export const KiKaDiIntro: React.FC<KiKaDiIntroProps> = ({
  roundData,
  onPhaseComplete
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Emoji animé */}
        <motion.div
          className="text-8xl"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🧠
        </motion.div>

        {/* Titre et description */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-white">
            KiKaDi
          </h1>
          <p className="text-xl text-white/90 max-w-md">
            Devinez qui a dit quoi ! 
            Chacun répond anonymement à une question, 
            puis vous devinez qui a donné quelle réponse.
          </p>
        </div>

        {/* Infos de la manche */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-white/80 text-sm mb-2">
            Manche {roundData.roundNumber}
          </div>
          <div className="text-white font-semibold">
            Préparez-vous à répondre !
          </div>
        </div>

        {/* Bouton de démarrage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={onPhaseComplete}
            size="lg"
            className="bg-white text-purple-600 hover:bg-white/90 font-bold px-8 py-4"
          >
            Commencer la manche
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
