
import { motion } from 'framer-motion';
import { PhaseHeader } from '@/components/game/PhaseHeader';
import { VoteBox } from '@/components/game/VoteBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { GamePhase, Player } from '@/types';

interface KiDiVraiGameProps {
  phase: GamePhase;
  statement: string;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  onVote: (choice: 'vrai' | 'faux') => void;
  onNext: () => void;
  hasVoted?: boolean;
  selectedChoice?: 'vrai' | 'faux';
}

export const KiDiVraiGame = ({
  phase,
  statement,
  players,
  currentRound,
  totalRounds,
  onVote,
  onNext,
  hasVoted = false,
  selectedChoice
}: KiDiVraiGameProps) => {
  const [currentVote, setCurrentVote] = useState<'vrai' | 'faux' | null>(null);

  const handleVote = (choice: 'vrai' | 'faux') => {
    setCurrentVote(choice);
    onVote(choice);
  };

  const renderPhaseContent = () => {
    switch (phase) {
      case 'intro':
        return (
          <PhaseHeader
            miniJeu="kidivrai"
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
              miniJeu="kidivrai"
              phase="vote"
              roundNumber={currentRound}
              totalRounds={totalRounds}
            />
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <span className="mr-2">🤔</span>
                  Affirmation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white text-xl font-medium mb-8 text-center">
                  "{statement}"
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleVote('vrai')}
                    className={`py-6 text-lg font-bold transition-all ${
                      currentVote === 'vrai' || selectedChoice === 'vrai'
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    }`}
                    disabled={hasVoted}
                  >
                    <span className="mr-2">✅</span>
                    VRAI
                  </Button>
                  
                  <Button
                    onClick={() => handleVote('faux')}
                    className={`py-6 text-lg font-bold transition-all ${
                      currentVote === 'faux' || selectedChoice === 'faux'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    }`}
                    disabled={hasVoted}
                  >
                    <span className="mr-2">❌</span>
                    FAUX
                  </Button>
                </div>
                
                {hasVoted && (
                  <motion.div
                    className="mt-4 text-center text-white/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Vote enregistré ! En attente des autres joueurs...
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'revealing':
        const correctAnswer = 'vrai'; // Mock data
        const playerVotes = [
          { playerName: 'Marie', vote: 'vrai', isCorrect: true },
          { playerName: 'Alex', vote: 'faux', isCorrect: false },
          { playerName: 'Sam', vote: 'vrai', isCorrect: true }
        ];

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
                🎭
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                La réponse était...
              </h2>
            </div>

            <Card className={`${
              correctAnswer === 'vrai' 
                ? 'bg-green-500/20 border-green-400/50' 
                : 'bg-red-500/20 border-red-400/50'
            }`}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-black text-white mb-2">
                  {correctAnswer === 'vrai' ? 'VRAI ✅' : 'FAUX ❌'}
                </div>
                <p className="text-white/90">
                  "{statement}"
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="text-white font-semibold text-center">Votes des joueurs :</h3>
              {playerVotes.map((vote, index) => (
                <motion.div
                  key={vote.playerName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className={`${
                    vote.isCorrect
                      ? 'bg-green-500/20 border-green-400/50'
                      : 'bg-red-500/20 border-red-400/50'
                  }`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">
                          {vote.playerName}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white">
                            {vote.vote === 'vrai' ? 'VRAI' : 'FAUX'}
                          </span>
                          <span className={vote.isCorrect ? 'text-green-200' : 'text-red-200'}>
                            {vote.isCorrect ? '+15 pts' : '0 pt'}
                          </span>
                        </div>
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
