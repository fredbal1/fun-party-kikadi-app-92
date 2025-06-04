
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Plus } from 'lucide-react';

interface DevBotAdderProps {
  onAddBot: () => void;
}

export const DevBotAdder = ({ onAddBot }: DevBotAdderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">🤖</div>
            <h3 className="text-white font-semibold">Ajouter un bot</h3>
            <p className="text-white/70 text-sm">
              Ajoutez un joueur automatique pour tester la partie
            </p>
            <Button
              onClick={onAddBot}
              className="w-full bg-white/20 text-white hover:bg-white/30 border border-white/30"
              size="lg"
            >
              <Plus className="mr-2" size={20} />
              Ajouter un bot
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
