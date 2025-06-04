
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Player, ReactionType } from '@/types/models';

interface OptimizedPlayerCardProps {
  player: Player;
  isCurrentPlayer?: boolean;
  showScore?: boolean;
  showReaction?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Composant PlayerCard optimisé avec React.memo
 * Évite les re-rendus inutiles lors des mises à jour fréquentes
 */
export const OptimizedPlayerCard = memo<OptimizedPlayerCardProps>(({
  player,
  isCurrentPlayer = false,
  showScore = true,
  showReaction = true,
  onClick,
  className = ''
}) => {
  const handleClick = () => {
    if (onClick && !isCurrentPlayer) {
      onClick();
    }
  };

  const getConnectionStatus = () => {
    if (!player.is_connected) return '🔴';
    if (!player.is_ready) return '🟡';
    return '🟢';
  };

  const getPlayerStateEmoji = () => {
    switch (player.current_phase_state) {
      case 'answered': return '✅';
      case 'voted': return '🗳️';
      case 'ready': return '👍';
      default: return '⏳';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={onClick && !isCurrentPlayer ? { scale: 1.02 } : {}}
      whileTap={onClick && !isCurrentPlayer ? { scale: 0.98 } : {}}
      className={className}
    >
      <Card 
        className={`
          relative cursor-pointer transition-all duration-200
          ${isCurrentPlayer 
            ? 'bg-white/20 border-white/40 ring-2 ring-white/30' 
            : 'bg-white/10 border-white/20 hover:bg-white/15'
          }
          ${!player.is_connected ? 'opacity-60' : ''}
        `}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Player Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="text-2xl">
                  {player.avatar || '👤'}
                </div>
                <div className="absolute -bottom-1 -right-1 text-xs">
                  {getConnectionStatus()}
                </div>
              </div>
              
              <div className="text-white">
                <div className="font-medium text-sm">
                  {player.pseudo}
                  {player.is_host && ' 👑'}
                </div>
                {showScore && (
                  <div className="text-xs text-white/70">
                    {player.score} pts
                  </div>
                )}
              </div>
            </div>

            {/* Status & Reaction */}
            <div className="flex items-center space-x-2">
              <div className="text-lg">
                {getPlayerStateEmoji()}
              </div>
              
              {showReaction && player.reaction && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-xl"
                >
                  {player.reaction}
                </motion.div>
              )}

              {player.effet_active && (
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="text-sm"
                >
                  ✨
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom equality check pour optimiser les re-rendus
  return (
    prevProps.player.id === nextProps.player.id &&
    prevProps.player.pseudo === nextProps.player.pseudo &&
    prevProps.player.score === nextProps.player.score &&
    prevProps.player.is_connected === nextProps.player.is_connected &&
    prevProps.player.is_ready === nextProps.player.is_ready &&
    prevProps.player.current_phase_state === nextProps.player.current_phase_state &&
    prevProps.player.reaction === nextProps.player.reaction &&
    prevProps.player.effet_active === nextProps.player.effet_active &&
    prevProps.isCurrentPlayer === nextProps.isCurrentPlayer &&
    prevProps.showScore === nextProps.showScore &&
    prevProps.showReaction === nextProps.showReaction
  );
});

OptimizedPlayerCard.displayName = 'OptimizedPlayerCard';
