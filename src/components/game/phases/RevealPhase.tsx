
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ReactionSystem } from '@/components/game/ReactionSystem';
import { PlayerState } from '@/types';

interface RevealPhaseProps {
  players: PlayerState[];
  correctAnswers?: Record<string, string>;
  onReaction: (emoji: string) => void;
}

/**
 * Composant de révélation des réponses
 * Affiche les résultats avec animations et réactions possibles
 */
export const RevealPhase: React.FC<RevealPhaseProps> = ({
  players,
  correctAnswers = {},
  onReaction
}) => {
  return (
    <div className="space-y-6 max-w-lg mx-auto" data-testid="reveal-phase">
      {/* Titre */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-white text-3xl font-bold mb-2">
          🎭 Révélations !
        </h3>
        <p className="text-white/80">
          Découvrez qui a dit quoi...
        </p>
      </motion.div>

      {/* Résultats */}
      <div className="space-y-3">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {player.pseudo || 'Joueur'}
                    </p>
                    <p className="text-white/70 text-sm">
                      {correctAnswers[player.id] || 'Réponse cachée'}
                    </p>
                  </div>
                  <div className="text-2xl">
                    {player.reaction || '🤔'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Système de réactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <ReactionSystem onReaction={onReaction} />
      </motion.div>
    </div>
  );
};
