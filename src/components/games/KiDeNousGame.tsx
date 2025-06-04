
import { motion } from 'framer-motion';
import { PhaseHeader } from '@/components/game/PhaseHeader';
import { VoteBox } from '@/components/game/VoteBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { GamePhase, Player } from '@/types';

interface KiDeNousGameProps {
  phase: GamePhase;
  category: string;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  onVote: (playerId: string) => void;
  onNext: () => void;
  selectedPlayer?: string;
}

export const KiDeNousGame = ({
  phase,
  category,
  players,
  currentRound,
  totalRounds,
  onVote,
  onNext,
  selectedPlayer
}: KiDeNousGameProps) => {
  const [currentVote, setCurrentVote] = useState<string | null>(null);

  const handleVote = (playerId: string) => {
    setCurrentVote(playerId);
    onVote(playerId);
  };

  const mockPlayers = [
    { id: '1', name: 'Marie', avatar: '👩', description: 'Toujours de bonne humeur' },
    { id: '2', name: 'Alex', avatar: '👨', description: 'Le plus organisé du groupe' },
    { id: '3', name: 'Sam', avatar: '🧑', description: 'Adore les défis' },
    { id: '4', name: 'Julie', avatar: '👩‍🦱', description: 'La plus créative' }
  ];

  const categories = [
    'Le plus susceptible de devenir célèbre',
    'Le plus probable pour voyager dans l\'espace',
    'Celui qui ferait le meilleur chef cuisinier',
    'Le plus enclin à adopter 10 chats',
    'Le plus apte à survivre sur une île déserte'
  ];

  const renderPhaseContent = () => {
    switch (phase) {
      case 'intro':
        return (
          <PhaseHeader
            miniJeu="kidenous"
            phase="introduction"
            roundNumber={currentRound}
            totalRounds={totalRounds}
          />
        );

      case 'voting':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PhaseHeader
              miniJeu="kidenous"
              phase="vote"
              roundNumber={currentRound}
              totalRounds={totalRounds}
            />
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <span className="mr-2">🎭</span>
                  Catégorie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white text-xl font-medium mb-6 text-center">
                  "{category || categories[0]}"
                </p>
                <p className="text-white/80 text-center mb-8">
                  Qui correspond le mieux à cette description ?
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {mockPlayers.map((player) => (
                    <Button
                      key={player.id}
                      onClick={() => handleVote(player.id)}
                      className={`p-4 h-auto transition-all ${
                        currentVote === player.id || selectedPlayer === player.id
                          ? 'bg-white/30 border-white text-white'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className="text-3xl">{player.avatar}</div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm opacity-80">{player.description}</div>
                        </div>
                        {(currentVote === player.id || selectedPlayer === player.id) && (
                          <motion.div
                            className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <div className="w-2 h-2 bg-purple-600 rounded-full" />
                          </motion.div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'revealing':
        const mockResults = [
          { playerName: 'Marie', votes: 3, percentage: 60 },
          { playerName: 'Alex', votes: 1, percentage: 20 },
          { playerName: 'Sam', votes: 1, percentage: 20 },
          { playerName: 'Julie', votes: 0, percentage: 0 }
        ].sort((a, b) => b.votes - a.votes);

        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  rotateY: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1.5 }}
              >
                🏆
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Les votes sont tombés !
              </h2>
              <p className="text-white/80">
                "{category || categories[0]}"
              </p>
            </div>

            <div className="space-y-3">
              {mockResults.map((result, index) => (
                <motion.div
                  key={result.playerName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className={`${
                    index === 0 
                      ? 'bg-yellow-500/20 border-yellow-400/50 ring-2 ring-yellow-400/30' 
                      : 'bg-white/10 border-white/20'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          <span className="text-white font-semibold">
                            {result.playerName}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">
                            {result.votes} vote{result.votes > 1 ? 's' : ''}
                          </div>
                          <div className="text-white/70 text-sm">
                            {result.percentage}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="mt-3 w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-yellow-400' : 'bg-white/50'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={onNext}
              className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
              size="lg"
            >
              Continuer
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderPhaseContent()}
    </div>
  );
};
