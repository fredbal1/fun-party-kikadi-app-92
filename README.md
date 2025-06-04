
# 🎮 KIKADI - Le jeu social qui crée du lien

![CI](https://github.com/fredbal1/fun-party-kikadi-app-06/actions/workflows/ci.yml/badge.svg)
[![Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4.svg)](https://lovable.dev)

## 📋 À propos du projet

**KIKADI** est un jeu mobile multijoueur de type soirée/party game, composé de mini-jeux funs et interactifs jouables de **3 à 8 joueurs**. 

### 🎯 Mini-jeux disponibles :
- **🧠 KiKaDi** - Devinez qui a dit quoi
- **🤔 KiDiVrai** - Vrai ou Faux  
- **👥 KiDeNous** - Qui est le plus susceptible de...
- **🎯 KiDéjà** - Qui a déjà fait ça ?

### 🎮 Modes de jeu :
- **Classique** - Mode standard
- **Bluff** - Avec possibilité de mentir
- **Mixte** - Combine les deux modes

### 🌟 Ambiances :
- **Safe** - Questions familiales
- **Intime** - Questions plus personnelles
- **No Filter** - Questions sans tabou

---

## 📐 Architecture Technique

L'architecture KIKADI repose sur une **séparation stricte** entre :
- **UI** (composants React purs)
- **Logique métier** (hooks spécialisés) 
- **État global** (stores Zustand avec sélecteurs atomiques)
- **Accès aux données** (services Supabase préparés)

📖 **Documentation complète** : [`/docs/README_ARCHITECTURE.md`](./docs/README_ARCHITECTURE.md)

### 🧩 Modules principaux :
- **`/store/game/`** - État global avec middleware Zustand
- **`/hooks/phases/`** - Logique métier par phase de jeu
- **`/services/supabase/`** - Services de données (prêts pour intégration)
- **`/components/game/`** - Interface utilisateur découplée

---

## 🚀 Développement local

### Prérequis
- Node.js 18+ et npm
- Git

### Installation

```bash
# 1. Cloner le repository
git clone <YOUR_GIT_URL>
cd kikadi

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

### 📜 Scripts disponibles

```bash
# 🔥 Développement
npm run dev              # Lance le serveur de développement (http://localhost:8080)

# 🏗️ Build & Production
npm run build            # Compile l'application pour la production
npm run preview          # Prévisualise le build de production

# 🧪 Tests
npm run test             # Lance les tests en mode watch
npm run test:ci          # Lance les tests une fois (pour CI)
npm run test:coverage    # Lance les tests avec couverture de code
npm run test:ui          # Interface graphique des tests Vitest

# 🎨 Qualité de code
npm run lint             # Vérifie le code avec ESLint
npm run format           # Formate le code avec Prettier
npm run format:check     # Vérifie le formatage sans modifier
npm run type-check       # Vérification des types TypeScript
```

---

## 🧪 Tests

Le projet utilise **Vitest** avec **Testing Library** pour les tests unitaires et d'intégration.

### Structure des tests
- **`__tests__/hooks/`** - Tests des hooks métier (logique de jeu, phases, actions joueur)
- **`__tests__/stores/`** - Tests des stores Zustand (état global, mutations)
- **`__tests__/components/`** - Tests d'intégration UI
- **`src/test/setup.ts`** - Configuration globale des tests
- **`vitest.config.ts`** - Configuration Vitest avec support JSX

### Coverage cible
- **Hooks métier** : 90%+ (logique critique)
- **Stores** : 95%+ (mutations d'état)
- **Services** : 80%+ (prêts pour l'intégration Supabase)

### TODO en cours
- ✅ Tests bots et synchronisation des phases
- ✅ Tests d'intégration temps réel (Supabase)
- ✅ Tests de performance (rendu < 16ms par phase)

### Écrire un test

```typescript
// __tests__/hooks/useGameLogic.test.tsx
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGameLogic } from '@/hooks/useGameLogic'

describe('useGameLogic', () => {
  it('should handle answer submission correctly', () => {
    const { result } = renderHook(() => useGameLogic())
    
    expect(result.current.handleSubmitAnswer).toBeDefined()
    expect(typeof result.current.canAdvancePhase).toBe('function')
  })
})
```

---

## 🐛 Known Issues & Résolutions

### ✅ Erreurs corrigées récemment

#### Types d'export incorrects
- **Problème** : `SyntaxError: GameStoreState not exported`
- **Cause** : Alias de type incorrect dans `/store/game/index.ts`
- **Solution** : Utilisation de `export type { GameState }` au lieu d'alias inutiles

#### Configuration Testing Library
- **Problème** : Erreurs `@testing-library/jest-dom` non reconnues
- **Solution** : Configuration correcte dans `/src/types/testing.d.ts`

#### Imports circulaires
- **Prévention** : Structure avec points d'entrée uniques (`index.ts`) dans chaque module

### 🔧 Debugging des types
Si vous rencontrez des erreurs TypeScript :
1. Vérifiez `/src/types/` pour les définitions
2. Contrôlez les exports dans les `index.ts`
3. Évitez les alias de types sans raison explicite

---

## 📦 Stack technique

### 🔧 Framework & Build
- **React 18** - Bibliothèque UI avec hooks spécialisés
- **TypeScript** - Typage statique strict
- **Vite** - Build tool et serveur de développement
- **Tailwind CSS** - Framework CSS utility-first

### 🎨 UI & Animations
- **shadcn/ui** - Composants UI réutilisables et accessibles
- **Radix UI** - Primitives accessibles
- **Framer Motion** - Animations fluides (transitions de phase)
- **Lucide React** - Icônes modernes

### 🧠 State Management & Data
- **Zustand** - Gestion d'état global avec middleware
- **Sélecteurs atomiques** - Optimisation des re-rendus
- **Supabase** - Backend as a Service (intégration préparée)
- **TanStack Query** - Cache et synchronisation (prêt pour Supabase)

### 🧪 Testing & Quality
- **Vitest** - Framework de test rapide
- **Testing Library** - Utilitaires de test React
- **ESLint** - Linter JavaScript/TypeScript
- **Prettier** - Formateur de code

---

## 📂 Structure du projet

```
src/
├── components/          # Composants React (UI pure)
│   ├── ui/             # Composants de base (shadcn/ui)
│   ├── game/           # Composants spécifiques au jeu
│   ├── games/          # Composants par mini-jeu
│   │   ├── kikadi/     # Mini-jeu KiKaDi
│   │   ├── kidivrai/   # Mini-jeu KiDiVrai
│   │   ├── kidenous/   # Mini-jeu KiDeNous
│   │   └── kideja/     # Mini-jeu KiDéjà
│   └── animations/     # Composants d'animation
├── hooks/              # Hooks React (logique métier)
│   ├── phases/         # Hooks spécialisés par phase
│   └── playerActions/  # Actions joueur modulaires
├── store/              # Stores Zustand (état global)
│   ├── game/          # Store principal du jeu
│   └── selectors/     # Sélecteurs atomiques optimisés
├── services/           # Services de données (Supabase)
├── types/              # Définitions TypeScript centralisées
└── constants/          # Constantes et configuration
```

---

## 🔧 Configuration

### Variables d'environnement
Créer un fichier `.env.local` :
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### PWA
- `public/manifest.json` - Manifest de l'application
- `public/sw.js` - Service Worker
- `public/robots.txt` - Configuration SEO

---

## 🚢 Déploiement

### Via Lovable
1. Cliquer sur **Publish** dans l'interface Lovable
2. L'application sera déployée automatiquement

### Via GitHub Actions
Le pipeline CI/CD se déclenche automatiquement sur :
- Push vers `main`, `master`, ou `develop`
- Pull requests vers ces branches

---

## 🤝 Contribution

### Standards de code
- **Architecture** : Respecter la séparation UI/Hooks/Store/Services
- **Types** : Utiliser les définitions centralisées dans `/types/`
- **Tests** : Couvrir les hooks et stores critiques
- **Documentation** : Maintenir les JSDoc à jour

### Workflow de développement
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Respecter l'architecture modulaire existante
4. Ajouter des tests pour les nouvelles fonctionnalités
5. Mettre à jour la documentation si nécessaire
6. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🔗 Liens utiles

- **Documentation Architecture** : [`/docs/README_ARCHITECTURE.md`](./docs/README_ARCHITECTURE.md)
- **Projet Lovable** : [https://lovable.dev/projects/14dfe1f3-1f04-430d-92e5-398616247d1b](https://lovable.dev/projects/14dfe1f3-1f04-430d-92e5-398616247d1b)
- **Supabase Docs** : [https://supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS** : [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **shadcn/ui** : [https://ui.shadcn.com/](https://ui.shadcn.com/)

---

💡 **Développé avec ❤️ sur [Lovable](https://lovable.dev)**
