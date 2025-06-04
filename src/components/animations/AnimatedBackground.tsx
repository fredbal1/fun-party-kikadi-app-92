
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedBackgroundProps {
  children: ReactNode;
  variant?: 'purple' | 'blue' | 'green' | 'orange';
  className?: string;
}

const backgroundVariants = {
  purple: 'from-purple-600 via-violet-500 to-indigo-600',
  blue: 'from-blue-500 via-cyan-500 to-teal-500',
  green: 'from-emerald-500 via-green-500 to-teal-500',
  orange: 'from-orange-500 via-amber-500 to-yellow-500'
};

export const AnimatedBackground = ({ 
  children, 
  variant = 'purple', 
  className = '' 
}: AnimatedBackgroundProps) => {
  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br ${backgroundVariants[variant]} relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
