
/**
 * Hook legacy pour la compatibilité
 * Redirige vers la nouvelle structure modulaire
 * 
 * @deprecated Utilisez directement les hooks spécialisés de playerActions/
 */

export { usePlayerActions, type PlayerActionsReturn } from './playerActions';

// Re-exports pour compatibilité
export { useSubmitAnswer } from './playerActions/useSubmitAnswer';
export { useCastVote } from './playerActions/useCastVote';
export { usePlayerPing } from './playerActions/usePlayerPing';
export { usePlayerReport } from './playerActions/usePlayerReport';
