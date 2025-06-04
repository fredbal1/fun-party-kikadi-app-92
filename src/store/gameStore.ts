
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Game, Player, GamePhase } from '@/types/models';

/**
 * Interface pour l'état du store de jeu
 * Contient uniquement les données, sans les actions
 */
interface GameState {
  // === État utilisateur ===
  /** Utilisateur actuellement connecté */
  currentUser: User | null;
  
  // === État de la partie ===
  /** Partie en cours */
  currentGame: Game | null;
  /** Liste des joueurs dans la partie */
  players: Player[];
  
  // === État du flow de jeu ===
  /** Phase actuelle de la partie */
  currentPhase: GamePhase;
  /** Numéro de la manche courante */
  currentRound: number;
  /** Temps restant pour la phase courante (en secondes) */
  timeRemaining: number;
  /** L'utilisateur actuel est-il le host de la partie */
  isHost: boolean;
  
  // === État temps réel ===
  /** Statut de la connexion Supabase realtime */
  isConnected: boolean;
  
  // === État boutique ===
  /** Liste des IDs d'objets possédés par l'utilisateur */
  inventory: string[];
}

/**
 * Interface pour les actions du store de jeu
 * Contient toutes les fonctions de mutation d'état
 */
interface GameActions {
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
  
  // === Actions futures (préparation Supabase) ===
  // TODO: Intégrer avec Supabase
  /** 
   * Charge une partie depuis la base de données 
   * @param gameId - L'ID de la partie à charger
   */
  // fetchGameFromDb: (gameId: string) => Promise<void>;
  
  /** 
   * Synchronise les scores avec Supabase 
   */
  // syncScoresToDb: () => Promise<void>;
  
  /** 
   * S'abonne aux mises à jour temps réel via Supabase 
   * @param gameId - L'ID de la partie à suivre
   */
  // subscribeToGameUpdates: (gameId: string) => () => void;
  
  // === Actions bots (préparation) ===
  // TODO: Intégrer la logique des bots
  /** 
   * Simule une réponse de bot pour la phase courante 
   * @param botId - L'ID du bot qui répond
   */
  // simulateBotResponse: (botId: string) => void;
  
  /** 
   * Déclenche un vote automatique de bot 
   * @param botId - L'ID du bot qui vote
   */
  // triggerBotVote: (botId: string) => void;
}

/**
 * Store principal pour la gestion des parties KIKADI
 * 
 * Utilise Zustand avec middleware devtools et persist
 * Sépare clairement l'état des actions pour une meilleure maintenabilité
 */
export const useGameStore = create<GameState & GameActions>()(
  devtools(
    persist(
      (set, get) => ({
        // ==========================================
        // ÉTAT INITIAL
        // ==========================================
        
        // État utilisateur
        currentUser: null,
        
        // État partie
        currentGame: null,
        players: [],
        
        // État flow de jeu
        currentPhase: 'intro',
        currentRound: 1,
        timeRemaining: 0,
        isHost: false,
        
        // État temps réel
        isConnected: false,
        
        // État boutique
        inventory: [],
        
        // ==========================================
        // ACTIONS
        // ==========================================
        
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
      }),
      {
        name: 'kikadi-game-store',
        // Persister seulement certaines parties du state
        partialize: (state) => ({
          currentUser: state.currentUser,
          inventory: state.inventory,
          // Ne pas persister l'état de la partie en cours pour éviter les conflits
        }),
      }
    ),
    {
      name: 'KIKADI Game Store',
    }
  )
);

/**
 * Types utilitaires pour l'export
 */
export type { GameState, GameActions };

/**
 * Sélecteur pour récupérer tout le state (à éviter en production)
 * Utilisez plutôt les sélecteurs atomiques de gameSelectors.ts
 */
export const useFullGameState = () => useGameStore();
