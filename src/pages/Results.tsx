
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { PlayerCard } from '@/components/game/PlayerCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameState } from '@/hooks/useGameState';
import { Trophy, Medal, Award, Home, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Results = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { players, currentGame, resetGame } = useGameState();
  const [showConfetti, setShowConfetti] = useState(false);

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const winner = sortedPlayers[0];

  useEffect(() => {
    // Show confetti for winner
    if (winner) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [winner]);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/create');
    toast.success('Nouvelle partie !');
  };

  const handleBackToDashboard = () => {
    resetGame();
    navigate('/dashboard');
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-400" />;
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">{index + 1}</div>;
    }
  };

  return (
    <AnimatedBackground variant="purple">
      <div className="min-h-screen px-6 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={showConfetti ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: showConfetti ? 3 : 0 }}
          >
            🏆
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2">
            Résultats finaux !
          </h1>
          <p className="text-white/80 text-lg">
            {currentGame?.mode ? `Mode ${currentGame.mode}` : 'Partie terminée'}
          </p>
        </motion.div>

        {/* Winner highlight */}
        {winner && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/50">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="h-12 w-12 text-yellow-400 mr-3" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      🎉 {winner.user?.pseudo || 'Joueur'} remporte la partie !
                    </h2>
                    <p className="text-yellow-200 text-lg">
                      {winner.score} points
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Ranking */}
        <motion.div
          className="space-y-4 max-w-lg mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-white text-xl font-bold text-center mb-6">
            Classement final
          </h3>
          
          <AnimatePresence>
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
              >
                <Card className={`${
                  index === 0 
                    ? 'bg-yellow-400/20 border-yellow-400/50' 
                    : 'bg-white/10 border-white/20'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getRankIcon(index)}
                        <div>
                          <p className="text-white font-semibold">
                            {player.user?.pseudo || `Joueur ${index + 1}`}
                          </p>
                          <p className="text-white/70 text-sm">
                            Rang #{index + 1}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">
                          {player.score || 0}
                        </p>
                        <p className="text-white/70 text-sm">points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="space-y-4 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Button
            onClick={handlePlayAgain}
            className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
            size="lg"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Rejouer
          </Button>
          
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Retour au menu
          </Button>
        </motion.div>

        {/* Fun stats */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <p className="text-white/60 text-sm">
            Merci d'avoir joué à KIKADI ! 🎮
          </p>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
};

export default Results;
