
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/context/GameContext';
import { useDevMode } from '@/hooks/useDevMode';
import { useGamePhases } from '@/hooks/useGamePhases';
import { KIKADI_STRUCTURE } from '@/utils/structureReference';

interface DevConsoleProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Console de développement pour KIKADI
 * Permet de tester et débugger l'application
 */
export const DevConsole: React.FC<DevConsoleProps> = ({ isOpen, onToggle }) => {
  const { game, players, currentRound } = useGameContext();
  const { 
    isDevMode, 
    createDevGame, 
    addRandomBot, 
    simulateBotAnswers, 
    simulateBotVotes,
    botsCount 
  } = useDevMode();
  const { currentPhase, advancePhase, getPhaseProgress } = useGamePhases();

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleCreateDevGame = () => {
    createDevGame();
    addLog('Partie de dev créée');
  };

  const handleAddBot = () => {
    const bot = addRandomBot();
    if (bot) {
      addLog(`Bot ajouté: ${bot.pseudo}`);
    }
  };

  const handleSimulateAnswers = () => {
    simulateBotAnswers();
    addLog('Réponses des bots simulées');
  };

  const handleAdvancePhase = () => {
    const success = advancePhase();
    if (success) {
      addLog(`Phase avancée vers: ${currentPhase}`);
    } else {
      addLog('Impossible d\'avancer la phase');
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white z-50"
        size="sm"
      >
        🛠️ Dev
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed top-0 right-0 h-full w-80 bg-black/90 backdrop-blur-sm border-l border-white/20 z-50 overflow-y-auto"
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold">Dev Console</h3>
          <Button onClick={onToggle} size="sm" variant="ghost" className="text-white">
            ✕
          </Button>
        </div>

        {/* État du jeu */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">État du jeu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="text-white/80">
              Partie: {game?.id || 'Aucune'}
            </div>
            <div className="text-white/80">
              Phase: {currentPhase}
            </div>
            <div className="text-white/80">
              Mini-jeu: {game?.currentMiniJeu || 'N/A'}
            </div>
            <div className="text-white/80">
              Joueurs: {players.length}
            </div>
            <div className="text-white/80">
              Bots: {botsCount}
            </div>
            {isDevMode && (
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 text-xs">
                MODE DEV ACTIF
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={handleCreateDevGame}
              size="sm"
              className="w-full bg-blue-500 hover:bg-blue-600 text-xs"
            >
              Créer partie dev
            </Button>
            
            <Button
              onClick={handleAddBot}
              size="sm"
              disabled={!isDevMode}
              className="w-full bg-green-500 hover:bg-green-600 text-xs"
            >
              Ajouter un bot
            </Button>
            
            <Button
              onClick={handleSimulateAnswers}
              size="sm"
              disabled={!isDevMode || botsCount === 0}
              className="w-full bg-purple-500 hover:bg-purple-600 text-xs"
            >
              Simuler réponses
            </Button>
            
            <Button
              onClick={handleAdvancePhase}
              size="sm"
              disabled={!game}
              className="w-full bg-orange-500 hover:bg-orange-600 text-xs"
            >
              Phase suivante
            </Button>
          </CardContent>
        </Card>

        {/* Progression */}
        {game && (
          <Card className="bg-white/10 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getPhaseProgress()}%` }}
                />
              </div>
              <div className="text-white/70 text-xs mt-1">
                {Math.round(getPhaseProgress())}% complété
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logs */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-white/70 text-xs font-mono">
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-white/50 text-xs">Aucun log</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Structure de référence */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white/70 text-xs space-y-1">
              <div>Pages: {Object.keys(KIKADI_STRUCTURE.pages).length}</div>
              <div>Mini-jeux: {Object.keys(KIKADI_STRUCTURE.miniJeux).length}</div>
              <div>Hooks: {Object.keys(KIKADI_STRUCTURE.hooks).length}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
