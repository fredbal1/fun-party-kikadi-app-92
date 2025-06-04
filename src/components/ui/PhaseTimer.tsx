
import { motion } from 'framer-motion';
import { useTimer } from '@/hooks/useTimer';
import { useEffect } from 'react';

interface PhaseTimerProps {
  duration: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export const PhaseTimer = ({ duration, onComplete, autoStart = true }: PhaseTimerProps) => {
  const { timeLeft, percentage, start, isRunning, isExpired } = useTimer(duration, onComplete);

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart, start]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="white"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (percentage / 100)}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (percentage / 100) }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        
        {/* Timer text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-white"
            animate={{
              scale: isExpired ? [1, 1.2, 1] : 1,
              color: timeLeft <= 10 ? '#ef4444' : '#ffffff'
            }}
            transition={{ duration: 0.3 }}
          >
            {timeLeft}
          </motion.span>
        </div>
      </div>
      
      {isRunning && (
        <motion.div
          className="text-white/80 text-sm"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Temps restant
        </motion.div>
      )}
    </div>
  );
};
