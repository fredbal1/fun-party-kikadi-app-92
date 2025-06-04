
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { VisualEffects } from '@/components/effects/VisualEffects';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Trophy, Medal, Star, Home, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Player } from '@/types';
import { toast } from 'react-hot-toast';

interface PlayerResult extends Player {
  finalScore: number;
  rank: number;
  achievements: string[];
}

const Results = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);

  // Mock results data
  const [results] = useState<PlayerResult[]>([
    {
      id: '1',
      user_id: 'user1',
      game_id: gameId!,
      is_ready: true,
      is_host: true,
      score: 0,
      current_phase_state: 'result',
      finalScore: 1250,
      rank: 1,
      achievements: ['Roi du Bluff', 'Détective'],
      user: { 
        id: 'user1', 
        pseudo: 'Alex', 
        email: '', 
        role: 'joueur', 
        xp: 0, 
        pieces: 0, 
        niveau: 5, 
        avatar: '🎮',
        titre: 'Maître du Jeu'
      }
    },
    {
      id: '2',
      user_id: 'user2',
      game_id: gameId!,
      is_ready: true,
      is_host: false,
      score: 0,
      current_phase_state: 'result',
      finalScore: 980,
      rank: 2,
      achievements: ['Bon Observateur'],
      user: { 
        id: 'user2', 
        pseudo: 'Marie', 
        email: '', 
        role: 'joueur', 
        xp: 0, 
        pieces: 0, 
        niveau: 3, 
        avatar: '☀️'
      }
    },
    {
      id: '3',
      user_id: 'user3',
      game_id: gameId!,
      is_ready: true,
      is_host: false,
      score: 0,
      current_phase_state: 'result',
      finalScore: 750,
      rank: 3,
      achievements: ['Participation'],
      user: { 
        id: 'user3', 
        pseudo: 'Julien', 
        email: '', 
        role: 'joueur', 
        xp: 0, 
        pieces: 0, 
        niveau: 7, 
        avatar: '🎯'
      }
    }
  ]);

  useEffect(() => {
    // Afficher les confettis pour le gagnant
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    // Animation séquentielle des résultats
    const winnerTimer = setInterval(() => {
      setCurrentWinnerIndex(prev => (prev + 1) % results.length);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(winnerTimer);
    };
  }, [results.length]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2: return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-orange-400" />;
      default: return <Star className="h-6 w-6 text-blue-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-400 to-gray-600';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const playAgain = () => {
    navigate('/create');
    toast.success('Prêt pour une nouvelle partie !');
  };

  const backToHome = () => {
    navigate('/dashboard');
  };

  return (
    <AnimatedBackground variant="rainbow">
      <div className="min-h-screen px-6 py-8 relative">
        {/* Visual Effects */}
        <VisualEffects 
          type="confetti" 
          isActive={showConfetti}
          intensity="strong"
        />

        {/* Winner Spotlight */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-96 h-96 bg-gradient-to-r from-yellow-400 to-purple-600 rounded-full blur-3xl" />
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🎉 Résultats Finaux 🎉
          </h1>
          <p className="text-white/80 text-lg">
            Partie #{gameId}
          </p>
        </motion.div>

        {/* Winners Podium */}
        <div className="max-w-4xl mx-auto mb-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {results.slice(0, 3).map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8 + (index * 0.2),
                  type: "spring",
                  bounce: 0.4
                }}
                whileHover={{ scale: 1.05 }}
                className={`${index === 1 ? 'order-first md:order-none' : ''}`}
              >
                <Card className={`bg-gradient-to-br ${getRankColor(player.rank)} backdrop-blur-sm border-white/20 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <CardContent className="p-6 text-center relative z-10">
                    <div className="relative mb-4">
                      <Avatar className="h-20 w-20 mx-auto border-4 border-white/50">
                        <AvatarFallback className="text-2xl bg-white/20">
                          {player.user?.avatar || '👤'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">
                        {getRankIcon(player.rank)}
                      </div>
                    </div>
                    
                    <h3 className="text-white font-bold text-xl mb-2">
                      {player.user?.pseudo}
                    </h3>
                    
                    {player.user?.titre && (
                      <Badge className="bg-white/20 text-white mb-3">
                        {player.user.titre}
                      </Badge>
                    )}
                    
                    <div className="text-3xl font-black text-white mb-4">
                      {player.finalScore} pts
                    </div>
                    
                    <div className="space-y-1">
                      {player.achievements.map((achievement, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.5 + (idx * 0.2) }}
                        >
                          <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                            🏆 {achievement}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Remaining players */}
          {results.length > 3 && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <h3 className="text-white text-xl font-semibold text-center mb-4">
                Autres participants
              </h3>
              {results.slice(3).map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2 + (index * 0.1) }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                            <span className="text-white font-bold">#{player.rank}</span>
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-white/20">
                              {player.user?.avatar || '👤'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{player.user?.pseudo}</p>
                            {player.achievements.length > 0 && (
                              <p className="text-white/60 text-sm">{player.achievements[0]}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-white font-bold text-lg">
                          {player.finalScore} pts
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="max-w-md mx-auto space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5 }}
        >
          <Button
            onClick={playAgain}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 text-lg"
            size="lg"
          >
            <RotateCcw className="mr-2" size={20} />
            Rejouer
          </Button>
          
          <Button
            onClick={backToHome}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 py-4"
            size="lg"
          >
            <Home className="mr-2" size={20} />
            Retour au menu
          </Button>
        </motion.div>

        {/* Fun Stats */}
        <motion.div
          className="max-w-2xl mx-auto mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <h4 className="text-white text-lg font-semibold mb-4">
                🎯 Statistiques de la partie
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-white/60 text-sm">Durée</p>
                  <p className="text-white font-bold">12 min</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Questions</p>
                  <p className="text-white font-bold">8</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Fous rires</p>
                  <p className="text-white font-bold">∞</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
};

export default Results;
