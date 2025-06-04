
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Heart, ThumbsUp, Laugh, Zap } from 'lucide-react';

interface Reaction {
  id: string;
  emoji: string;
  icon: any;
  label: string;
  color: string;
}

interface ReactionSystemProps {
  onReaction: (emoji: string) => void;
  disabled?: boolean;
  className?: string;
}

const REACTIONS: Reaction[] = [
  { id: 'love', emoji: '❤️', icon: Heart, label: 'J\'adore', color: 'text-red-400' },
  { id: 'good', emoji: '👍', icon: ThumbsUp, label: 'Bien joué', color: 'text-green-400' },
  { id: 'funny', emoji: '😂', icon: Laugh, label: 'Hilarant', color: 'text-yellow-400' },
  { id: 'wow', emoji: '😮', icon: Zap, label: 'Surprenant', color: 'text-purple-400' }
];

export const ReactionSystem = ({ onReaction, disabled = false, className = '' }: ReactionSystemProps) => {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const handleReaction = (reaction: Reaction) => {
    if (disabled) return;
    
    setSelectedReaction(reaction.id);
    onReaction(reaction.emoji);
    
    // Reset after animation
    setTimeout(() => setSelectedReaction(null), 1000);
  };

  return (
    <motion.div
      className={`flex justify-center space-x-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {REACTIONS.map((reaction) => {
        const IconComponent = reaction.icon;
        const isSelected = selectedReaction === reaction.id;

        return (
          <motion.div key={reaction.id} className="relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handleReaction(reaction)}
                disabled={disabled}
                variant="outline"
                size="sm"
                className={`border-white/30 text-white hover:bg-white/10 transition-all ${
                  isSelected ? 'bg-white/20 scale-110' : ''
                }`}
              >
                <span className="text-lg mr-2">{reaction.emoji}</span>
                <IconComponent className={`h-4 w-4 ${reaction.color}`} />
              </Button>
            </motion.div>
            
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: 1, y: -10, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {reaction.label}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
