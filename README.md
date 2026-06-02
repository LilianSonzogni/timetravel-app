# TimeTravel Agency

Webapp premium pour une agence de voyage temporel fictive, développée dans le cadre du Master Expert Développement Full Stack — Ynov Bordeaux (Janvier 2026).

---

## Description

TimeTravel Agency est une single-page application React conçue comme support de présentation d'une campagne marketing générée entièrement par IA (Session 1). Elle met en valeur **six destinations temporelles** avec un design dark mode premium, des animations fluides, un **quiz de recommandation personnalisée** et un chatbot IA intégré dont **la clé API ne quitte jamais le serveur**.

---

## Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| React | 19 | UI components |
| Vite | 8 | Bundler & dev server |
| Tailwind CSS | 3 | Styling utilitaire |
| Framer Motion | 12 | Animations & transitions |
| Vercel Serverless Functions | Node.js | Proxy sécurisé vers Mistral AI |
| Mistral AI API | mistral-small | Chatbot + enrichissement quiz |

---

## Architecture sécurisée du chatbot

```
Navigateur                Vercel Edge              Mistral AI
──────────                ─────────────            ──────────
ChatBot.jsx  ──POST──▶  api/chat.js  ──POST──▶  api.mistral.ai
Quiz.jsx                 (server)     + clé API
             /api/chat      ▲
             (pas de clé)   │
                    process.env.MISTRAL_API_KEY
                    (variable serveur, jamais dans le bundle)
```

La **clé API** et le **system prompt** résident exclusivement dans `api/chat.js` côté serveur. Le bundle JavaScript client ne contient aucune credential. Vérifiable via `grep -r "MISTRAL" dist/` → aucun résultat.

---

## Features

- **Header fixe** avec navigation smooth-scroll, backdrop blur au défilement et menu hamburger mobile
- **Hero section** avec vidéo Paris en fond, titre animé et scroll indicator
- **Destinations** — 6 cards interactives (2 lignes × 3 colonnes desktop) avec :
  - Images responsive via `<picture>` : portrait 9:16 (mobile), carré 1:1 (tablette), paysage 16:9 (desktop)
  - Format WebP prioritaire (−92 à 95 % de poids vs PNG)
  - `loading="lazy"` + `decoding="async"` natifs
  - Hover effects : zoom image, border or, shimmer
- **Galerie vidéo** — lazy loading via `IntersectionObserver` (src injecté uniquement à l'entrée dans le viewport), play/pause, barre de progression
- **Quiz de recommandation personnalisée** — architecture hybride :
  - 4 questions couvrant les 6 destinations (chacune peut gagner)
  - Scoring local instantané et fiable (matrice de pondération)
  - Enrichissement IA optionnel via `/api/chat` (Mistral) avec timeout 10 s et fallback gracieux vers descriptions statiques pré-rédigées
  - Résultat : image 16:9 de la destination + explication personnalisée + CTA scroll vers la carte
- **À propos** — présentation agence + 3 points forts avec icônes SVG
- **Chatbot IA sécurisé** — widget flottant, appel serveur via `/api/chat`, historique de conversation, typing indicator, reset, badge non-lu
- **Responsive** mobile-first, scroll personnalisé, sélection dorée

---

## Outils IA utilisés

### Session 1 — Création des assets

| Outil | Usage |
|---|---|
| **Google Gemini Premium** (Imagen 3 + Veo 2) | Génération des 18 images (6 destinations × 3 formats) et des 6 vidéos animées (8–10 s chacune) avec mouvements de caméra |
| **ElevenLabs** | Génération de la voix-off française (18 secondes) |
| **CapCut** | Montage du teaser final (19 secondes) |

### Session 2 — Développement webapp

| Outil | Usage |
|---|---|
| **Claude Code** (Anthropic) | Génération complète de la webapp : architecture React, composants, intégration assets, quiz, chatbot sécurisé, configuration déploiement |
| **Mistral AI** (`mistral-small`) | Moteur du chatbot conversationnel et enrichissement IA du quiz, appelés exclusivement côté serveur |

---

## Installation

### Prérequis

- Node.js ≥ 20.6 (requis pour `--env-file` dans `npm run dev:api`)
- npm ≥ 9

### Étapes

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd timetravel-app

# 2. Installer les dépendances
npm install

# 3. Configurer la clé API Mistral
cp .env.local.example .env.local
# Éditer .env.local — renseigner MISTRAL_API_KEY (sans préfixe VITE_)
# Clé disponible sur : https://console.mistral.ai/

# 4. Lancer en développement (2 terminaux)
npm run dev        # Terminal 1 — Vite sur http://localhost:5173
npm run dev:api    # Terminal 2 — Serveur API local sur http://localhost:3001

# 5. Build de production
npm run build

# 6. Prévisualiser le build
npm run preview    # → http://localhost:4173
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```
# Côté serveur uniquement — jamais de préfixe VITE_
MISTRAL_API_KEY=votre_clé_api_mistral
```

| Variable | Scope | Description |
|---|---|---|
| `MISTRAL_API_KEY` | Serveur uniquement | Clé API Mistral AI — **jamais exposée au client** |

Le reste du site fonctionne normalement sans la clé (chatbot et quiz affichent un message d'erreur ou utilisent les descriptions statiques de fallback).

---

## Développement local avec le chatbot et le quiz

Le chatbot et le quiz appellent `/api/chat` — une Vercel Serverless Function. En local, Vite ne sert pas ce type de fichier. **Deux terminaux sont nécessaires** :

```bash
# Terminal 1 : frontend Vite
npm run dev
# → http://localhost:5173

# Terminal 2 : serveur API local (scripts/local-api.js)
npm run dev:api
# → http://localhost:3001
# → Les requêtes /api/chat depuis Vite sont automatiquement proxiées
```

Le proxy est configuré dans `vite.config.js` :
```js
server: { proxy: { '/api': 'http://localhost:3001' } }
```

**Alternative — Vercel CLI :**
```bash
npm i -g vercel
vercel dev   # Sert frontend + fonctions /api sur le même port
```

---

## Déploiement Vercel

```bash
# Option A — CLI
npm i -g vercel
vercel

# Option B — Interface vercel.com
# 1. Importer le repo GitHub
# 2. Framework : Vite (détecté automatiquement)
# 3. Settings → Environment Variables → ajouter MISTRAL_API_KEY
# 4. Deploy
```

**Important** : sur Vercel, la variable s'appelle `MISTRAL_API_KEY` (sans préfixe `VITE_`). Elle est automatiquement injectée dans `process.env` côté serveur et n'apparaît jamais dans le bundle client.

Le fichier `vercel.json` configure automatiquement :
- Cache immutable 1 an sur les images WebP
- Cache 7 jours + `Accept-Ranges` sur les vidéos (streaming)
- Routing automatique `/api/*` → fonctions serverless

---

## Structure du projet

```
timetravel-app/
├── api/
│   └── chat.js              # Serverless Function — clé + system prompt côté serveur
├── scripts/
│   └── local-api.js         # Serveur HTTP local pour dev (0 dépendance extra)
├── public/
│   └── assets/
│       ├── images/           # 18 images WebP (6 destinations × 3 formats)
│       └── videos/           # 6 vidéos MP4 (paris, cretace, florence, egypte, kyoto, rome)
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Navigation fixe + hamburger mobile
│   │   ├── Hero.jsx          # Vidéo plein écran + titre animé
│   │   ├── Destinations.jsx  # Données destinations + layout section (6 cards)
│   │   ├── DestinationCard.jsx  # Card avec <picture> responsive + lazy
│   │   ├── VideoGallery.jsx  # Galerie vidéo IntersectionObserver (6 vidéos)
│   │   ├── Quiz.jsx          # Quiz recommandation : scoring local + enrichissement IA
│   │   ├── About.jsx         # Présentation agence + 3 features
│   │   ├── Footer.jsx        # Pied de page + liens
│   │   └── ChatBot.jsx       # Widget chatbot — appel /api/chat uniquement
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             # Tailwind + utilitaires gold custom
├── vercel.json               # Headers cache + routing serverless
├── vite.config.js            # Proxy /api + code splitting + ES2020
├── tailwind.config.js        # Palette dark/gold + polices display
├── .env.local                # Variables d'environnement (non commité)
└── .env.local.example        # Template à copier
```

---

## Destinations

| Destination | Époque | Prix | Durée |
|---|---|---|---|
| Paris 1889 — Belle Époque | XIXe siècle | 12 000 € | 1 semaine |
| Crétacé — 65 M d'années | Mésozoïque | 25 000 € | 3 jours |
| Florence 1504 — Renaissance | XVIe siècle | 15 000 € | 10 jours |
| Égypte Antique — 2560 av. J.-C. | Antiquité | 18 000 € | 8 jours |
| Kyoto 1700 — Période Edo | Époque Edo | 16 000 € | 7 jours |
| Rome Antique — 80 ap. J.-C. | Antiquité Romaine | 17 000 € | 6 jours |

---

## Crédits

**Auteurs** : Lilian Sonzogni & Hugo Gomes Duarte  
**Formation** : Master Expert Développement Full Stack — Ynov Bordeaux  
**Promotion** : 2025–2026

Assets visuels générés par Google Gemini (Imagen 3 / Veo 2) — Session 1.  
Interface développée avec Claude Code (Anthropic) — Session 2.  
Chatbot et enrichissement quiz propulsés par Mistral AI (`mistral-small`), appelés exclusivement côté serveur.

---

*"Le temps est votre destination."*
