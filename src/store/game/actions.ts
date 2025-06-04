
import type { StateCreator } from 'zustand';
import { User, Game, Player, GamePhase } from '@/types/models';
import { GameState } from './state';

/**
 * Interface pour les actions du store de jeu
 * Contient toutes les fonctions de mutation d'état
 */
export interface GameActions {
  // === Actions utilisateur ===
  /** 
   * Définit l'utilisateur actuel 
   * @param user - L'utilisateur à définir ou null pour déconnexion
   */
  setCurrentUser: (user: User | null) => void;
  
  /** 
   * Met à jour le nombre de pièces de l'utilisateur 
   * @param newAmount - Le nouveau montant de pièces
   */
  updateUserCoins: (newAmount: number) => void;
  
  /** 
   * Met à jour l'XP de l'utilisateur 
   * @param newXP - La nouvelle valeur d'XP
   */
  updateUserXP: (newXP: number) => void;
  
  // === Actions partie ===
  /** 
   * Définit la partie courante 
   * @param game - La partie à définir ou null pour quitter
   */
  setCurrentGame: (game: Game | null) => void;
  
  // === Actions joueurs ===
  /** 
   * Remplace complètement la liste des joueurs 
   * @param players - La nouvelle liste de joueurs
   */
  setPlayers: (players: Player[]) => void;
  
  /** 
   * Ajoute un joueur à la partie 
   * @param player - Le joueur à ajouter
   */
  addPlayer: (player: Player) => void;
  
  /** 
   * Supprime un joueur de la partie 
   * @param playerId - L'ID du joueur à supprimer
   */
  removePlayer: (playerId: string) => void;
  
  /** 
   * Met à jour les propriétés d'un joueur 
   * @param playerId - L'ID du joueur à mettre à jour
   * @param updates - Les propriétés à modifier
   */
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  
  // === Actions flow de jeu ===
  /** 
   * Change la phase courante de la partie 
   * @param phase - La nouvelle phase
   */
  setCurrentPhase: (phase: GamePhase) => void;
  
  /** 
   * Change le numéro de manche courante 
   * @param round - Le nouveau numéro de manche
   */
  setCurrentRound: (round: number) => void;
  
  /** 
   * Met à jour le temps restant pour la phase 
   * @param time - Le temps en secondes
   */
  setTimeRemaining: (time: number) => void;
  
  /** 
   * Définit si l'utilisateur actuel est host 
   * @param isHost - true si host, false sinon
   */
  setIsHost: (isHost: boolean) => void;
  
  // === Actions temps réel ===
  /** 
   * Met à jour le statut de connexion 
   * @param connected - true si connecté, false sinon
   */
  setIsConnected: (connected: boolean) => void;
  
  // === Actions boutique ===
  /** 
   * Ajoute un objet à l'inventaire de l'utilisateur 
   * @param itemId - L'ID de l'objet acheté
   */
  addToInventory: (itemId: string) => void;
  
  // === Actions utilitaires ===
  /** Réinitialise complètement l'état de la partie */
  resetGameState: () => void;
  
  /** Passe à la phase suivante (logique basique) */
  nextPhase: () => void;
  
  /** Réinitialise complètement le store */
  resetGame: () => void;
}

/**
 * Créateur d'actions pour le store de jeu
 * Implémente toutes les mutations d'état
 */
export const createGameActions: StateCreator<
  GameState & GameActions,
  [],
  [],
  GameActions
> = (set, get) => ({
  // === Actions utilisateur ===
  setCurrentUser: (user) => set({ currentUser: user }),
  
  updateUserCoins: (newAmount) => set((state) => ({
    currentUser: state.currentUser ? { 
      ...state.currentUser, 
      pieces: newAmount 
    } : null
  })),
  
  updateUserXP: (newXP) => set((state) => ({
    currentUser: state.currentUser ? { 
      ...state.currentUser, 
      xp: newXP 
    } : null
  })),
  
  // === Actions partie ===
  setCurrentGame: (game) => set({ currentGame: game }),
  
  // === Actions joueurs ===
  setPlayers: (players) => set({ players }),
  
  addPlayer: (player) => set((state) => ({
    players: [...state.players, player]
  })),
  
  removePlayer: (playerId) => set((state) => ({
    players: state.players.filter(p => p.id !== playerId)
  })),
  
  updatePlayer: (playerId, updates) => set((state) => ({
    players: state.players.map(p => 
      p.id === playerId ? { ...p, ...updates } : p
    )
  })),
  
  // === Actions flow de jeu ===
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  
  setCurrentRound: (round) => set({ currentRound: round }),
  
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  
  setIsHost: (isHost) => set({ isHost }),
  
  // === Actions temps réel ===
  setIsConnected: (connected) => set({ isConnected: connected }),
  
  // === Actions boutique ===
  addToInventory: (itemId) => set((state) => ({
    inventory: [...state.inventory, itemId]
  })),
  
  // === Actions utilitaires ===
  resetGameState: () => set({
    currentGame: null,
    players: [],
    currentPhase: 'intro',
    currentRound: 1,
    timeRemaining: 0,
    isConnected: false
  }),
  
  nextPhase: () => {
    const { currentPhase } = get();
    const phases: GamePhase[] = [
      'intro', 'answering', 'voting', 'revealing', 'result', 'transition'
    ];
    const currentIndex = phases.indexOf(currentPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    set({ currentPhase: phases[nextIndex] });
  },
  
  resetGame: () => {
    set({
      currentGame: null,
      players: [],
      currentPhase: 'intro',
      currentRound: 1,
      timeRemaining: 0,
      isConnected: false
    });
  }
});
