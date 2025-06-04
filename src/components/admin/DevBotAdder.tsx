
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { UserPlus, Bot, Trash2, Play, Square } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BotPlayer {
  id: string;
  pseudo: string;
  status: 'waiting' | 'active' | 'answering' | 'voting';
  avatar: string;
}

interface DevBotAdderProps {
  onAddBot?: () => void;
  onRemoveBot?: (botId: string) => void;
  onStartGame?: () => void;
  onStopGame?: () => void;
  bots?: BotPlayer[];
  gameRunning?: boolean;
  className?: string;
}

const BOT_AVATARS = ['🤖', '👾', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸'];
const BOT_NAMES = ['BOT_Alpha', 'BOT_Beta', 'BOT_Gamma', 'BOT_Delta', 'BOT_Echo', 'BOT_Foxtrot'];

export const DevBotAdder = ({ 
  onAddBot, 
  onRemoveBot, 
  onStartGame, 
  onStopGame,
  bots = [],
  gameRunning = false,
  className = '' 
}: DevBotAdderProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddBot = async () => {
    setIsAdding(true);
    try {
      // Simulate bot creation
      await new Promise(resolve => setTimeout(resolve, 500));
      onAddBot?.();
      toast.success('Bot ajouté !');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du bot');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveBot = (botId: string) => {
    onRemoveBot?.(botId);
    toast.success('Bot supprimé');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-200';
      case 'answering':
        return 'bg-blue-500/20 text-blue-200';
      case 'voting':
        return 'bg-yellow-500/20 text-yellow-200';
      default:
        return 'bg-gray-500/20 text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'answering':
        return 'Répond...';
      case 'voting':
        return 'Vote...';
      default:
        return 'En attente';
    }
  };

  return (
    <Card className={`bg-white/10 border-white/20 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          Gestion des Bots de Test
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleAddBot}
            disabled={isAdding || bots.length >= 7 || gameRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {isAdding ? 'Ajout...' : 'Ajouter Bot'}
          </Button>

          {bots.length >= 3 && (
            <Button
              onClick={gameRunning ? onStopGame : onStartGame}
              className={gameRunning 
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
              }
            >
              {gameRunning ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Arrêter Test
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Démarrer Test
                </>
              )}
            </Button>
          )}
        </div>

        {/* Bot list */}
        {bots.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm">
              Bots actifs ({bots.length}/7)
            </h4>
            
            <div className="space-y-2">
              {bots.map((bot, index) => (
                <motion.div
                  key={bot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span>{bot.avatar}</span>
                    </div>
                    
                    <div>
                      <div className="text-white font-medium text-sm">
                        {bot.pseudo}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(bot.status)}`}
                      >
                        {getStatusLabel(bot.status)}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleRemoveBot(bot.id)}
                    disabled={gameRunning}
                    size="sm"
                    variant="outline"
                    className="border-red-400/30 text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Info panel */}
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">ℹ️</div>
            <div className="text-blue-200 text-sm space-y-1">
              <p className="font-medium">Comment utiliser :</p>
              <ul className="space-y-1 text-xs">
                <li>• Ajoutez au moins 3 bots pour commencer</li>
                <li>• Les bots répondent automatiquement</li>
                <li>• Utilisez "Démarrer Test" pour une partie complète</li>
                <li>• Les bots votent de manière aléatoire mais cohérente</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Game status */}
        {gameRunning && (
          <motion.div
            className="bg-green-500/10 border border-green-400/30 rounded-lg p-4"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-200 font-medium">
                Partie de test en cours...
              </span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
