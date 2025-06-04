
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GAME_MODES, AMBIANCES, MINI_JEUX } from '@/constants/gamePhases';
import { GameMode, Ambiance, MiniJeu } from '@/types';
import { toast } from 'react-hot-toast';

const CreateGame = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    twoPlayersMode: false,
    gameMode: 'classique' as GameMode,
    ambiance: 'safe' as Ambiance,
    selectedMiniGames: ['kikadi'] as MiniJeu[],
    rounds: [5]
  });

  const toggleMiniGame = (game: MiniJeu) => {
    setSettings(prev => ({
      ...prev,
      selectedMiniGames: prev.selectedMiniGames.includes(game)
        ? prev.selectedMiniGames.filter(g => g !== game)
        : [...prev.selectedMiniGames, game].slice(0, 4) // Max 4 mini-games
    }));
  };

  const estimatedDuration = settings.rounds[0] * settings.selectedMiniGames.length * 2; // ~2 min per round

  const handleCreateGame = () => {
    if (settings.selectedMiniGames.length === 0) {
      toast.error('Sélectionnez au moins un mini-jeu !');
      return;
    }

    // Mock game creation
    const gameId = Math.random().toString(36).substr(2, 6).toUpperCase();
    toast.success('Partie créée !');
    navigate(`/lobby/${gameId}`);
  };

  return (
    <AnimatedBackground variant="green">
      <div className="min-h-screen px-6 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-3xl font-bold text-white">
            Créer une partie
          </h1>
        </motion.div>

        <div className="max-w-lg mx-auto space-y-6">
          {/* Two players mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">
                      Mode 2 joueurs uniquement
                    </Label>
                    <p className="text-white/70 text-sm mt-1">
                      Active pour débloquer Duel et Couple
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoPlayersMode}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, twoPlayersMode: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Game mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Mode de jeu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(GAME_MODES).map(([key, mode]) => (
                  <motion.div
                    key={key}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      settings.gameMode === key
                        ? 'border-white bg-white/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setSettings(prev => ({ ...prev, gameMode: key as GameMode }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{mode.emoji}</span>
                      <div>
                        <h3 className="text-white font-medium">{mode.nom}</h3>
                        <p className="text-white/70 text-sm">{mode.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Ambiance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Ambiance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(AMBIANCES).map(([key, ambiance]) => (
                  <motion.div
                    key={key}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      settings.ambiance === key
                        ? 'border-white bg-white/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setSettings(prev => ({ ...prev, ambiance: key as Ambiance }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{ambiance.emoji}</span>
                      <div>
                        <h3 className="text-white font-medium">{ambiance.nom}</h3>
                        <p className="text-white/70 text-sm">{ambiance.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Mini-games selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">
                  Mini-jeux ({settings.selectedMiniGames.length}/4)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(MINI_JEUX).map(([key, game]) => (
                    <motion.div
                      key={key}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        settings.selectedMiniGames.includes(key as MiniJeu)
                          ? 'border-white bg-white/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => toggleMiniGame(key as MiniJeu)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">{game.emoji}</div>
                      <h3 className="text-white font-medium text-sm">{game.nom}</h3>
                      <p className="text-white/70 text-xs mt-1">{game.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Number of rounds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white font-medium">Nombre de manches</Label>
                    <span className="text-white text-xl font-bold">
                      {settings.rounds[0]}
                    </span>
                  </div>
                  <Slider
                    value={settings.rounds}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, rounds: value }))}
                    max={10}
                    min={3}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex items-center text-white/70 text-sm">
                    <Clock size={16} className="mr-2" />
                    Durée estimée : ~{estimatedDuration} minutes
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Create button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              onClick={handleCreateGame}
              className="w-full bg-white text-green-600 hover:bg-white/90 font-bold text-lg py-6"
              size="lg"
            >
              <span className="mr-2">🚀</span>
              Lancer la partie
            </Button>
          </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default CreateGame;
