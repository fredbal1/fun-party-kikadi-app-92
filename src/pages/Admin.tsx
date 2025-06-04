
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Edit3, Trash2, Save, Settings, TestTube } from 'lucide-react';
import { Question, MiniJeu, Ambiance } from '@/types';
import { MINI_JEUX, AMBIANCES } from '@/constants/gamePhases';
import { toast } from 'react-hot-toast';

// Mock questions data - will be connected to Supabase
const mockQuestions: Question[] = [
  {
    id: '1',
    content: 'Quelle est votre plus grande peur ?',
    type: 'texte',
    ambiance: 'intime',
    jeu: 'kikadi',
    validee: true
  },
  {
    id: '2',
    content: 'Qui ici a déjà menti sur son âge ?',
    type: 'choix',
    ambiance: 'no_filter',
    jeu: 'kideja',
    validee: true
  }
];

const Admin = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  
  const [newQuestion, setNewQuestion] = useState({
    content: '',
    type: 'texte' as const,
    ambiance: 'safe' as Ambiance,
    jeu: 'kikadi' as MiniJeu
  });

  const handleSaveQuestion = () => {
    if (!newQuestion.content.trim()) {
      toast.error('Le contenu de la question est requis');
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      ...newQuestion,
      validee: true
    };

    setQuestions([...questions, question]);
    setNewQuestion({ content: '', type: 'texte', ambiance: 'safe', jeu: 'kikadi' });
    setIsAddingQuestion(false);
    toast.success('Question ajoutée !');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success('Question supprimée !');
  };

  const getAmbianceColor = (ambiance: Ambiance) => {
    switch (ambiance) {
      case 'safe':
        return 'bg-green-500';
      case 'intime':
        return 'bg-pink-500';
      case 'no_filter':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <AnimatedBackground variant="orange">
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
          
          <Button
            onClick={() => navigate('/admin/dev-mode')}
            className="bg-white text-orange-600 hover:bg-white/90"
          >
            <TestTube className="mr-2 h-5 w-5" />
            Mode Test
          </Button>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-5xl mb-4">⚙️</div>
          <h1 className="text-4xl font-black text-white mb-2">
            Administration KIKADI
          </h1>
          <p className="text-white/80">
            Gérez les questions et contenus du jeu
          </p>
        </motion.div>

        {/* Main content */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="questions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="questions" className="data-[state=active]:bg-white/20">
                <Edit3 className="h-4 w-4 mr-2" />
                Questions
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white/20">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-6">
              {/* Add question section */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Ajouter une question</CardTitle>
                    <Button
                      onClick={() => setIsAddingQuestion(!isAddingQuestion)}
                      size="sm"
                      className="bg-white text-orange-600 hover:bg-white/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle question
                    </Button>
                  </div>
                </CardHeader>
                
                {isAddingQuestion && (
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-white text-sm font-medium block mb-2">
                        Contenu de la question *
                      </label>
                      <Textarea
                        value={newQuestion.content}
                        onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                        placeholder="Exemple: Quelle est votre plus grande passion ?"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-white text-sm font-medium block mb-2">
                          Mini-jeu
                        </label>
                        <Select value={newQuestion.jeu} onValueChange={(value: MiniJeu) => setNewQuestion({ ...newQuestion, jeu: value })}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(MINI_JEUX).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value.emoji} {value.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-white text-sm font-medium block mb-2">
                          Ambiance
                        </label>
                        <Select value={newQuestion.ambiance} onValueChange={(value: Ambiance) => setNewQuestion({ ...newQuestion, ambiance: value })}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(AMBIANCES).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value.emoji} {value.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-white text-sm font-medium block mb-2">
                          Type
                        </label>
                        <Select value={newQuestion.type} onValueChange={(value: any) => setNewQuestion({ ...newQuestion, type: value })}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="texte">Texte libre</SelectItem>
                            <SelectItem value="choix">Choix multiple</SelectItem>
                            <SelectItem value="verite">Vérité/Mensonge</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button onClick={handleSaveQuestion} className="bg-green-500 hover:bg-green-600">
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button onClick={() => setIsAddingQuestion(false)} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Questions list */}
              <div className="space-y-4">
                <h3 className="text-white text-xl font-bold">
                  Questions existantes ({questions.length})
                </h3>
                
                {questions.map((question) => (
                  <Card key={question.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium mb-2">
                            {question.content}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-500 text-white">
                              {MINI_JEUX[question.jeu]?.emoji} {MINI_JEUX[question.jeu]?.nom}
                            </Badge>
                            <Badge className={`${getAmbianceColor(question.ambiance)} text-white`}>
                              {AMBIANCES[question.ambiance]?.emoji} {AMBIANCES[question.ambiance]?.nom}
                            </Badge>
                            <Badge variant="outline" className="border-white/30 text-white">
                              {question.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                            onClick={() => setEditingQuestion(question.id)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-300 hover:bg-red-500/20"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Paramètres du jeu</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    Les paramètres avancés seront disponibles bientôt...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
};

export default Admin;
