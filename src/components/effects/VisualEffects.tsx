
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
}

interface ShakeProps {
  trigger: boolean;
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'strong';
}

export const Confetti = ({ show, onComplete }: ConfettiProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6ab04c'];
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      
      setParticles(newParticles);
      
      // Auto cleanup after animation
      setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);
    }
  }, [show, onComplete]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          initial={{ 
            opacity: 1, 
            scale: 0,
            y: 0
          }}
          animate={{ 
            opacity: [1, 1, 0],
            scale: [0, 1, 0.5],
            y: [0, -100, 200],
            x: [0, Math.random() * 200 - 100],
            rotate: [0, Math.random() * 360]
          }}
          transition={{ 
            duration: 3,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export const ShakeEffect = ({ trigger, children, intensity = 'medium' }: ShakeProps) => {
  const shakeVariants = {
    light: { x: [-2, 2, -2, 2, 0] },
    medium: { x: [-5, 5, -5, 5, 0], y: [-2, 2, -2, 2, 0] },
    strong: { x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0] }
  };

  return (
    <motion.div
      animate={trigger ? shakeVariants[intensity] : {}}
      transition={{ duration: 0.5, times: [0, 0.25, 0.5, 0.75, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Hook pour déclencher des effets facilement
export const useVisualEffects = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeState, setShakeState] = useState<{ trigger: boolean; intensity: 'light' | 'medium' | 'strong' }>({ trigger: false, intensity: 'medium' });

  const triggerConfetti = () => {
    setShowConfetti(true);
  };

  const triggerShake = (intensity: 'light' | 'medium' | 'strong' = 'medium') => {
    setShakeState({ trigger: true, intensity });
    setTimeout(() => setShakeState(prev => ({ ...prev, trigger: false })), 500);
  };

  const resetEffects = () => {
    setShowConfetti(false);
    setShakeState({ trigger: false, intensity: 'medium' });
  };

  return {
    // Confetti
    showConfetti,
    triggerConfetti,
    ConfettiComponent: () => (
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
    ),
    
    // Shake
    shakeState,
    triggerShake,
    ShakeWrapper: ({ children }: { children: React.ReactNode }) => (
      <ShakeEffect trigger={shakeState.trigger} intensity={shakeState.intensity}>
        {children}
      </ShakeEffect>
    ),
    
    // Reset
    resetEffects
  };
};
