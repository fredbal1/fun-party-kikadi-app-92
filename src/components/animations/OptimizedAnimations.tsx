
import { motion, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useMemo } from 'react';

/**
 * Composants d'animation optimisés pour 60fps
 * Utilise will-change, transform3d, et évite les reflows
 */

interface OptimizedMotionProps {
  children: ReactNode;
  className?: string;
  animate?: any;
  initial?: any;
  transition?: any;
  style?: React.CSSProperties;
}

// Animation fade optimisée
export const OptimizedFadeIn = ({ children, className = '', ...props }: OptimizedMotionProps) => {
  const shouldReduceMotion = useReducedMotion();
  
  const optimizedVariants = useMemo(() => ({
    initial: { 
      opacity: 0, 
      transform: 'translate3d(0, 10px, 0)',
      willChange: 'opacity, transform'
    },
    animate: { 
      opacity: 1, 
      transform: 'translate3d(0, 0, 0)',
      willChange: 'auto'
    }
  }), []);

  const optimizedTransition = useMemo(() => ({
    duration: shouldReduceMotion ? 0 : 0.3,
    ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    opacity: { duration: shouldReduceMotion ? 0 : 0.2 }
  }), [shouldReduceMotion]);

  return (
    <motion.div
      className={className}
      variants={optimizedVariants}
      initial="initial"
      animate="animate"
      transition={optimizedTransition}
      style={{ 
        backfaceVisibility: 'hidden',
        perspective: 1000,
        ...props.style 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation scale optimisée pour les boutons
export const OptimizedScaleButton = ({ children, className = '', onClick, ...props }: OptimizedMotionProps & { onClick?: () => void }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={shouldReduceMotion ? {} : { 
        scale: 1.05,
        transition: { duration: 0.15, ease: 'easeOut' }
      }}
      whileTap={shouldReduceMotion ? {} : { 
        scale: 0.95,
        transition: { duration: 0.1, ease: 'easeOut' }
      }}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        ...props.style
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Animation slide optimisée
export const OptimizedSlideIn = ({ 
  children, 
  direction = 'right', 
  className = '', 
  ...props 
}: OptimizedMotionProps & { direction?: 'left' | 'right' | 'up' | 'down' }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const getInitialTransform = () => {
    if (shouldReduceMotion) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'left': return 'translate3d(-100%, 0, 0)';
      case 'right': return 'translate3d(100%, 0, 0)';
      case 'up': return 'translate3d(0, -100%, 0)';
      case 'down': return 'translate3d(0, 100%, 0)';
      default: return 'translate3d(100%, 0, 0)';
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        transform: getInitialTransform(),
        willChange: 'transform'
      }}
      animate={{ 
        transform: 'translate3d(0, 0, 0)',
        willChange: 'auto'
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        backfaceVisibility: 'hidden',
        ...props.style
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation de confetti optimisée
export const OptimizedConfetti = ({ count = 20, colors = [] }: { count?: number; colors?: string[] }) => {
  const shouldReduceMotion = useReducedMotion();
  const defaultColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'];
  const confettiColors = colors.length ? colors : defaultColors;

  if (shouldReduceMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const randomColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const randomDelay = Math.random() * 0.5;
        const randomDuration = 2 + Math.random() * 2;
        const randomStartX = Math.random() * 100;
        const randomEndX = Math.random() * 100;

        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: randomColor,
              left: `${randomStartX}%`,
              willChange: 'transform'
            }}
            initial={{
              y: -20,
              x: 0,
              rotate: 0,
              scale: 0
            }}
            animate={{
              y: window.innerHeight + 20,
              x: (randomEndX - randomStartX) * 2,
              rotate: 360,
              scale: [0, 1, 1, 0]
            }}
            transition={{
              duration: randomDuration,
              delay: randomDelay,
              ease: 'easeOut',
              scale: {
                times: [0, 0.1, 0.9, 1],
                duration: randomDuration
              }
            }}
          />
        );
      })}
    </div>
  );
};

// Hook pour animations fluides
export const useOptimizedAnimation = () => {
  const shouldReduceMotion = useReducedMotion();
  
  // Spring optimisé pour les micro-interactions
  const spring = useSpring(0, {
    stiffness: 300,
    damping: 30,
    mass: 1
  });

  const rotate = useTransform(spring, [0, 1], [0, 360]);
  const scale = useTransform(spring, [0, 0.5, 1], [1, 1.1, 1]);

  const triggerAnimation = () => {
    if (!shouldReduceMotion) {
      spring.set(1);
      setTimeout(() => spring.set(0), 500);
    }
  };

  return {
    spring,
    rotate,
    scale,
    triggerAnimation,
    shouldReduceMotion
  };
};
