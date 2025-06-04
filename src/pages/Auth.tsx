
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate auth process
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (activeTab === 'register' && formData.password !== formData.confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas');
        return;
      }

      // Mock successful auth
      toast.success(activeTab === 'login' ? 'Connexion réussie !' : 'Compte créé avec succès !');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedBackground variant="purple">
      <div className="min-h-screen flex flex-col justify-center px-6 py-12">
        {/* Back button */}
        <motion.button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-2 text-white/80 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={24} />
        </motion.button>

        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-black text-white mb-2">
              Rejoins KIKADI
            </h1>
            <p className="text-white/80">
              Connecte-toi pour jouer avec tes amis !
            </p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                {/* Tabs */}
                <div className="flex bg-white/10 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'login'
                        ? 'bg-white text-purple-600'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'register'
                        ? 'bg-white text-purple-600'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Inscription
                  </button>
                </div>

                <CardTitle className="text-white text-center">
                  {activeTab === 'login' ? 'Bon retour !' : 'Bienvenue !'}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {activeTab === 'register' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Label htmlFor="pseudo" className="text-white">
                          Pseudo
                        </Label>
                        <Input
                          id="pseudo"
                          type="text"
                          placeholder="Ton pseudo de joueur"
                          value={formData.pseudo}
                          onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ton@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-white">
                      Mot de passe
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'register' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Label htmlFor="confirmPassword" className="text-white">
                          Confirmer le mot de passe
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2" />
                        {activeTab === 'login' ? 'Connexion...' : 'Création...'}
                      </div>
                    ) : (
                      <>
                        <span className="mr-2">✨</span>
                        {activeTab === 'login' ? 'Jouer en invité' : 'Créer mon compte'}
                      </>
                    )}
                  </Button>
                </form>

                {/* Security notice */}
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/70 text-xs text-center">
                    🔒 Tes stats ne seront pas sauvegardées
                  </p>
                  <p className="text-white/60 text-xs text-center mt-1">
                    Confidentialité respectée • Données protégées
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Alternative login */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-white/60 text-sm">
              ← Retour à l'accueil
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Auth;
