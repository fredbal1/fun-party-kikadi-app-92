
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { ShopItemCard } from '@/components/shop/ShopItemCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Coins, ShoppingBag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { toast } from 'react-hot-toast';
import { ShopItem } from '@/types';

const Shop = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserCoins } = useGameStore();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  // Mock shop items - updated with rarete property
  const shopItems: ShopItem[] = [
    // Avatars
    { id: 'avatar1', type: 'avatar', nom: 'Gamer Pro', description: 'Pour les vrais gamers', prix: 50, rarete: 'common', emoji: '🎮' },
    { id: 'avatar2', type: 'avatar', nom: 'Licorne Magique', description: 'Brillez de mille feux', prix: 120, rarete: 'rare', emoji: '🦄' },
    { id: 'avatar3', type: 'avatar', nom: 'Dragon Légendaire', description: 'Avatar ultra rare', prix: 300, rarete: 'legendary', emoji: '🐉' },
    
    // Titres
    { id: 'titre1', type: 'titre', nom: 'Roi du Bluff', description: 'Titre pour les menteurs pros', prix: 80, rarete: 'common' },
    { id: 'titre2', type: 'titre', nom: 'Détective Privé', description: 'Rien ne vous échappe', prix: 150, rarete: 'rare' },
    { id: 'titre3', type: 'titre', nom: 'Maître du Jeu', description: 'Titre légendaire réservé aux experts', prix: 500, rarete: 'legendary' },
    
    // Effets visuels
    { id: 'effet1', type: 'effet', nom: 'Confettis Arc-en-ciel', description: 'Explosion colorée à chaque victoire', prix: 100, rarete: 'common' },
    { id: 'effet2', type: 'effet', nom: 'Flammes Épiques', description: 'Des flammes impressionnantes', prix: 200, rarete: 'rare' },
    { id: 'effet3', type: 'effet', nom: 'Portail Dimensionnel', description: 'Effet légendaire saisissant', prix: 400, rarete: 'legendary' }
  ];

  const handlePurchase = (item: ShopItem) => {
    if (!currentUser) {
      toast.error('Vous devez être connecté pour acheter');
      return;
    }

    if (currentUser.pieces < item.prix) {
      toast.error('Pièces insuffisantes !');
      return;
    }

    if (purchasedItems.includes(item.id)) {
      toast.error('Objet déjà acheté !');
      return;
    }

    // Simuler l'achat
    updateUserCoins(currentUser.pieces - item.prix);
    setPurchasedItems(prev => [...prev, item.id]);
    
    toast.success(`${item.nom} acheté avec succès ! 🎉`, {
      className: 'bg-green-500 text-white'
    });
  };

  const getFilteredItems = (type: ShopItem['type']) => {
    return shopItems.filter(item => item.type === type);
  };

  return (
    <AnimatedBackground variant="purple">
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
            <ShoppingBag className="mr-2" size={24} />
            Boutique
          </h1>
          
          <div className="flex items-center text-white bg-white/10 px-3 py-2 rounded-lg">
            <Coins size={16} className="mr-1" />
            <span className="font-bold">{currentUser?.pieces || 0}</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="avatar" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-6">
              <TabsTrigger value="avatar" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
                Avatars
              </TabsTrigger>
              <TabsTrigger value="titre" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
                Titres
              </TabsTrigger>
              <TabsTrigger value="effet" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
                Effets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="avatar" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredItems('avatar').map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ShopItemCard
                      item={item}
                      owned={purchasedItems.includes(item.id)}
                      onPurchase={() => handlePurchase(item)}
                      userCoins={currentUser?.pieces || 0}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="titre" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredItems('titre').map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ShopItemCard
                      item={item}
                      owned={purchasedItems.includes(item.id)}
                      onPurchase={() => handlePurchase(item)}
                      userCoins={currentUser?.pieces || 0}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="effet" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredItems('effet').map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ShopItemCard
                      item={item}
                      owned={purchasedItems.includes(item.id)}
                      onPurchase={() => handlePurchase(item)}
                      userCoins={currentUser?.pieces || 0}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Rotation notice */}
        <motion.div
          className="max-w-md mx-auto mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center">
            <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-white/80 text-sm">
              Les objets de la boutique changent régulièrement !
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
};

export default Shop;
