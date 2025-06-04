
# Types KIKADI

Ce dossier contient **tous les types partagés** entre le frontend, les stores Zustand et les services Supabase.

## Organisation

### 📁 Fichiers

- **`models.ts`** - Entités métier principales (User, Game, Player, etc.)
- **`enums.ts`** - Énumérations et types union (GamePhase, GameMode, etc.)
- **`inputs.ts`** - Types d'input pour les interactions Supabase
- **`game.ts`** - Types spécifiques aux phases de jeu (legacy, à migrer)
- **`index.ts`** - Export centralisé de tous les types
- **`ui.ts`** - Types spécifiques à l'interface utilisateur

### 🔧 Conventions

1. **Nouveaux types** : Toute nouvelle entité doit être déclarée dans `models.ts`
2. **Énumérations** : Ajouter les types union dans `enums.ts`
3. **Inputs Supabase** : Créer les types d'input correspondants dans `inputs.ts`
4. **Exports** : Toujours exporter depuis `index.ts`

### 🏗️ Intégration Supabase

- Les types sont conçus pour être compatibles avec Supabase
- Les commentaires `// RLS:` indiquent les contraintes de sécurité anticipées
- Les champs `readonly` correspondent aux champs auto-générés par Supabase

### 📋 Exemples d'usage

```typescript
// Import depuis le point d'entrée centralisé
import { Game, Player, NewGameInput } from '@/types';

// Utilisation dans un service
const createGame = (input: NewGameInput): Promise<Game> => {
  // ...
}

// Utilisation dans un store
interface GameState {
  currentGame: Game | null;
  players: Player[];
}
```

### 🚀 Migration des anciens types

Les types dans `game.ts` et autres fichiers seront progressivement migrés vers cette structure centralisée.
