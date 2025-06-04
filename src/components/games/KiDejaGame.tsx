
import { motion } from 'framer-motion';
import { PhaseHeader } from '@/components/game/PhaseHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { GamePhase, Player } from '@/types';

interface Experience {
  id: string;
  description: string;
  playerName?: string;
  hasExperienced?: boolean;
}

interface KiDejaGameProps {
  phase: GamePhase;
  experiences: Experience[];
  players: Player[];
  currentRound: number;
  totalRounds: number;
  onVote: (experienceId: string) => void;
  onNext: () => void;
  selectedExperience?: string;
}

export const KiDejaGame = ({
  phase,
  experiences,
  players,
  currentRound,
  totalRounds,
  onVote,
  onNext,
  selectedExperience
}: KiDejaGameProps) => {
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);

  const handleVote = (experienceId: string) => {
    setCurrentSelection(experienceId);
    onVote(experienceId);
  };

  const mockExperiences = [
    { id: '1', description: 'Dormi à la belle étoile', playerName: 'Marie', hasExperienced: true },
    { id: '2', description: 'Mangé un insecte', playerName: 'Alex', hasExperienced: false },
    { id: '3', description: 'Fait du parapente', playerName: 'Sam', hasExperienced: true },
    { id: '4', description: 'Rencontré une célébrité', playerName: 'Julie', hasExperienced: false }
  ];

  const renderPhaseContent = () => {
    switch (phase) {
      case 'intro':
        return (
          <PhaseHeader
            miniJeu="kideja"
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
              miniJeu="kideja"
              phase="selection"
              roundNumber={currentRound}
              totalRounds={totalRounds}
            />
            
            <div className="text-center mb-6">
              <h3 className="text-white text-xl font-bold mb-2">
                🎯 Qui a déjà fait ça ?
              </h3>
              <p className="text-white/80">
                Trouvez la personne qui a déjà vécu cette expérience
              </p>
            </div>

            <div className="space-y-3">
              {mockExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      currentSelection === exp.id || selectedExperience === exp.id
                        ? 'bg-white/30 border-white ring-2 ring-white/50' 
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                    onClick={() => handleVote(exp.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">
                            "{exp.description}"
                          </p>
                        </div>
                        
                        <motion.div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            currentSelection === exp.id || selectedExperience === exp.id
                              ? 'bg-white border-white'
                              : 'border-white/50'
                          }`}
                          animate={
                            (currentSelection === exp.id || selectedExperience === exp.id) 
                              ? { scale: [1, 1.2, 1] } 
                              : {}
                          }
                        >
                          {(currentSelection === exp.id || selectedExperience === exp.id) && (
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
          </motion.div>
        );

      case 'revealing':
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
                🎯
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Les révélations !
              </h2>
            </div>

            <div className="space-y-4">
              {mockExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.3,
                    type: "spring"
                  }}
                >
                  <Card className={`${
                    exp.hasExperienced 
                      ? 'bg-green-500/20 border-green-400/50' 
                      : 'bg-red-500/20 border-red-400/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">
                            "{exp.description}"
                          </p>
                          <p className="text-white/80 text-sm">
                            {exp.playerName} {exp.hasExperienced ? 'l\'a déjà fait' : 'ne l\'a jamais fait'}
                          </p>
                        </div>
                        
                        <div className="text-3xl">
                          {exp.hasExperienced ? '✅' : '❌'}
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
