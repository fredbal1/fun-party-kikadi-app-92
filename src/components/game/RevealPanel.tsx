import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Player } from '@/types';
import { useState } from 'react';
import { Heart, ThumbsUp, Laugh, Zap } from 'lucide-react';

interface RevealItem {
  id: string;
  playerName: string;
  playerAvatar?: string;
  content: string;
  isCorrect?: boolean;
  points?: number;
  isBluff?: boolean;
}

interface RevealPanelProps {
  items: RevealItem[];
  onReaction?: (emoji: string) => void;
  onNext?: () => void;
  showReactions?: boolean;
  className?: string;
}

const REACTIONS = [
  { emoji: '❤️', icon: Heart, label: 'J\'adore' },
  { emoji: '👍', icon: ThumbsUp, label: 'Bien joué' },
  { emoji: '😂', icon: Laugh, label: 'Hilarant' },
  { emoji: '😮', icon: Zap, label: 'Surprenant' }
];

export const RevealPanel = ({ 
  items, 
  onReaction, 
  onNext, 
  showReactions = true,
  className = '' 
}: RevealPanelProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const handleRevealNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowAll(true);
    }
  };

  const visibleItems = showAll ? items : items.slice(0, currentIndex + 1);

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="text-6xl mb-4"
          animate={{ 
            rotateY: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 1.5 }}
        >
          🎭
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Révélation !
        </h2>
        <p className="text-white/80">
          Découvrez qui a dit quoi...
        </p>
      </div>

      {/* Revealed items */}
      <div className="space-y-4">
        <AnimatePresence>
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.3,
                type: "spring",
                stiffness: 100
              }}
            >
              <Card className={`${
                item.isCorrect 
                  ? 'bg-green-500/20 border-green-400/50' 
                  : item.isBluff
                  ? 'bg-orange-500/20 border-orange-400/50'
                  : 'bg-white/10 border-white/20'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">
                          {item.playerAvatar || '🎮'}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-semibold">
                            {item.playerName}
                          </span>
                          {item.isBluff && (
                            <span className="text-xs bg-orange-500/30 text-orange-200 px-2 py-1 rounded">
                              BLUFF
                            </span>
                          )}
                        </div>
                        <p className="text-white/90 font-medium">
                          "{item.content}"
                        </p>
                      </div>
                    </div>
                    
                    {item.points !== undefined && (
                      <motion.div
                        className={`text-right ml-3 ${
                          item.isCorrect ? 'text-green-200' : 'text-white/70'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="font-bold">
                          {item.points > 0 ? '+' : ''}{item.points}
                        </div>
                        <div className="text-xs">points</div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reactions */}
      {showReactions && showAll && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-white/80 text-center text-sm">
            Comment avez-vous trouvé cette révélation ?
          </p>
          <div className="flex justify-center space-x-3">
            {REACTIONS.map((reaction) => (
              <Button
                key={reaction.emoji}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => onReaction?.(reaction.emoji)}
              >
                <span className="text-lg mr-1">{reaction.emoji}</span>
                <span className="text-xs">{reaction.label}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="space-y-3">
        {!showAll && (
          <Button
            onClick={handleRevealNext}
            className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
            size="lg"
          >
            {currentIndex < items.length - 1 ? 'Révéler suivant' : 'Voir tous les résultats'}
          </Button>
        )}
        
        {showAll && onNext && (
          <Button
            onClick={onNext}
            className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
            size="lg"
          >
            Continuer
          </Button>
        )}
      </div>
    </motion.div>
  );
};
