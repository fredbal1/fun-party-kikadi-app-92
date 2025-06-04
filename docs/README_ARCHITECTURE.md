
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

## 🎯 Composants de phases

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

## 🛠️ Hooks utilisés

### Hooks principaux
- **`useGameLogic()`** - Logique métier centrale
- **`useGamePhases()`** - Gestion des transitions de phase  
- **`useGameStore()`** - État global Zustand
- **`useXPProgression()`** - Système d'expérience
- **`useVisualEffects()`** - Animations et effets

### Hooks utilitaires
- **`useParams()`** - Récupération du gameId
- **`useNavigate()`** - Navigation React Router

## 🔮 Intégration Supabase (TODO)

### Emplacements des TODO Supabase :

#### Dans `useGameLogic.ts` :
```typescript
// TODO: Charger la partie depuis Supabase
// TODO: Utiliser playerService.submitAnswer(answer)
// TODO: Utiliser playerService.submitVote(targetId)  
// TODO: Utiliser playerService.sendReaction(emoji)
```

#### Services à créer :
- **`gameService.loadGame(gameId)`** - Chargement de partie
- **`playerService.submitAnswer()`** - Envoi de réponse
- **`playerService.submitVote()`** - Envoi de vote
- **`realtimeService.subscribeToGame()`** - Écoute temps réel

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
- **Lazy loading** des composants de phase
- **AnimatePresence** pour les transitions fluides  
- **Memoization** des handlers avec `useCallback`
- **État minimal** dans le composant UI
- **Suspense** avec fallback personnalisé

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
