
/**
 * Export centralisé des hooks de phase pour KIKADI
 * Facilite l'import et la maintenance des hooks spécialisés
 */

export { useIntroPhaseLogic } from './useIntroPhaseLogic';
export { useQuestionPhaseLogic } from './useQuestionPhaseLogic';
export { useVotingPhaseLogic } from './useVotingPhaseLogic';
export { useRevealPhaseLogic } from './useRevealPhaseLogic';
export { useResultPhaseLogic } from './useResultPhaseLogic';

/**
 * Types des hooks de phase pour faciliter le typage
 */
export type PhaseHook = 
  | ReturnType<typeof useIntroPhaseLogic>
  | ReturnType<typeof useQuestionPhaseLogic>
  | ReturnType<typeof useVotingPhaseLogic>
  | ReturnType<typeof useRevealPhaseLogic>
  | ReturnType<typeof useResultPhaseLogic>;
