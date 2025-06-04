
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <AnimatedBackground variant="purple">
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🧠
          </motion.div>
          
          <motion.h1
            className="text-6xl font-black text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            KIKADI
          </motion.h1>
          
          <motion.p
            className="text-xl text-white/90 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Le jeu social qui crée du lien ! 🎮
          </motion.p>
        </motion.div>

        {/* Features Cards */}
        <motion.div
          className="grid grid-cols-2 gap-4 w-full max-w-md mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-white text-sm font-medium">2-8 joueurs</div>
            <div className="text-white/70 text-xs">Plus on est de fous, plus on rit !</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-white text-sm font-medium">Mini-jeux variés</div>
            <div className="text-white/70 text-xs">KiKaDi, KiDiVrai, KiDéjà, KiDeNous</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-white text-sm font-medium">Révélations</div>
            <div className="text-white/70 text-xs">Découvrez qui se cache derrière quoi !</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-white text-sm font-medium">Fun garanti</div>
            <div className="text-white/70 text-xs">Fous rires et moments mémorables</div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-white text-purple-600 hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-2xl shadow-2xl border-0"
          >
            <span className="mr-2">🎮</span>
            Envie de jouer ?
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <p className="text-white/60 text-sm">
            v1.0.0 • Made with ❤️ for fun
          </p>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
};

export default Index;
