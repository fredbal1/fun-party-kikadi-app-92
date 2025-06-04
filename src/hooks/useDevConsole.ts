
import { useState } from 'react';

/**
 * Hook pour gérer l'affichage de la console de développement
 */
export const useDevConsole = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    toggle,
    open,
    close
  };
};
