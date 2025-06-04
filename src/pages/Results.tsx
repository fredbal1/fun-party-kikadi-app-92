
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { useVisualEffects } from '@/components/effects/VisualEffects';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Star, Home, RotateCcw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { toast } from 'react-hot-toast';

const Results = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUserXP, updateUserCoins } = useGameStore();
  
  const {
    showConfetti,
    triggerConfetti,
    ConfettiComponent,
    resetEffects
  } = useVisualEffects();

  const [hasTriggeredEffects, setHasTriggeredEffects] = useState(false);

  // Mock results data
  const gameResults = {
    players: [
      { id: '1', name: 'Marie', score: 125, rank: 1, avatar: '👩', xpGained: 50, coinsGained: 25 },
      { id: '2', name: 'Alex', score: 98, rank: 2, avatar: '👨', xpGained: 35, coinsGained: 15 },
      { id: '3', name: 'Sam', score: 87, rank: 3, avatar: '🧑', xpGained: 25, coinsGained: 10 },
      { id: '4', name: 'Julie', score: 76, rank: 4, avatar: '👩‍🦱', xpGained: 15, coinsGained: 5 }
    ],
    totalRounds: 5,
    duration: '12 minutes',
    bestRound: 3,
    funMoments: [
      'Marie a bluffé 4 fois de suite !',
      'Alex a deviné toutes les associations',
      'Sam a fait rire tout le monde'
    ]
  };

  useEffect(() => {
    if (!hasTriggeredEffects) {
      // Trigger confetti for the winner
      setTimeout(() => {
        triggerConfetti();
        setHasTriggeredEffects(true);
      }, 1000);

      // Award XP and coins to current user
      if (currentUser) {
        const userResult = gameResults.players.find(p => p.name === currentUser.pseudo);
        if (userResult) {
          updateUserXP(currentUser.xp + userResult.xpGained);
          updateUserCoins(currentUser.pieces + userResult.coinsGained);
          toast.success(`+${userResult.xpGained} XP, +${userResult.coinsGained} pièces !`);
        }
      }
    }
  }, [hasTriggeredEffects, triggerConfetti, currentUser, updateUserXP, updateUserCoins]);

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-orange-500';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const handleNewGame = () => {
    resetEffects();
    navigate('/create');
  };

  const handleBackToDashboard = () => {
    resetEffects();
    navigate('/dashboard');
  };

  return (
    <AnimatedBackground variant="purple">
      <ConfettiComponent />
      
      <div className="min-h-screen px-6 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🏆
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Résultats finaux !
          </h1>
          <p className="text-white/80">
            Partie terminée • {gameResults.duration} • {gameResults.totalRounds} manches
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Winner celebration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/50 ring-2 ring-yellow-400/30">
              <CardContent className="p-6 text-center">
                <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {gameResults.players[0].name} remporte la partie !
                </h2>
                <div className="flex items-center justify-center space-x-4">
                  <Badge className="bg-yellow-500 text-black font-bold">
                    {gameResults.players[0].score} points
                  </Badge>
                  <Badge className="bg-green-500 text-white">
                    +{gameResults.players[0].xpGained} XP
                  </Badge>
                  <Badge className="bg-blue-500 text-white">
                    +{gameResults.players[0].coinsGained} 🪙
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rankings */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-center mb-4">Classement final</h3>
            {gameResults.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card className={`${
                  player.rank === 1 
                    ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/50' 
                    : 'bg-white/10 border-white/20'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{getRankEmoji(player.rank)}</div>
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <h4 className="text-white font-semibold">{player.name}</h4>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-white/70">#{player.rank}</span>
                            <span className="text-green-200">+{player.xpGained} XP</span>
                            <span className="text-blue-200">+{player.coinsGained} 🪙</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-bold text-xl">
                          {player.score}
                        </div>
                        <div className="text-white/70 text-sm">points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Fun moments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Star className="h-8 w-8 text-yellow-400 mx-auto" />
                  <h3 className="text-white font-semibold">Moments mémorables</h3>
                  <div className="space-y-2">
                    {gameResults.funMoments.map((moment, index) => (
                      <p key={index} className="text-white/80 text-sm">
                        • {moment}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Button
              onClick={handleNewGame}
              className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
              size="lg"
            >
              <RotateCcw className="mr-2" size={20} />
              Nouvelle partie
            </Button>
            
            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
              size="lg"
            >
              <Home className="mr-2" size={20} />
              Retour au menu
            </Button>
          </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Results;
