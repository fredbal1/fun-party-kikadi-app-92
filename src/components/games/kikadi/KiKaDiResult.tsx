
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Round } from '@/types/game';
import { usePlayers } from '@/hooks/usePlayers';

interface KiKaDiResultProps {
  gameId: string;
  roundData: Round;
  onPhaseComplete: () => void;
}

/**
 * Phase de résultats KiKaDi - Scores de la manche
 */
export const KiKaDiResult: React.FC<KiKaDiResultProps> = ({
  roundData,
  onPhaseComplete
}) => {
  const { getPlayersByScore } = usePlayers();
  const sortedPlayers = getPlayersByScore();

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-white">
            Résultats de la manche {roundData.roundNumber}
          </h2>
        </div>

        <div className="space-y-3">
          {sortedPlayers.slice(0, 3).map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className={`${
                index === 0 
                  ? 'bg-yellow-500/20 border-yellow-400/50' 
                  : 'bg-white/10 border-white/20'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {index === 0 && <span className="text-2xl">🥇</span>}
                      {index === 1 && <span className="text-2xl">🥈</span>}
                      {index === 2 && <span className="text-2xl">🥉</span>}
                      <div>
                        <div className="text-white font-semibold">
                          {player.pseudo}
                        </div>
                        <div className="text-white/70 text-sm">
                          {player.score} points
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl">
                      {player.avatar}
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
          Manche suivante
        </Button>
      </div>
    </div>
  );
};
