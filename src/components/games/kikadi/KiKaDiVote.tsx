
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VoteBox } from '@/components/game/VoteBox';
import { Round } from '@/types/game';
import { usePlayers } from '@/hooks/usePlayers';

interface KiKaDiVoteProps {
  gameId: string;
  roundData: Round;
  onPhaseComplete: () => void;
}

/**
 * Phase de vote KiKaDi - Associer réponses et joueurs
 */
export const KiKaDiVote: React.FC<KiKaDiVoteProps> = ({
  onPhaseComplete
}) => {
  const [selectedVote, setSelectedVote] = useState<string>('');
  const { players } = usePlayers();

  // Mock données - seront remplacées par les vraies réponses
  const mockAnswers = [
    { id: '1', content: "Voyager dans l'espace", playerId: 'player1' },
    { id: '2', content: "Rencontrer mon idole", playerId: 'player2' },
    { id: '3', content: "Pouvoir voler", playerId: 'player3' },
  ];

  const handleVote = (answerId: string) => {
    setSelectedVote(answerId);
    setTimeout(() => {
      onPhaseComplete();
    }, 1000);
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <VoteBox
          question="Qui a donné quelle réponse ?"
          options={mockAnswers.map(answer => ({
            id: answer.id,
            content: answer.content,
          }))}
          onVote={handleVote}
          selectedVote={selectedVote}
        />
      </div>
    </div>
  );
};
