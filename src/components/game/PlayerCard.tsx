
import { motion } from 'framer-motion';
import { Player } from '@/types';
import { Badge } from '@/components/ui/badge';

interface PlayerCardProps {
  player: Player;
  showScore?: boolean;
  showReaction?: boolean;
  className?: string;
}

export const PlayerCard = ({ 
  player, 
  showScore = false, 
  showReaction = true,
  className = ''
}: PlayerCardProps) => {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg">
              {player.user?.avatar || '🎮'}
            </span>
          </div>
          
          {/* Player info */}
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">
                {player.user?.pseudo || 'Joueur'}
              </span>
              {player.is_host && (
                <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-200">
                  Host
                </Badge>
              )}
            </div>
            {showScore && (
              <div className="text-white/70 text-sm">
                {player.score} points
              </div>
            )}
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center space-x-2">
          {player.is_ready && (
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          )}
          
          {showReaction && player.reaction && (
            <motion.div
              className="text-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              {player.reaction}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
