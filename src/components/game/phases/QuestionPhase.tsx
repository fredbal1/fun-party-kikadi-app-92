
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MiniGameType } from '@/types';

interface QuestionPhaseProps {
  miniJeu: MiniGameType;
  question: string;
  onSubmitAnswer: (answer: string) => void;
  timeRemaining?: number;
}

/**
 * Composant de saisie de réponse
 * Gère l'input utilisateur selon le type de mini-jeu
 */
export const QuestionPhase: React.FC<QuestionPhaseProps> = ({
  miniJeu,
  question,
  onSubmitAnswer,
  timeRemaining
}) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (answer.trim() && !isSubmitted) {
      setIsSubmitted(true);
      onSubmitAnswer(answer.trim());
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto" data-testid="question-phase">
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-white text-2xl font-bold mb-4">
          💭 Question
        </h3>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-6">
            <p className="text-white text-lg font-medium">
              {question}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Saisie de réponse */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <label className="text-white font-medium block">
          Votre réponse :
        </label>
        
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Tapez votre réponse ici..."
          disabled={isSubmitted}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
          rows={3}
        />

        <Button
          onClick={handleSubmit}
          disabled={!answer.trim() || isSubmitted}
          className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold"
          size="lg"
        >
          {isSubmitted ? '✅ Réponse envoyée' : 'Envoyer ma réponse'}
        </Button>
      </motion.div>

      {/* Timer si présent */}
      {timeRemaining && (
        <motion.div
          className="text-center text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Temps restant: {timeRemaining}s
        </motion.div>
      )}
    </div>
  );
};
