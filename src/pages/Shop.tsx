
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Coins, ShoppingBag, Sparkles, Crown, Palette } from 'lucide-react';
import { ShopItem } from '@/types';
import { toast } from 'react-hot-toast';

// Mock shop data - will be connected to Supabase
const shopItems: ShopItem[] = [
  {
    id: '1',
    type: 'avatar',
    nom: 'Avatar Robot',
    description: 'Un avatar futuriste pour se démarquer',
    prix: 150,
    rarete: 'common',
    icon: '🤖'
  },
  {
    id: '2',
    type: 'titre',
    nom: 'Maître du Bluff',
    description: 'Titre légendaire pour les experts',
    prix: 500,
    rarete: 'legendary',
    icon: '🃏'
  },
  {
    id: '3',
    type: 'effet',
    nom: 'Confettis Arc-en-ciel',
    description: 'Effet visuel lors des victoires',
    prix: 200,
    rarete: 'rare',
    icon: '🌈'
  },
  {
    id: '4',
    type: 'avatar',
    nom: 'Avatar Ninja',
    description: 'Avatar mystérieux et stylé',
    prix: 100,
    rarete: 'common',
    icon: '🥷'
  },
  {
    id: '5',
    type: 'effet',
    nom: 'Explosion Dorée',
    description: 'Effet spectaculaire premium',
    prix: 800,
    rarete: 'legendary',
    icon: '💥'
  }
];

const Shop = () => {
  const navigate = useNavigate();
  const [userCoins] = useState(350); // Mock user coins
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'avatar' | 'titre' | 'effet'>('all');
  const [ownedItems] = useState<string[]>(['1']); // Mock owned items

  const filteredItems = shopItems.filter(item => 
    selectedCategory === 'all' || item.type === selectedCategory
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500';
      case 'rare':
        return 'bg-blue-500';
      case 'legendary':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'avatar':
        return <Palette className="h-4 w-4" />;
      case 'titre':
        return <Crown className="h-4 w-4" />;
      case 'effet':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  const handlePurchase = (item: ShopItem) => {
    if (ownedItems.includes(item.id)) {
      toast.error('Vous possédez déjà cet objet !');
      return;
    }
    
    if (userCoins < item.prix) {
      toast.error('Pièces insuffisantes !');
      return;
    }
    
    toast.success(`${item.nom} acheté !`);
    // Here we would update user coins and owned items via Supabase
  };

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
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour
          </Button>
          
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span className="text-white font-bold">{userCoins}</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-5xl mb-4">🛍️</div>
          <h1 className="text-4xl font-black text-white mb-2">
            Boutique KIKADI
          </h1>
          <p className="text-white/80">
            Personnalisez votre expérience de jeu
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
            <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="all" className="data-[state=active]:bg-white/20">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Tout
              </TabsTrigger>
              <TabsTrigger value="avatar" className="data-[state=active]:bg-white/20">
                <Palette className="h-4 w-4 mr-2" />
                Avatars
              </TabsTrigger>
              <TabsTrigger value="titre" className="data-[state=active]:bg-white/20">
                <Crown className="h-4 w-4 mr-2" />
                Titres
              </TabsTrigger>
              <TabsTrigger value="effet" className="data-[state=active]:bg-white/20">
                <Sparkles className="h-4 w-4 mr-2" />
                Effets
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Shop items grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <CardTitle className="text-white text-lg">{item.nom}</CardTitle>
                        <Badge className={`${getRarityColor(item.rarete)} text-white text-xs`}>
                          {item.rarete}
                        </Badge>
                      </div>
                    </div>
                    {getCategoryIcon(item.type)}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-white/80 text-sm mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Coins className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-bold">{item.prix}</span>
                    </div>
                    
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={ownedItems.includes(item.id)}
                      className={
                        ownedItems.includes(item.id)
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : userCoins >= item.prix
                          ? "bg-white text-blue-600 hover:bg-white/90"
                          : "bg-gray-500 text-white cursor-not-allowed"
                      }
                      size="sm"
                    >
                      {ownedItems.includes(item.id) 
                        ? 'Possédé' 
                        : userCoins >= item.prix 
                        ? 'Acheter' 
                        : 'Insuffisant'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-white/60">
              Aucun objet dans cette catégorie pour le moment
            </p>
          </motion.div>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default Shop;
