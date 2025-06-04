
import React from 'react';
import { Round } from '@/types/game';

interface KiDejaIntroProps {
  gameId: string;
  roundData: Round;
  onPhaseComplete: () => void;
}

export const KiDejaIntro: React.FC<KiDejaIntroProps> = ({ onPhaseComplete }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-white text-center">
        <div className="text-8xl mb-4">🎯</div>
        <h2 className="text-2xl mb-4">KiDeja - Introduction</h2>
        <button onClick={onPhaseComplete} className="bg-white text-purple-600 px-4 py-2 rounded">
          Commencer
        </button>
      </div>
    </div>
  );
};
