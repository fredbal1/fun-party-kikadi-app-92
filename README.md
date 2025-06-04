
# 🎮 KIKADI - Le jeu social qui crée du lien

[![CI/CD Pipeline](https://github.com/your-username/kikadi/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/kikadi/actions/workflows/ci.yml)
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

Le projet utilise **Vitest** pour les tests unitaires et d'intégration.

### Écrire un test

```typescript
// __tests__/example.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MonComposant from '@/components/MonComposant'

describe('MonComposant', () => {
  it('devrait afficher le titre', () => {
    render(
      <BrowserRouter>
        <MonComposant />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Titre attendu')).toBeInTheDocument()
  })
})
```

### Structure des tests
- `__tests__/` - Tests unitaires et d'intégration
- `src/test/setup.ts` - Configuration globale des tests
- `vitest.config.ts` - Configuration Vitest

### Couverture de code
```bash
npm run test:coverage
# Génère un rapport dans ./coverage/index.html
```

---

## 📦 Stack technique

### 🔧 Framework & Build
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et serveur de développement
- **Tailwind CSS** - Framework CSS utility-first

### 🎨 UI & Animations
- **shadcn/ui** - Composants UI réutilisables
- **Radix UI** - Primitives accessibles
- **Framer Motion** - Animations fluides
- **Lucide React** - Icônes modernes

### 🧠 State Management & Data
- **Zustand** - Gestion d'état global
- **Supabase** - Backend as a Service (BaaS)
- **TanStack Query** - Cache et synchronisation des données
- **React Hook Form** - Gestion des formulaires

### 🧪 Testing & Quality
- **Vitest** - Framework de test
- **Testing Library** - Utilitaires de test React
- **ESLint** - Linter JavaScript/TypeScript
- **Prettier** - Formateur de code

### 📱 Mobile & PWA
- **PWA** - Application web progressive
- **React Router** - Navigation côté client
- **React Hot Toast** - Notifications

---

## 📂 Structure du projet

```
src/
├── components/          # Composants React réutilisables
│   ├── ui/             # Composants UI de base (shadcn/ui)
│   ├── game/           # Composants spécifiques au jeu
│   ├── games/          # Composants par mini-jeu
│   │   ├── kikadi/     # Mini-jeu KiKaDi
│   │   ├── kidivrai/   # Mini-jeu KiDiVrai
│   │   ├── kidenous/   # Mini-jeu KiDeNous
│   │   └── kideja/     # Mini-jeu KiDéjà
│   ├── animations/     # Composants d'animation
│   ├── admin/          # Interface d'administration
│   └── shop/           # Composants de la boutique
├── pages/              # Pages principales de l'application
├── hooks/              # Hooks React personnalisés
├── context/            # Contextes React (state global)
├── store/              # Stores Zustand
├── types/              # Définitions TypeScript
├── constants/          # Constantes et configuration
├── utils/              # Fonctions utilitaires
└── lib/                # Bibliothèques et configurations
```

### 🎮 Pages principales
- `/` - Page d'accueil
- `/auth` - Authentification
- `/dashboard` - Menu principal du joueur
- `/create` - Création d'une partie
- `/lobby/:gameId` - Salon d'attente
- `/game/:gameId` - Interface de jeu
- `/results/:gameId` - Résultats de la partie
- `/shop` - Boutique d'objets
- `/admin` - Interface d'administration
- `/admin/dev-mode` - Mode développeur avec bots

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

### Hébergement personnalisé
Le projet peut être déployé sur n'importe quelle plateforme supportant les SPAs :
- Vercel, Netlify, Firebase Hosting
- GitHub Pages, AWS S3, etc.

---

## 🤝 Contribution

### Workflow de développement
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commiter les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

### Standards de code
- Utiliser TypeScript pour tout nouveau code
- Suivre les conventions ESLint et Prettier
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les composants complexes

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🔗 Liens utiles

- **Projet Lovable** : [https://lovable.dev/projects/14dfe1f3-1f04-430d-92e5-398616247d1b](https://lovable.dev/projects/14dfe1f3-1f04-430d-92e5-398616247d1b)
- **Documentation Lovable** : [https://docs.lovable.dev/](https://docs.lovable.dev/)
- **Supabase Docs** : [https://supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS** : [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **shadcn/ui** : [https://ui.shadcn.com/](https://ui.shadcn.com/)

---

💡 **Développé avec ❤️ sur [Lovable](https://lovable.dev)**

