
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bot, Play, Plus, RotateCcw, Settings } from 'lucide-react';
import { Player, GamePhase } from '@/types';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'react-hot-toast';

const AdminDevMode = () => {
  const navigate = useNavigate();
  const { currentPhase, setCurrentPhase, nextPhase, setPlayers, players } = useGameState();
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [testPlayers, setTestPlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  // Generate a bot player
  const generateBot = (): Player => {
    const botNames = ['BOT_Alpha', 'BOT_Beta', 'BOT_Gamma', 'BOT_Delta', 'BOT_Echo', 'BOT_Foxtrot'];
    const availableName = botNames.find(name => 
      !testPlayers.some(p => p.user?.pseudo === name)
    ) || `BOT_${Date.now().toString().slice(-4)}`;

    return {
      id: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: `bot_user_${Date.now()}`,
      game_id: 'test_game',
      is_ready: true,
      is_host: false,
      score: 0,
      current_phase_state: 'intro',
      user: {
        id: `bot_user_${Date.now()}`,
        pseudo: availableName,
        email: '',
        role: 'bot',
        xp: 0,
        pieces: 0,
        niveau: 1
      }
    };
  };

  const addBot = () => {
    if (testPlayers.length >= 8) {
      toast.error('Maximum 8 joueurs autorisés');
      return;
    }

    const newBot = generateBot();
    setTestPlayers([...testPlayers, newBot]);
    setLogs([...logs, `✅ Bot ${newBot.user?.pseudo} ajouté`]);
    toast.success(`Bot ${newBot.user?.pseudo} ajouté !`);
  };

  const removeBot = (botId: string) => {
    const bot = testPlayers.find(p => p.id === botId);
    setTestPlayers(testPlayers.filter(p => p.id !== botId));
    setLogs([...logs, `❌ Bot ${bot?.user?.pseudo} retiré`]);
    toast.success('Bot retiré !');
  };

  const startTestGame = () => {
    if (testPlayers.length < 2) {
      toast.error('Minimum 2 joueurs requis');
      return;
    }

    setPlayers(testPlayers);
    setIsGameRunning(true);
    setCurrentPhase('intro');
    setLogs([...logs, `🚀 Partie test démarrée avec ${testPlayers.length} bots`]);
    toast.success('Partie test démarrée !');
  };

  const stopTestGame = () => {
    setIsGameRunning(false);
    setCurrentPhase('intro');
    setPlayers([]);
    setLogs([...logs, '🛑 Partie test arrêtée']);
    toast.success('Partie test arrêtée !');
  };

  const simulateNextPhase = () => {
    if (!isGameRunning) {
      toast.error('Aucune partie en cours');
      return;
    }

    nextPhase();
    setLogs([...logs, `➡️ Passage à la phase: ${currentPhase}`]);
    
    // Simulate bot actions
    setTimeout(() => {
      const actions = [
        'Les bots ont répondu automatiquement',
        'Les bots ont voté',
        'Calcul des scores...',
        'Révélation des réponses'
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setLogs(prev => [...prev, `🤖 ${randomAction}`]);
    }, 1000);
  };

  const clearLogs = () => {
    setLogs([]);
    toast.success('Logs effacés');
  };

  const goToTestGame = () => {
    if (!isGameRunning) {
      toast.error('Démarrez d\'abord une partie test');
      return;
    }
    navigate('/game/test_game');
  };

  const phases: GamePhase[] = ['intro', 'answering', 'voting', 'revealing', 'results', 'transition'];

  return (
    <AnimatedBackground variant="green">
      <div className="min-h-screen px-6 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/admin')}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour Admin
          </Button>
          
          <div className="flex items-center space-x-2">
            <Badge className={isGameRunning ? 'bg-green-500' : 'bg-red-500'}>
              {isGameRunning ? 'Partie active' : 'Aucune partie'}
            </Badge>
            {isGameRunning && (
              <Badge className="bg-blue-500">
                Phase: {currentPhase}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-5xl mb-4">🧪</div>
          <h1 className="text-4xl font-black text-white mb-2">
            Mode Test & Développement
          </h1>
          <p className="text-white/80">
            Testez le jeu avec des bots automatiques
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Bot Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bot className="mr-2 h-5 w-5" />
                  Gestion des Bots ({testPlayers.length}/8)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-3">
                  <Button
                    onClick={addBot}
                    disabled={testPlayers.length >= 8}
                    className="bg-white text-green-600 hover:bg-white/90 flex-1"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter Bot
                  </Button>
                  <Button
                    onClick={() => setTestPlayers([])}
                    disabled={testPlayers.length === 0}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>

                {/* Bot list */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {testPlayers.map((bot) => (
                    <div
                      key={bot.id}
                      className="flex items-center justify-between bg-white/5 rounded p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <Bot className="h-4 w-4 text-green-400" />
                        <span className="text-white font-medium">
                          {bot.user?.pseudo}
                        </span>
                        <Badge className="bg-green-500 text-xs">
                          Score: {bot.score}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => removeBot(bot.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-300 hover:bg-red-500/20"
                      >
                        ❌
                      </Button>
                    </div>
                  ))}
                </div>

                {testPlayers.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun bot ajouté</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Game Control */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Contrôle de Partie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isGameRunning ? (
                  <Button
                    onClick={startTestGame}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    disabled={testPlayers.length < 2}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Démarrer Partie Test
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={goToTestGame}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Voir Interface de Jeu
                    </Button>
                    <Button
                      onClick={simulateNextPhase}
                      className="w-full bg-white text-green-600 hover:bg-white/90"
                    >
                      Phase Suivante
                    </Button>
                    <Button
                      onClick={stopTestGame}
                      variant="outline"
                      className="w-full border-red-400 text-red-300 hover:bg-red-500/20"
                    >
                      Arrêter Partie
                    </Button>
                  </div>
                )}

                {/* Phase indicator */}
                {isGameRunning && (
                  <div className="space-y-2">
                    <p className="text-white text-sm font-medium">Phases:</p>
                    <div className="flex flex-wrap gap-1">
                      {phases.map((phase) => (
                        <Badge
                          key={phase}
                          className={
                            phase === currentPhase
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-600 text-gray-200'
                          }
                        >
                          {phase}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Logs */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">Logs de Test</CardTitle>
                  <Button
                    onClick={clearLogs}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    Effacer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black/20 rounded p-3 h-48 overflow-y-auto font-mono text-sm">
                  {logs.length === 0 ? (
                    <div className="text-white/60 text-center py-8">
                      Aucun log pour le moment
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="text-green-300 mb-1">
                        [{new Date().toLocaleTimeString()}] {log}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default AdminDevMode;
