
# 🏗️ Architecture KIKADI - Refactoring Game.tsx

## 📋 Vue d'ensemble

Le fichier `Game.tsx` a été entièrement refactorisé pour suivre les bonnes pratiques KIKADI :
- **Séparation claire** entre logique métier et présentation
- **Architecture modulaire** avec composants spécialisés
- **Préparation Supabase** avec des hooks centralisés
- **Performance optimisée** avec lazy loading et animations

## 🧩 Structure des composants

### `/src/pages/Game.tsx` (Composant principal)
**Responsabilités :**
- UI pure, aucune logique métier
- Layout global (header, timer, progression XP)
- Délégation vers `useGameLogic()` pour toute la logique
- Gestion des états de chargement

**Props/State :**
- Aucun `useState` local (tout vient du store)
- Uniquement des handlers fournis par le hook

### `/src/hooks/useGameLogic.ts` (Hook principal)
**Responsabilités :**
- Centralisation de toute la logique métier
- Gestion des phases et transitions
- Actions joueur (réponses, votes, réactions)
- Interface avec les stores (Zustand)
- Préparation pour l'intégration Supabase

**Exports principaux :**
```typescript
{
  // État
  gameId, currentGame, currentPhase, players, ...
  
  // Actions  
  handleSubmitAnswer, handleSubmitVote, handleReaction,
  
  // Utilitaires
  canAdvancePhase, ConfettiComponent, ShakeWrapper
}
```

## 📚 Hooks métier

### Hook principal
- **`useGameLogic()`** - Hook maître gérant toute la logique de partie
  - Centralise les interactions utilisateur
  - Gère les transitions de phase
  - Interface avec tous les autres hooks spécialisés

### Hooks spécialisés
- **`useGamePhases()`** - Gestion des transitions de phase  
  - Validation des passages de phase
  - Logique spécifique par mini-jeu
  - Vérification des conditions (tous les joueurs ont répondu, etc.)

- **`useGameStore()`** - État global Zustand
  - Données de partie, joueurs, phase courante
  - Actions de mutation d'état
  - Synchronisation temps réel (prévu)

- **`useXPProgression()`** - Système d'expérience
  - Attribution de points selon les actions
  - Calcul de niveau et progression
  - Récompenses de fin de partie

- **`useVisualEffects()`** - Animations et effets
  - Confettis, shake, transitions
  - Effets achetés en boutique (prévu)
  - Feedback visuel des actions

### Hooks utilitaires
- **`useParams()`** - Récupération du gameId depuis l'URL
- **`useNavigate()`** - Navigation React Router
- **`useDevMode()`** - Mode développeur avec bots (prévu)

## 🎯 Phases de jeu

### Cycle complet d'une manche :

| Phase | Description | Durée | Actions joueur |
|-------|-------------|-------|----------------|
| **intro** | Présentation du mini-jeu et règles | 10s | Lecture des règles |
| **answering** | Saisie de la réponse à la question | 60s | Taper sa réponse |
| **voting** | Vote/choix selon le mini-jeu | 30s | Voter pour une option |
| **revealing** | Révélation des résultats | 15s | Envoyer des réactions emoji |
| **result** | Affichage des scores de manche | 10s | Voir le classement |

### Transitions automatiques :
- **intro** → **answering** : Automatique après 10s ou clic host
- **answering** → **voting** : Quand tous les joueurs ont répondu
- **voting** → **revealing** : Quand tous les joueurs ont voté
- **revealing** → **result** : Automatique après révélation
- **result** → **intro** (manche suivante) ou **Results** (fin de partie)

## 🎮 Composants de phases

### `/src/components/game/phases/`

Chaque phase est un composant isolé et réutilisable :

1. **`IntroPhase.tsx`** - Introduction du mini-jeu
2. **`QuestionPhase.tsx`** - Saisie de réponse
3. **`ActionPhase.tsx`** - Vote/Action selon le mini-jeu  
4. **`RevealPhase.tsx`** - Révélation des résultats
5. **`ScorePhase.tsx`** - Affichage des scores

**Props communes :**
```typescript
interface PhaseProps {
  miniJeu: MiniGameType;
  roundNumber: number;
  totalRounds: number;
  players: PlayerState[];
  // + props spécifiques selon la phase
}
```

### `/src/components/game/GamePhaseRenderer.tsx`
**Responsabilités :**
- Routage dynamique vers le bon composant de phase
- Gestion des transitions animées (`AnimatePresence`)
- Lazy loading avec fallback
- Props forwarding vers les composants enfants

## 🔄 Flux de données

```
Game.tsx (UI) 
    ↓ useGameLogic()
GameStore (Zustand) ← → Supabase (TODO)
    ↓ GamePhaseRenderer
Phase Components
```

### Exemple de flux :
1. **User action** → Handler dans `useGameLogic`
2. **Hook logic** → Update du `gameStore` 
3. **Store change** → Re-render automatique du composant
4. **Phase change** → `GamePhaseRenderer` affiche le nouveau composant

## 🔌 Préparation Supabase

### Services prévus à implémenter :

#### `/src/services/supabase/gameService.ts`
```typescript
// TODO: Implémenter les méthodes suivantes
export const gameService = {
  loadGame: (gameId: string) => Promise<Game>,
  updateGamePhase: (gameId: string, phase: GamePhase) => Promise<void>,
  resetGame: (gameId: string) => Promise<void>
};
```

#### `/src/services/supabase/playerService.ts`  
```typescript
// TODO: Implémenter les méthodes suivantes
export const playerService = {
  submitAnswer: (gameId: string, playerId: string, answer: string) => Promise<void>,
  submitVote: (gameId: string, playerId: string, targetId: string) => Promise<void>,
  sendReaction: (gameId: string, playerId: string, emoji: string) => Promise<void>
};
```

#### `/src/services/supabase/realtimeService.ts`
```typescript
// TODO: Implémenter les méthodes suivantes  
export const realtimeService = {
  subscribeToGame: (gameId: string, callback: Function) => RealtimeChannel,
  unsubscribeFromGame: (channel: RealtimeChannel) => void
};
```

### Points d'intégration critiques :

#### Dans `useGameLogic.ts` :
- **Ligne 47** : `TODO: Charger la partie depuis Supabase`
- **Ligne 65** : `TODO: Utiliser playerService.submitAnswer(answer)`
- **Ligne 85** : `TODO: Utiliser playerService.submitVote(targetId)`  
- **Ligne 105** : `TODO: Utiliser playerService.sendReaction(emoji)`
- **Ligne 125** : `TODO: Synchroniser avec gameService.updateGamePhase()`

#### Tables Supabase concernées :
- `games` - État de la partie
- `players` - Joueurs connectés  
- `rounds` - Données de manche
- `answers` - Réponses des joueurs
- `votes` - Votes des joueurs

## 🧪 Tests et Debug

### Data attributes pour les tests :
- `data-testid="intro-phase"`
- `data-testid="question-phase"`  
- `data-testid="action-phase"`
- `data-testid="reveal-phase"`
- `data-testid="score-phase"`
- `data-testid="game-header"`
- `data-testid="back-button"`

### Debug panel (développement) :
Affiché en bas à gauche en mode dev :
- Phase courante
- Nombre de joueurs
- État `canAdvancePhase`

## ⚡ Performance

### Optimisations implémentées :
- **Composants de phases** : Pas de lazy loading nécessaire car légers (< 200 lignes chacun)
- **AnimatePresence** pour les transitions fluides  
- **Memoization** des handlers avec `useCallback`
- **État minimal** dans le composant UI
- **Suspense** avec fallback personnalisé

### Décision sur le lazy loading :
Les composants de phases (`IntroPhase`, `QuestionPhase`, etc.) ne nécessitent **PAS** de lazy loading car :
- Chaque composant fait moins de 200 lignes
- Pas d'imports lourds (pas de lib externe complexe)
- Déjà optimisés avec `AnimatePresence` 
- Le gain de performance serait négligeable vs la complexité ajoutée

### Métriques cibles :
- **Temps de rendu** < 16ms par phase
- **Bundle size** optimisé par phase
- **Animations** 60fps constants

## 🚀 Prochaines étapes

1. **Intégration Supabase complète**
2. **Tests unitaires** de tous les hooks
3. **Tests d'intégration** des flux complets  
4. **Optimisation** des re-renders avec React.memo
5. **PWA features** (notifications, offline)

---

Cette architecture modulaire garantit la **maintenabilité**, la **scalabilité** et la **testabilité** du code KIKADI tout en préparant l'intégration backend complète.
