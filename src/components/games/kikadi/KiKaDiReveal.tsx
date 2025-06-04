
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Round } from '@/types/game';

interface KiKaDiRevealProps {
  gameId: string;
  roundData: Round;
  onPhaseComplete: () => void;
}

/**
 * Phase de révélation KiKaDi - Découverte des vraies réponses
 */
export const KiKaDiReveal: React.FC<KiKaDiRevealProps> = ({
  onPhaseComplete
}) => {
  // Mock révélations
  const revelations = [
    { answer: "Voyager dans l'espace", author: "Marie", correct: true },
    { answer: "Rencontrer mon idole", author: "Alex", correct: false },
    { answer: "Pouvoir voler", author: "Sam", correct: true },
  ];

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 1.5 }}
          >
            🎭
          </motion.div>
          <h2 className="text-2xl font-bold text-white">
            Les révélations !
          </h2>
        </div>

        <div className="space-y-4">
          {revelations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
            >
              <Card className={`${
                item.correct 
                  ? 'bg-green-500/20 border-green-400/50' 
                  : 'bg-red-500/20 border-red-400/50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        "{item.answer}"
                      </p>
                      <p className="text-white/80 text-sm">
                        Par {item.author}
                      </p>
                    </div>
                    <div className="text-2xl">
                      {item.correct ? '✅' : '❌'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={onPhaseComplete}
          className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
          size="lg"
        >
          Voir les scores
        </Button>
      </div>
    </div>
  );
};
