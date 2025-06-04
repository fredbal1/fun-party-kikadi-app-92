
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap } from 'lucide-react';

interface DevBotTriggerProps {
  /** Fonction appelée quand le bot est déclenché */
  onTrigger?: () => void;
  /** Afficher le bouton en mode compact */
  compact?: boolean;
  /** Désactiver le bouton */
  disabled?: boolean;
}

/**
 * Composant de déclenchement de bot pour les tests en développement
 * 
 * Permet de simuler l'activité d'un bot dans la partie courante.
 * Visible uniquement en mode développement.
 * 
 * @param onTrigger - Callback appelé lors du clic (placeholder pour l'instant)
 * @param compact - Affichage compact ou non
 * @param disabled - État désactivé du bouton
 */
export const DevBotTrigger: React.FC<DevBotTriggerProps> = ({
  onTrigger,
  compact = false,
  disabled = false
}) => {
  const handleTrigger = () => {
    // TODO: Intégrer la logique de simulation de bot
    console.log('🤖 Trigger bot logic - placeholder for future implementation');
    
    if (onTrigger) {
      onTrigger();
    }
  };

  // Ne s'affiche qu'en développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (compact) {
    return (
      <Button
        onClick={handleTrigger}
        disabled={disabled}
        size="sm"
        variant="outline"
        className="bg-orange-500/10 border-orange-500/30 text-orange-200 hover:bg-orange-500/20"
      >
        <Bot size={16} />
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-orange-500/20 text-orange-200 border-orange-500/30">
          <Bot size={12} className="mr-1" />
          Mode Dev
        </Badge>
      </div>
      
      <Button
        onClick={handleTrigger}
        disabled={disabled}
        size="sm"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        <Zap size={16} className="mr-2" />
        Déclencher Bot Test
      </Button>
      
      <p className="text-xs text-white/60">
        Simule l'activité d'un bot pour tester les interactions
      </p>
    </div>
  );
};

export default DevBotTrigger;
