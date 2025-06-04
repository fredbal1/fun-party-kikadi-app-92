
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { PlayerCard } from '@/components/game/PlayerCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Share, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Player } from '@/types';
import { toast } from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

const Lobby = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost] = useState(true); // Mock: current user is host

  // Mock players data
  useEffect(() => {
    const mockPlayers: Player[] = [
      {
        id: '1',
        user_id: 'user1',
        game_id: gameId!,
        is_ready: true,
        is_host: true,
        score: 0,
        current_phase_state: 'intro',
        user: { id: 'user1', pseudo: 'Alex', email: '', role: 'joueur', xp: 0, pieces: 0, niveau: 5, avatar: '🎮' }
      },
      {
        id: '2',
        user_id: 'user2',
        game_id: gameId!,
        is_ready: true,
        is_host: false,
        score: 0,
        current_phase_state: 'intro',
        user: { id: 'user2', pseudo: 'Marie', email: '', role: 'joueur', xp: 0, pieces: 0, niveau: 3, avatar: '☀️' }
      },
      {
        id: '3',
        user_id: 'user3',
        game_id: gameId!,
        is_ready: false,
        is_host: false,
        score: 0,
        current_phase_state: 'intro',
        user: { id: 'user3', pseudo: 'Julien', email: '', role: 'joueur', xp: 0, pieces: 0, niveau: 7, avatar: '🎯' }
      }
    ];
    
    setPlayers(mockPlayers);
  }, [gameId]);

  const handleStartGame = () => {
    if (players.length < 3) {
      toast.error('Il faut au moins 3 joueurs pour commencer !');
      return;
    }
    
    if (players.some(p => !p.is_ready)) {
      toast.error('Tous les joueurs doivent être prêts !');
      return;
    }

    navigate(`/game/${gameId}`);
  };

  const shareUrl = `${window.location.origin}/lobby/${gameId}`;

  const encouragementMessages = [
    "Préparez-vous à découvrir vos secrets ! 🤫",
    "Qui ment le mieux parmi vous ? 🤥",
    "Les révélations vont être épiques ! ⚡",
    "Que le meilleur bluffeur gagne ! 🎭"
  ];

  const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

  return (
    <AnimatedBackground variant="blue">
      <div className="min-h-screen px-6 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Button>
          
          <Badge className="bg-black/20 text-white border-0 px-3 py-1">
            {gameId}
          </Badge>
        </motion.div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Game code card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <h2 className="text-white text-lg font-semibold mb-2">
                  Code de la partie
                </h2>
                <div className="text-3xl font-black text-white mb-4 tracking-wider">
                  {gameId}
                </div>
                
                <div className="flex gap-3">
                  <CopyToClipboard 
                    text={gameId!}
                    onCopy={() => toast.success('Code copié !')}
                  >
                    <Button
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <Copy size={16} className="mr-2" />
                      Copier
                    </Button>
                  </CopyToClipboard>
                  
                  <CopyToClipboard 
                    text={shareUrl}
                    onCopy={() => toast.success('Lien copié !')}
                  >
                    <Button
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <Share size={16} className="mr-2" />
                      Partager
                    </Button>
                  </CopyToClipboard>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Players section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold flex items-center">
                <Users size={20} className="mr-2" />
                Joueurs ({players.length}/8)
              </h3>
              <Badge variant="secondary" className="bg-green-500/20 text-green-200">
                En ligne
              </Badge>
            </div>
            
            <div className="space-y-3">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <PlayerCard player={player} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Encouragement message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🏠</div>
                <p className="text-white/90 text-sm font-medium">
                  {randomMessage}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Start game button (host only) */}
          {isHost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                onClick={handleStartGame}
                className="w-full bg-white text-blue-600 hover:bg-white/90 font-bold text-lg py-6"
                size="lg"
                disabled={players.length < 3 || players.some(p => !p.is_ready)}
              >
                <span className="mr-2">🚀</span>
                Lancer la partie
              </Button>
              
              {players.length < 3 && (
                <p className="text-white/70 text-sm text-center mt-2">
                  Il faut au moins 3 joueurs pour commencer
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Lobby;
