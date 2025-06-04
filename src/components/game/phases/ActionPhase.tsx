
import React from 'react';
import { motion } from 'framer-motion';
import { VoteBox } from '@/components/game/VoteBox';
import { PlayerState, MiniGameType } from '@/types';

interface ActionPhaseProps {
  miniJeu: MiniGameType;
  players: PlayerState[];
  onSubmitVote: (targetId: string) => void;
  selectedVote?: string;
}

/**
 * Composant de vote/action selon le mini-jeu
 * Affiche les options de vote adaptées au contexte
 */
export const ActionPhase: React.FC<ActionPhaseProps> = ({
  miniJeu,
  players,
  onSubmitVote,
  selectedVote
}) => {
  // TODO: Adapter les options selon le mini-jeu et récupérer les vraies données
  const mockOptions = players.map(player => ({
    id: player.id,
    content: `Réponse de ${player.pseudo || 'Joueur'}`,
    playerId: player.id,
    playerName: player.pseudo
  }));

  const getActionTitle = () => {
    switch (miniJeu) {
      case 'kikadi':
        return 'Qui a écrit quoi ?';
      case 'kidivrai':
        return 'Vrai ou Faux ?';
      case 'kidenous':
        return 'Qui correspond le mieux ?';
      case 'kideja':
        return 'Qui a déjà fait ça ?';
      default:
        return 'Faites votre choix';
    }
  };

  return (
    <div data-testid="action-phase">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <VoteBox
          question={getActionTitle()}
          options={mockOptions}
          onVote={onSubmitVote}
          selectedVote={selectedVote}
          className="max-w-lg mx-auto"
        />
      </motion.div>
    </div>
  );
};
