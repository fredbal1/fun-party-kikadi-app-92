
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Question {
  id: string;
  content: string;
  type: 'texte' | 'choix' | 'vérité';
  ambiance: 'safe' | 'intime' | 'no_filter';
  jeu: 'kikadi' | 'kidivrai' | 'kideja' | 'kidenous';
  validée: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    content: '',
    type: 'texte',
    ambiance: 'safe',
    jeu: 'kikadi',
    validée: false
  });

  // Mock questions data
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      content: 'Qui dans ce groupe a le plus de chances de devenir célèbre ?',
      type: 'texte',
      ambiance: 'safe',
      jeu: 'kikadi',
      validée: true
    },
    {
      id: '2',
      content: 'J\'ai déjà menti sur mon âge',
      type: 'vérité',
      ambiance: 'intime',
      jeu: 'kidivrai',
      validée: true
    },
    {
      id: '3',
      content: 'Qui a dit : "Je ne supporte pas les lundis" ?',
      type: 'choix',
      ambiance: 'safe',
      jeu: 'kideja',
      validée: false
    }
  ]);

  const handleAddQuestion = () => {
    if (!newQuestion.content?.trim()) {
      toast.error('Le contenu de la question est requis');
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      content: newQuestion.content,
      type: newQuestion.type || 'texte',
      ambiance: newQuestion.ambiance || 'safe',
      jeu: newQuestion.jeu || 'kikadi',
      validée: newQuestion.validée || false
    };

    setQuestions(prev => [...prev, question]);
    setNewQuestion({
      content: '',
      type: 'texte',
      ambiance: 'safe',
      jeu: 'kikadi',
      validée: false
    });

    toast.success('Question ajoutée avec succès !');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast.success('Question supprimée');
  };

  const handleToggleValidation = (id: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === id ? { ...q, validée: !q.validée } : q
      )
    );
  };

  const getAmbianceColor = (ambiance: string) => {
    switch (ambiance) {
      case 'safe': return 'bg-green-500';
      case 'intime': return 'bg-yellow-500';
      case 'no_filter': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getJeuColor = (jeu: string) => {
    switch (jeu) {
      case 'kikadi': return 'bg-blue-500';
      case 'kidivrai': return 'bg-purple-500';
      case 'kideja': return 'bg-orange-500';
      case 'kidenous': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AnimatedBackground variant="green">
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
            <Settings className="mr-2" size={24} />
            Administration
          </h1>
          
          <Badge className="bg-red-500 text-white">Admin</Badge>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-6">
              <TabsTrigger value="questions" className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600">
                Questions
              </TabsTrigger>
              <TabsTrigger value="ambiances" className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600">
                Ambiances
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600">
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-6">
              {/* Add new question */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Plus className="mr-2" size={20} />
                      Ajouter une question
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Contenu de la question..."
                      value={newQuestion.content}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, type: value as Question['type'] }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="texte">Texte</SelectItem>
                          <SelectItem value="choix">Choix</SelectItem>
                          <SelectItem value="vérité">Vérité</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={newQuestion.ambiance} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, ambiance: value as Question['ambiance'] }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Ambiance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="safe">Safe</SelectItem>
                          <SelectItem value="intime">Intime</SelectItem>
                          <SelectItem value="no_filter">No Filter</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={newQuestion.jeu} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, jeu: value as Question['jeu'] }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Mini-jeu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kikadi">KiKaDi</SelectItem>
                          <SelectItem value="kidivrai">KiDiVrai</SelectItem>
                          <SelectItem value="kideja">KiDéjà</SelectItem>
                          <SelectItem value="kidenous">KiDeNous</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newQuestion.validée}
                          onCheckedChange={(checked) => setNewQuestion(prev => ({ ...prev, validée: checked }))}
                        />
                        <span className="text-white text-sm">Validée</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleAddQuestion}
                      className="w-full bg-white text-green-600 hover:bg-white/90"
                    >
                      Ajouter la question
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Questions list */}
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white mb-2">{question.content}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getAmbianceColor(question.ambiance)}>
                                {question.ambiance}
                              </Badge>
                              <Badge className={getJeuColor(question.jeu)}>
                                {question.jeu}
                              </Badge>
                              <Badge variant={question.validée ? "default" : "secondary"}>
                                {question.validée ? "Validée" : "En attente"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Switch
                              checked={question.validée}
                              onCheckedChange={() => handleToggleValidation(question.id)}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ambiances" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Gestion des ambiances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80">
                      Fonctionnalité à venir : gérer les ambiances de jeu dynamiquement.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Paramètres généraux</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80">
                      Fonctionnalité à venir : paramètres globaux de l'application.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Admin;
