
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlayerState } from '@/types';

interface ScorePhaseProps {
  players: PlayerState[];
  roundNumber: number;
  totalRounds: number;
  isLastRound: boolean;
  onAdvance: () => void;
}

/**
 * Composant d'affichage des scores de la manche
 * Montre le classement et bouton pour continuer
 */
export const ScorePhase: React.FC<ScorePhaseProps> = ({
  players,
  roundNumber,
  totalRounds,
  isLastRound,
  onAdvance
}) => {
  // Trier les joueurs par score décroissant
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 max-w-lg mx-auto" data-testid="score-phase">
      {/* Titre */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-white text-3xl font-bold mb-2">
          🏆 Scores
        </h3>
        <p className="text-white/80">
          Manche {roundNumber} / {totalRounds}
        </p>
      </motion.div>

      {/* Classement */}
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${
              index === 0 
                ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/30' 
                : 'bg-white/10 border-white/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {player.pseudo || 'Joueur'}
                      </p>
                      <p className="text-white/70 text-sm">
                        #{index + 1}
                      </p>
                    </div>
                  </div>
                  <div className="text-white font-bold text-xl">
                    {player.score} pts
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bouton de continuation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={onAdvance}
          className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
          size="lg"
        >
          {isLastRound ? 'Voir les résultats finaux 🎉' : 'Manche suivante ➡️'}
        </Button>
      </motion.div>
    </div>
  );
};
