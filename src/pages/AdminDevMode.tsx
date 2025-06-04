
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { DevBotAdder } from '@/components/admin/DevBotAdder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Play, Square, RotateCcw, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface BotPlayer {
  id: string;
  pseudo: string;
  avatar: string;
  level: number;
}

interface GameLog {
  id: string;
  timestamp: string;
  phase: string;
  action: string;
  details: string;
}

const AdminDevMode = () => {
  const navigate = useNavigate();
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('intro');
  const [bots, setBots] = useState<BotPlayer[]>([]);
  const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
  const [gameProgress, setGameProgress] = useState(0);

  const phases = [
    { id: 'intro', name: 'Introduction', emoji: '👋' },
    { id: 'question', name: 'Question', emoji: '❓' },
    { id: 'answer', name: 'Réponses', emoji: '✍️' },
    { id: 'vote', name: 'Votes', emoji: '🗳️' },
    { id: 'reveal', name: 'Révélation', emoji: '🎭' },
    { id: 'result', name: 'Résultats', emoji: '🏆' }
  ];

  const addBot = () => {
    const botNames = ['Alice_Bot', 'Bob_Bot', 'Charlie_Bot', 'Dana_Bot', 'Eve_Bot', 'Frank_Bot', 'Grace_Bot'];
    const botAvatars = ['🤖', '👾', '🎯', '⚡', '🔥', '💫', '✨'];
    
    const availableNames = botNames.filter(name => !bots.some(bot => bot.pseudo === name));
    
    if (availableNames.length === 0) {
      toast.error('Nombre maximum de bots atteint');
      return;
    }

    const newBot: BotPlayer = {
      id: `bot-${Date.now()}`,
      pseudo: availableNames[0],
      avatar: botAvatars[Math.floor(Math.random() * botAvatars.length)],
      level: Math.floor(Math.random() * 10) + 1
    };

    setBots(prev => [...prev, newBot]);
    addLog('system', 'Bot ajouté', `${newBot.pseudo} rejoint la partie`);
    toast.success(`${newBot.pseudo} ajouté !`);
  };

  const removeBot = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    setBots(prev => prev.filter(b => b.id !== botId));
    if (bot) {
      addLog('system', 'Bot retiré', `${bot.pseudo} a quitté la partie`);
    }
  };

  const addLog = (phase: string, action: string, details: string) => {
    const log: GameLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      phase,
      action,
      details
    };
    setGameLogs(prev => [log, ...prev].slice(0, 50)); // Garder seulement les 50 derniers logs
  };

  const startTestGame = () => {
    if (bots.length < 2) {
      toast.error('Il faut au moins 2 bots pour tester');
      return;
    }

    setIsGameRunning(true);
    setCurrentPhase('intro');
    setGameProgress(0);
    setGameLogs([]);
    addLog('system', 'Partie démarrée', `Test avec ${bots.length} bots`);
    toast.success('Partie de test démarrée !');
  };

  const stopTestGame = () => {
    setIsGameRunning(false);
    setCurrentPhase('intro');
    setGameProgress(0);
    addLog('system', 'Partie arrêtée', 'Test terminé par l\'administrateur');
    toast('Partie de test arrêtée');
  };

  const nextPhase = () => {
    const currentIndex = phases.findIndex(p => p.id === currentPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextIndex];
    
    setCurrentPhase(nextPhase.id);
    setGameProgress(((nextIndex + 1) / phases.length) * 100);
    
    addLog(nextPhase.id, 'Phase changée', `Passage à la phase: ${nextPhase.name}`);
    
    // Simuler des actions des bots
    setTimeout(() => {
      bots.forEach((bot, index) => {
        setTimeout(() => {
          addLog(nextPhase.id, `Action Bot`, `${bot.pseudo} effectue une action`);
        }, index * 500);
      });
    }, 1000);
  };

  const resetGame = () => {
    setIsGameRunning(false);
    setCurrentPhase('intro');
    setGameProgress(0);
    setBots([]);
    setGameLogs([]);
    toast.success('Environnement de test réinitialisé');
  };

  return (
    <AnimatedBackground variant="red">
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
          
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Zap className="mr-2" size={24} />
            Mode Développeur
          </h1>
          
          <Badge className="bg-yellow-500 text-black">DEV</Badge>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Game Control */}
          <div className="space-y-6">
            {/* Game Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Statut de la partie
                    <Badge variant={isGameRunning ? "default" : "secondary"}>
                      {isGameRunning ? "En cours" : "Arrêtée"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isGameRunning && (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/80 text-sm">Phase actuelle</span>
                          <span className="text-white font-medium">
                            {phases.find(p => p.id === currentPhase)?.emoji} {phases.find(p => p.id === currentPhase)?.name}
                          </span>
                        </div>
                        <Progress value={gameProgress} className="h-2" />
                      </div>
                    </>
                  )}

                  <div className="flex gap-2">
                    {!isGameRunning ? (
                      <Button
                        onClick={startTestGame}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        disabled={bots.length < 2}
                      >
                        <Play size={16} className="mr-2" />
                        Démarrer le test
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={nextPhase}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Phase suivante
                        </Button>
                        <Button
                          onClick={stopTestGame}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Square size={16} />
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <RotateCcw size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bot Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="mr-2" size={20} />
                    Gestion des Bots ({bots.length}/7)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DevBotAdder onAddBot={addBot} disabled={bots.length >= 7} />
                  
                  <div className="space-y-2">
                    {bots.map((bot, index) => (
                      <motion.div
                        key={bot.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{bot.avatar}</span>
                          <div>
                            <p className="text-white font-medium">{bot.pseudo}</p>
                            <p className="text-white/60 text-xs">Niveau {bot.level}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          onClick={() => removeBot(bot.id)}
                        >
                          Retirer
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Game Logs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
              <CardHeader>
                <CardTitle className="text-white">Logs de la partie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {gameLogs.length === 0 ? (
                    <p className="text-white/60 text-center py-8">
                      Aucun log pour le moment...
                    </p>
                  ) : (
                    gameLogs.map((log, index) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white/5 rounded-lg p-3 text-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {log.phase}
                          </Badge>
                          <span className="text-white/60 text-xs">{log.timestamp}</span>
                        </div>
                        <p className="text-white font-medium">{log.action}</p>
                        <p className="text-white/80 text-xs">{log.details}</p>
                      </motion.div>
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
