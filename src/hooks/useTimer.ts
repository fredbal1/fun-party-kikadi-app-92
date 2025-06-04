
import { useState, useEffect, useCallback } from 'react';

/**
 * useTimer — Gestion de compte à rebours avec animation
 */
export const useTimer = (initialTime: number, onComplete?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => {
    setIsRunning(true);
    setTimeLeft(initialTime);
  }, [initialTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            setIsRunning(false);
            onComplete?.();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, onComplete]);

  const percentage = ((initialTime - timeLeft) / initialTime) * 100;

  return {
    timeLeft,
    isRunning,
    percentage,
    start,
    stop,
    reset,
    isExpired: timeLeft === 0
  };
};
