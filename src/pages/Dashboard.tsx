
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  GamepadIcon, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Lightbulb 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock user data
  const userData = {
    pseudo: 'fred',
    niveau: 8,
    xp: 1250,
    xpMax: 1500,
    pieces: 320
  };

  const menuItems = [
    {
      icon: GamepadIcon,
      title: 'Créer une partie',
      subtitle: 'Lance un nouveau jeu',
      color: 'from-purple-500 to-pink-500',
      path: '/create'
    },
    {
      icon: Users,
      title: 'Rejoindre',
      subtitle: 'Rejoins tes amis',
      color: 'from-blue-500 to-cyan-500',
      path: '/join'
    },
    {
      icon: ShoppingBag,
      title: 'Boutique',
      subtitle: 'Avatars & titres',
      color: 'from-green-500 to-emerald-500',
      path: '/shop'
    },
    {
      icon: BarChart3,
      title: 'Stats',
      subtitle: 'Tes performances',
      color: 'from-red-500 to-orange-500',
      path: '/stats'
    },
    {
      icon: Settings,
      title: 'Réglages',
      subtitle: 'Personnalise ton jeu',
      color: 'from-indigo-500 to-purple-500',
      path: '/settings'
    },
    {
      icon: Lightbulb,
      title: 'Dev Preview',
      subtitle: 'Fonctions en test',
      color: 'from-yellow-500 to-orange-500',
      path: '/admin/dev-mode'
    }
  ];

  return (
    <AnimatedBackground variant="orange">
      <div className="min-h-screen px-6 py-8">
        {/* Header with user info */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                🎮 {userData.pseudo}
                <Badge className="ml-2 bg-white/20 text-white border-0">
                  Joueur Invité • Niveau {userData.niveau}
                </Badge>
              </h1>
            </div>
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Se connecter
            </Button>
          </div>

          {/* XP Progress */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Expérience</span>
                <span className="text-white/80 text-sm">
                  {userData.xp} / {userData.xpMax} XP
                </span>
              </div>
              <Progress 
                value={(userData.xp / userData.xpMax) * 100} 
                className="h-2 bg-white/20"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Main menu grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer h-32 hover:bg-white/20 transition-all"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-4 h-full flex flex-col justify-center text-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} mx-auto mb-2 flex items-center justify-center`}>
                    <item.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-xs mt-1">
                    {item.subtitle}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Daily tip */}
        <motion.div
          className="mt-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-white/80 text-sm">
                Invite tes amis pour des parties encore plus fun !
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
};

export default Dashboard;
