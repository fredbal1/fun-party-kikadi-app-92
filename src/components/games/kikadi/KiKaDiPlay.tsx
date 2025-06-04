
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Round } from '@/types/game';
import { usePlayers } from '@/hooks/usePlayers';
import { generateMockQuestions } from '@/utils/devMode';

interface KiKaDiPlayProps {
  gameId: string;
  roundData: Round;
  onPhaseComplete: () => void;
}

/**
 * Phase de jeu KiKaDi - Répondre à la question
 * Les joueurs soumettent leur réponse anonyme
 */
export const KiKaDiPlay: React.FC<KiKaDiPlayProps> = ({
  roundData,
  onPhaseComplete
}) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setPlayerAnswer, currentPlayer } = usePlayers();

  // Question mock - sera remplacée par les vraies données
  const mockQuestions = generateMockQuestions();
  const question = roundData.question || mockQuestions.kikadi[0];

  const handleSubmit = () => {
    if (answer.trim() && currentPlayer) {
      setPlayerAnswer(currentPlayer.id, answer.trim());
      setIsSubmitted(true);
      
      // Simuler un délai avant de passer à la phase suivante
      setTimeout(() => {
        onPhaseComplete();
      }, 1500);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold text-white">
            Réponse envoyée !
          </h2>
          <p className="text-white/80">
            En attente des autres joueurs...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* En-tête */}
          <div className="text-center">
            <div className="text-4xl mb-4">🧠</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              À vous de répondre !
            </h2>
            <p className="text-white/80">
              Manche {roundData.roundNumber} • KiKaDi
            </p>
          </div>

          {/* Question */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center text-xl">
                {question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Tapez votre réponse ici..."
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50 min-h-[120px]"
                maxLength={200}
              />
              
              <div className="text-right text-white/60 text-sm">
                {answer.length}/200 caractères
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
                size="lg"
              >
                Envoyer ma réponse
              </Button>
            </CardContent>
          </Card>

          {/* Conseils */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-white/70 text-sm text-center">
              💡 Soyez créatif ! Les autres vont essayer de deviner que c'est vous.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
