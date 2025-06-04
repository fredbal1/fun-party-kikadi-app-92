
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShopItem } from '@/types';
import { Star, Coins } from 'lucide-react';

interface ShopItemCardProps {
  item: ShopItem;
  owned?: boolean;
  onPurchase?: (itemId: string) => void;
  userCoins?: number;
  className?: string;
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600', 
  legendary: 'from-yellow-400 to-yellow-600'
};

const RARITY_LABELS = {
  common: 'Commun',
  rare: 'Rare',
  legendary: 'Légendaire'
};

export const ShopItemCard = ({ 
  item, 
  owned = false, 
  onPurchase, 
  userCoins = 0,
  className = '' 
}: ShopItemCardProps) => {
  const canAfford = userCoins >= item.prix;
  const rarity = item.rarete || 'common';

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative overflow-hidden ${
        owned ? 'bg-green-500/10 border-green-400/30' : 'bg-white/10 border-white/20'
      }`}>
        {/* Rarity banner */}
        <div className={`absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-b-[40px] border-b-gradient-to-r ${RARITY_COLORS[rarity]}`}>
          <div className="absolute -bottom-8 -right-8 w-6 h-6 flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
        </div>

        <CardContent className="p-4 text-center">
          {/* Item icon/preview */}
          <div className="mb-4">
            {item.type === 'avatar' ? (
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center text-3xl">
                {item.icon || '🎮'}
              </div>
            ) : item.type === 'effet' ? (
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                {item.icon || '✨'}
              </div>
            ) : (
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-lg font-bold text-white">
                {item.icon || item.nom.charAt(0)}
              </div>
            )}
          </div>

          {/* Item details */}
          <div className="space-y-2">
            <h3 className="text-white font-bold text-lg">
              {item.nom}
            </h3>
            
            <Badge 
              variant="secondary" 
              className={`bg-gradient-to-r ${RARITY_COLORS[rarity]} text-white border-0`}
            >
              {RARITY_LABELS[rarity]}
            </Badge>
            
            <p className="text-white/70 text-sm">
              {item.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold text-lg">
              {item.prix}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {owned ? (
            <div className="w-full text-center">
              <Badge variant="secondary" className="bg-green-500/20 text-green-200">
                ✅ Possédé
              </Badge>
            </div>
          ) : (
            <Button
              onClick={() => onPurchase?.(item.id)}
              disabled={!canAfford}
              className={`w-full font-bold ${
                canAfford 
                  ? 'bg-white text-purple-600 hover:bg-white/90' 
                  : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
              }`}
            >
              {canAfford ? (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Acheter
                </>
              ) : (
                'Pièces insuffisantes'
              )}
            </Button>
          )}
        </CardFooter>

        {/* Owned overlay */}
        {owned && (
          <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />
        )}
      </Card>
    </motion.div>
  );
};
