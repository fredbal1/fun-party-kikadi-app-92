
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { PhaseTimer } from '@/components/ui/PhaseTimer';
import { PlayerCard } from '@/components/game/PlayerCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { GamePhase } from '@/types';
import { PHASE_TIMERS } from '@/constants/gamePhases';
import { toast } from 'react-hot-toast';

const Game = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { currentPhase, setCurrentPhase, nextPhase, players } = useGameState();
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Mock question data
  const currentQuestion = "Quelle est votre citation inspirante préférée ?";
  const currentRound = 1;
  const totalRounds = 5;

  const handlePhaseComplete = () => {
    switch (currentPhase) {
      case 'intro':
        setCurrentPhase('answering');
        break;
      case 'answering':
        if (!hasAnswered) {
          toast.error('Vous devez répondre avant de continuer !');
          return;
        }
        setCurrentPhase('voting');
        break;
      case 'voting':
        if (!selectedPlayer) {
          toast.error('Vous devez faire un choix !');
          return;
        }
        setCurrentPhase('revealing');
        break;
      case 'revealing':
        setCurrentPhase('results');
        break;
      case 'results':
        if (currentRound < totalRounds) {
          setCurrentPhase('transition');
        } else {
          navigate(`/results/${gameId}`);
        }
        break;
      case 'transition':
        setCurrentPhase('intro');
        break;
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      toast.error('Veuillez écrire une réponse !');
      return;
    }
    setHasAnswered(true);
    toast.success('Réponse envoyée !');
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 'intro':
        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-3xl font-bold text-white">KiKaDi</h2>
            <p className="text-white/80 text-lg">
              Devinez qui a écrit quoi !
            </p>
            <div className="text-white/60">
              Manche {currentRound} / {totalRounds}
            </div>
          </motion.div>
        );

      case 'answering':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <span className="mr-2">📝</span>
                  Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white text-lg font-medium mb-6">
                  {currentQuestion}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium block mb-2">
                      Votre réponse
                    </label>
                    <Input
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Écrivez votre réponse..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      disabled={hasAnswered}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSubmitAnswer}
                    className="w-full bg-white text-purple-600 hover:bg-white/90 font-medium"
                    disabled={hasAnswered}
                  >
                    {hasAnswered ? (
                      <>
                        <span className="mr-2">✅</span>
                        Réponse envoyée
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📤</span>
                        Valider ma réponse
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'voting':
        const mockAnswers = [
          { id: '1', content: 'La vie est belle quand on la vit pleinement', playerId: 'player1' },
          { id: '2', content: 'Chaque jour est une nouvelle chance', playerId: 'player2' },
          { id: '3', content: 'Crois en tes rêves et ils se réaliseront', playerId: 'player3' }
        ];

        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h3 className="text-white text-xl font-bold mb-2">
                Qui a écrit quoi ?
              </h3>
              <p className="text-white/80">
                Associez chaque réponse à un joueur
              </p>
            </div>

            <div className="space-y-3">
              {mockAnswers.map((answer, index) => (
                <motion.div
                  key={answer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      selectedPlayer === answer.id
                        ? 'bg-white/20 border-white'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                    onClick={() => setSelectedPlayer(answer.id)}
                  >
                    <CardContent className="p-4">
                      <p className="text-white font-medium">
                        "{answer.content}"
                      </p>
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
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-white">Révélation !</h2>
            <p className="text-white/80">
              Découvrez les vraies réponses...
            </p>
            
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Card className="bg-green-500/20 border-green-400/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Marie a écrit:</span>
                    <span className="text-green-200">+10 points</span>
                  </div>
                  <p className="text-white font-medium mt-2">
                    "La vie est belle quand on la vit pleinement"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        );

      case 'results':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h3 className="text-white text-xl font-bold mb-2">
                Résultats de la manche
              </h3>
              <div className="text-white/80">
                Manche {currentRound} / {totalRounds}
              </div>
            </div>

            <div className="space-y-3">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <PlayerCard player={player} showScore />
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatedBackground variant="purple">
      <div className="min-h-screen px-6 py-8">
        {/* Game header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white">
            <div className="text-sm opacity-80">Partie {gameId}</div>
            <div className="font-semibold">Manche {currentRound}</div>
          </div>
          
          {currentPhase !== 'intro' && currentPhase !== 'transition' && (
            <PhaseTimer
              duration={PHASE_TIMERS[currentPhase] || 30}
              onComplete={handlePhaseComplete}
            />
          )}
        </motion.div>

        {/* Main content */}
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {renderPhaseContent()}
            </motion.div>
          </AnimatePresence>

          {/* Next phase button */}
          {(currentPhase === 'intro' || currentPhase === 'revealing' || currentPhase === 'results') && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <Button
                onClick={handlePhaseComplete}
                className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
                size="lg"
              >
                {currentPhase === 'results' 
                  ? currentRound < totalRounds ? 'Manche suivante' : 'Voir les résultats finaux'
                  : 'Continuer'
                }
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Game;
