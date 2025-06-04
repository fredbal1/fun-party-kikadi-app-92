
import React from 'react';
import { Round } from '@/types/game';

interface KiDeNousPlayProps {
  gameId: string;
  roundData: Round;
  onPhaseComplete: () => void;
}

export const KiDeNousPlay: React.FC<KiDeNousPlayProps> = ({ onPhaseComplete }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-white text-center">
        <h2 className="text-2xl mb-4">KiDeNous - Phase de jeu</h2>
        <button onClick={onPhaseComplete} className="bg-white text-purple-600 px-4 py-2 rounded">
          Continuer
        </button>
      </div>
    </div>
  );
};
