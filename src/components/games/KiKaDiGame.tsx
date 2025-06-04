
import { motion } from 'framer-motion';
import { PhaseHeader } from '@/components/game/PhaseHeader';
import { VoteBox } from '@/components/game/VoteBox';
import { RevealPanel } from '@/components/game/RevealPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { GamePhase, Player } from '@/types';

interface KiKaDiGameProps {
  phase: GamePhase;
  question: string;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  onAnswer: (answer: string) => void;
  onVote: (targetId: string) => void;
  onNext: () => void;
  hasAnswered?: boolean;
  selectedVote?: string;
}

export const KiKaDiGame = ({
  phase,
  question,
  players,
  currentRound,
  totalRounds,
  onAnswer,
  onVote,
  onNext,
  hasAnswered = false,
  selectedVote
}: KiKaDiGameProps) => {
  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;
    onAnswer(currentAnswer);
    setCurrentAnswer('');
  };

  const renderPhaseContent = () => {
    switch (phase) {
      case 'intro':
        return (
          <PhaseHeader
            miniJeu="kikadi"
            phase="introduction"
            roundNumber={currentRound}
            totalRounds={totalRounds}
          />
        );

      case 'answering':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PhaseHeader
              miniJeu="kikadi"
              phase="réponse"
              roundNumber={currentRound}
              totalRounds={totalRounds}
            />
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <span className="mr-2">🧠</span>
                  Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white text-lg font-medium mb-6">
                  {question}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium block mb-2">
                      Votre réponse
                    </label>
                    <Input
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Soyez créatif..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      disabled={hasAnswered}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSubmitAnswer}
                    className="w-full bg-white text-purple-600 hover:bg-white/90 font-medium"
                    disabled={hasAnswered || !currentAnswer.trim()}
                  >
                    {hasAnswered ? (
                      <>
                        <span className="mr-2">✅</span>
                        Réponse envoyée
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📤</span>
                        Valider ma réponse
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'voting':
        const mockAnswers = [
          { id: '1', content: 'La vie est un cadeau précieux', playerId: 'player1' },
          { id: '2', content: 'Chaque jour est une nouvelle aventure', playerId: 'player2' },
          { id: '3', content: 'Il faut croire en ses rêves', playerId: 'player3' }
        ];

        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PhaseHeader
              miniJeu="kikadi"
              phase="association"
              roundNumber={currentRound}
              totalRounds={totalRounds}
            />
            
            <VoteBox
              question="Qui a écrit quoi ?"
              options={mockAnswers}
              onVote={onVote}
              selectedVote={selectedVote}
            />
          </motion.div>
        );

      case 'revealing':
        const mockRevealItems = [
          {
            id: '1',
            playerName: 'Marie',
            content: 'La vie est un cadeau précieux',
            isCorrect: true,
            points: 25
          },
          {
            id: '2',
            playerName: 'Alex',
            content: 'Chaque jour est une nouvelle aventure',
            isCorrect: false,
            points: 0
          }
        ];

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RevealPanel
              items={mockRevealItems}
              onNext={onNext}
              showReactions={true}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderPhaseContent()}
    </div>
  );
};
