
import { motion } from 'framer-motion';
import { MINI_JEUX } from '@/constants/gamePhases';
import { MiniJeu } from '@/types';

interface PhaseHeaderProps {
  miniJeu: MiniJeu;
  phase: string;
  roundNumber: number;
  totalRounds: number;
  className?: string;
}

export const PhaseHeader = ({ 
  miniJeu, 
  phase, 
  roundNumber, 
  totalRounds, 
  className = '' 
}: PhaseHeaderProps) => {
  const jeuInfo = MINI_JEUX[miniJeu];

  return (
    <motion.div
      className={`text-center space-y-3 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        {jeuInfo.emoji}
      </motion.div>
      
      <div>
        <h2 className="text-3xl font-black text-white mb-2">
          {jeuInfo.nom}
        </h2>
        <p className="text-white/80 text-lg font-medium">
          {jeuInfo.description}
        </p>
      </div>

      <div className="flex items-center justify-center space-x-4 text-white/70">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Phase:</span>
          <span className="font-semibold capitalize">{phase}</span>
        </div>
        <div className="w-1 h-1 bg-white/50 rounded-full"></div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Manche:</span>
          <span className="font-semibold">{roundNumber}/{totalRounds}</span>
        </div>
      </div>
    </motion.div>
  );
};
