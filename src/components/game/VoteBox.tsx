
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

interface VoteOption {
  id: string;
  content: string;
  playerId?: string;
  playerName?: string;
}

interface VoteBoxProps {
  question: string;
  options: VoteOption[];
  onVote: (optionId: string) => void;
  selectedVote?: string;
  disabled?: boolean;
  multiSelect?: boolean;
  className?: string;
}

export const VoteBox = ({ 
  question, 
  options, 
  onVote, 
  selectedVote, 
  disabled = false,
  multiSelect = false,
  className = '' 
}: VoteBoxProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleVote = (optionId: string) => {
    if (disabled) return;

    if (multiSelect) {
      const newSelected = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
      setSelectedOptions(newSelected);
    } else {
      onVote(optionId);
    }
  };

  const isSelected = (optionId: string) => {
    return multiSelect 
      ? selectedOptions.includes(optionId)
      : selectedVote === optionId;
  };

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Question */}
      <div className="text-center">
        <h3 className="text-white text-xl font-bold mb-2">
          🤔 À votre avis...
        </h3>
        <p className="text-white/90 text-lg font-medium">
          {question}
        </p>
      </div>

      {/* Vote options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                isSelected(option.id)
                  ? 'bg-white/30 border-white ring-2 ring-white/50' 
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleVote(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium text-left">
                      "{option.content}"
                    </p>
                    {option.playerName && (
                      <p className="text-white/60 text-sm mt-1">
                        Proposé par {option.playerName}
                      </p>
                    )}
                  </div>
                  
                  <motion.div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected(option.id)
                        ? 'bg-white border-white'
                        : 'border-white/50'
                    }`}
                    animate={isSelected(option.id) ? { scale: [1, 1.2, 1] } : {}}
                  >
                    {isSelected(option.id) && (
                      <motion.div
                        className="w-2 h-2 bg-purple-600 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    )}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Confirm button for multi-select */}
      {multiSelect && selectedOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={() => onVote(selectedOptions.join(','))}
            className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
            size="lg"
          >
            Valider mes choix ({selectedOptions.length})
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
