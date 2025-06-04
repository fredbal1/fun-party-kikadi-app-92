
# 🏗️ Architecture Technique KIKADI

## 📋 Vue d'ensemble

Le projet KIKADI suit une architecture modulaire stricte basée sur la séparation des responsabilités, optimisée pour la scalabilité et la maintenabilité d'un jeu multijoueur temps réel.

```
📦 Architecture KIKADI
├── src/
│   ├── store/                      # État global (Zustand)
│   │   ├── game/
│   │   │   ├── state.ts           # Définition GameState (interface principale)
│   │   │   ├── actions.ts         # Mutations d'état GameActions
│   │   │   ├── middleware.ts      # Persist + DevTools
│   │   │   └── index.ts          # Point d'entrée unifié
│   │   ├── authStore.ts          # Authentification utilisateur
│   │   └── uiStore.ts            # État interface utilisateur
│   │
│   ├── hooks/                     # Logique métier réutilisable
│   │   ├── phases/               # Hooks spécialisés par phase
│   │   │   ├── useIntroPhaseLogic.ts
│   │   │   ├── useQuestionPhaseLogic.ts
│   │   │   ├── useVotingPhaseLogic.ts
│   │   │   ├── useRevealPhaseLogic.ts
│   │   │   └── useResultPhaseLogic.ts
│   │   ├── playerActions/        # Actions joueur modulaires
│   │   │   ├── useSubmitAnswer.ts
│   │   │   ├── useCastVote.ts
│   │   │   ├── usePlayerPing.ts
│   │   │   └── usePlayerReport.ts
│   │   ├── useGameLogic.ts       # Hook orchestrateur principal
│   │   ├── useGamePhases.ts      # Transitions entre phases
│   │   └── useXPProgression.ts   # Système d'expérience
│   │
│   ├── services/                 # Accès données (Supabase uniquement)
│   │   ├── supabase/
│   │   │   ├── gameService.ts
│   │   │   ├── playerService.ts
│   │   │   ├── questionService.ts
│   │   │   ├── roundService.ts
│   │   │   └── voteService.ts
│   │   └── gameService.ts        # Service principal préparé
│   │
│   ├── components/               # Interface utilisateur pure
│   │   ├── ui/                  # Composants de base (shadcn/ui)
│   │   ├── game/                # Composants spécifiques au jeu
│   │   │   ├── phases/         # Composants par phase
│   │   │   └── GamePhaseRenderer.tsx
│   │   ├── games/              # Mini-jeux spécialisés
│   │   │   ├── kikadi/
│   │   │   ├── kidivrai/
│   │   │   ├── kidenous/
│   │   │   └── kideja/
│   │   └── animations/         # Effets visuels
│   │
│   ├── types/                   # Définitions TypeScript centralisées
│   │   ├── models.ts           # Entités métier (User, Game, Player...)
│   │   ├── enums.ts            # Énumérations (GamePhase, MiniGame...)
│   │   ├── inputs.ts           # Types de formulaires
│   │   └── testing.d.ts        # Types pour les tests
│   │
│   └── constants/              # Configuration et constantes
       ├── gamePhases.ts       # Phases par mini-jeu
       └── performance.ts      # Seuils de performance
```

## 🧠 Principes Structurants

### 1. **Séparation stricte des responsabilités**
- **Composants UI** : Affichage uniquement, aucune logique métier
- **Hooks** : Logique métier et orchestration
- **Stores** : État global centralisé
- **Services** : Communication avec Supabase

### 2. **Zéro mock, préparation production**
- Tous les hooks sont prêts pour l'intégration Supabase
- Aucune donnée factice dans le code de production
- Services documentés avec implémentation TODO clairement marquée

### 3. **Types centralisés et cohérents**
- **Règle critique** : Jamais d'alias de type sans raison explicite
- Interface `GameState` dans `state.ts` → Ne PAS renommer en `GameStoreState`
- Tous les types métier dans `/types/models.ts`

### 4. **Architecture testable**
- Chaque hook est testable indépendamment
- Services isolés pour mocking facile
- Composants découplés de la logique

## 🔄 Flux de Données

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Composants    │───▶│      Hooks       │───▶│     Stores      │
│   (UI pure)     │    │  (Logique métier)│    │ (État global)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        │
                       ┌──────────────────┐              │
                       │    Services      │◀─────────────┘
                       │   (Supabase)     │
                       └──────────────────┘
```

### Exemple concret :
1. **User action** → `Game.tsx` appelle `useGameLogic().handleSubmitAnswer()`
2. **Hook logic** → `useGameLogic` valide et appelle `gameService.savePlayerAnswer()`
3. **Service call** → `gameService` communique avec Supabase
4. **State update** → Service met à jour le `gameStore` via actions
5. **UI update** → Composants se re-rendent automatiquement

## 🎮 Gestion des Phases de Jeu

### Architecture modulaire par phase
Chaque phase possède son propre hook spécialisé dans `/hooks/phases/` :

- **`useIntroPhaseLogic`** - Présentation des règles
- **`useQuestionPhaseLogic`** - Saisie des réponses
- **`useVotingPhaseLogic`** - Système de vote
- **`useRevealPhaseLogic`** - Révélation des résultats
- **`useResultPhaseLogic`** - Calcul et affichage des scores

### Hook orchestrateur
**`useGameLogic`** centralise et route les actions vers le bon hook de phase :
```typescript
const handleSubmitAnswer = (answer: string) => {
  switch (currentPhase) {
    case 'answering':
      return questionLogic.submitAnswer(answer);
    default:
      console.warn('Wrong phase for answer submission');
  }
};
```

## 📊 Store Management (Zustand)

### Structure du GameStore
```typescript
// État (state.ts)
interface GameState {
  currentUser: User | null;
  currentGame: Game | null;
  players: Player[];
  currentPhase: GamePhase;
  currentRound: number;
  timeRemaining: number;
  isHost: boolean;
  isConnected: boolean;
  inventory: string[];
}

// Actions (actions.ts)
interface GameActions {
  setCurrentUser: (user: User | null) => void;
  setCurrentGame: (game: Game | null) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  // ... autres mutations
}
```

### Sélecteurs atomiques optimisés
Dans `/store/selectors/gameSelectors.ts` :
```typescript
// Évite les re-rendus inutiles en souscrivant uniquement aux données nécessaires
export const usePlayers = () => useGameStore(state => state.players);
export const useCurrentPhase = () => useGameStore(state => state.currentPhase);
export const useCurrentGame = () => useGameStore(state => state.currentGame);
```

## 🔌 Intégration Supabase (Préparée)

### Services documentés et prêts
Tous les services dans `/services/supabase/` sont **documentés** mais **non implémentés** :

```typescript
// gameService.ts - Exemple
/**
 * Met à jour une partie dans Supabase
 * TODO: Implémenter avec supabase.from('games').update()
 */
static async updateGameInDb(gameId: UUID, updates: Partial<Game>): Promise<boolean> {
  console.log('💾 [GameService] Mise à jour partie:', gameId, updates);
  // TODO: Intégrer avec Supabase
  return false;
}
```

### Points d'intégration critiques
Dans les hooks, des commentaires `TODO` marquent précisément où Supabase doit être intégré :
- **useGameLogic.ts ligne 65** : `TODO: Utiliser playerService.submitAnswer()`
- **useGameLogic.ts ligne 85** : `TODO: Utiliser playerService.submitVote()`
- **useGameLogic.ts ligne 125** : `TODO: Synchroniser avec gameService.updateGamePhase()`

## 🧪 Architecture de Tests

### Structure recommandée
```
__tests__/
├── hooks/                    # Tests des hooks métier
│   ├── useGameLogic.test.tsx
│   ├── useGamePhases.test.tsx
│   └── playerActions/
├── stores/                   # Tests des stores
│   └── gameStore.test.tsx
├── services/                 # Tests des services (avec mocks)
│   └── gameService.test.tsx
└── components/              # Tests d'intégration UI
    └── Game.test.tsx
```

### Configuration Vitest
- **Framework** : Vitest + Testing Library
- **Types** : Configuration dans `/src/types/testing.d.ts`
- **Setup** : Matchers étendus dans `/src/test/setup.ts`

## ⚠️ Erreurs Connues Corrigées

### 1. Alias de types incorrects
**Problème** : Export `GameState as GameStoreState` dans `index.ts`
**Solution** : Utiliser `export type { GameState }` directement
**Règle** : Ne jamais aliasser un type sans raison explicite

### 2. Types Testing Library
**Problème** : Référence incorrecte à `testing-library__jest-dom`
**Solution** : Configuration correcte dans `testing.d.ts`

### 3. Imports circulaires
**Prévention** : Structure claire avec points d'entrée uniques (`index.ts`)

## 🚀 Roadmap Technique

### Prochaines étapes prioritaires
1. **Intégration Supabase complète** - Remplacer tous les `TODO` par du code fonctionnel
2. **Tests complets** - Couvrir tous les hooks et services
3. **Optimisation** - React.memo sur les composants critiques
4. **PWA** - Service Worker et cache avancé

### Architecture future
- **Micro-frontend** : Chaque mini-jeu pourrait devenir un module indépendant
- **Real-time optimisé** : WebSockets personnalisés pour la latence critique
- **Monitoring** : Métriques de performance et erreurs en production

---

Cette architecture garantit la **maintenabilité**, la **scalabilité** et la **testabilité** du projet KIKADI tout en préparant l'intégration backend complète.
