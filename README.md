# TimeTravel Agency

Webapp premium pour une agence de voyage temporel fictive, développée dans le cadre du Master Expert Développement Full Stack — Ynov Bordeaux (Janvier 2026).

---

## Description

TimeTravel Agency est une single-page application React conçue comme support de présentation d'une campagne marketing générée entièrement par IA (Session 1). Elle met en valeur trois destinations temporelles — Paris 1889, Crétacé −65M ans, Florence 1504 — avec un design dark mode premium, des animations fluides et un chatbot IA intégré.

---

## Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| React | 19 | UI components |
| Vite | 8 | Bundler & dev server |
| Tailwind CSS | 3 | Styling utilitaire |
| Framer Motion | 12 | Animations & transitions |
| Mistral AI API | mistral-small | Chatbot conversationnel |

---

## Features

- **Header fixe** avec navigation smooth-scroll, backdrop blur au défilement et menu hamburger mobile
- **Hero section** avec vidéo Paris en fond, titre animé et scroll indicator
- **Destinations** — 3 cards interactives avec :
  - Images responsive via `<picture>` : portrait 9:16 (mobile), carré 1:1 (tablette), paysage 16:9 (desktop)
  - Format WebP prioritaire (−95% de poids vs PNG)
  - `loading="lazy"` + `decoding="async"` natifs
  - Hover effects : zoom image, border or, shimmer
- **Galerie vidéo** — lazy loading via `IntersectionObserver` (src injecté uniquement à l'entrée dans le viewport), play/pause, barre de progression
- **À propos** — présentation agence + 3 points forts avec icônes SVG
- **Chatbot IA** — widget flottant Mistral AI avec historique de conversation, typing indicator, reset et badge non-lu
- **Responsive** mobile-first, scroll personnalisé, sélection dorée

---

## Outils IA utilisés

### Session 1 — Création des assets

| Outil | Usage |
|---|---|
| **Google Gemini Premium** (Imagen 3 + Veo 2) | Génération des 9 images (3 destinations × 3 formats) et des 3 vidéos animées (8s chacune) avec mouvements de caméra |
| **ElevenLabs** | Génération de la voix-off française (18 secondes) |
| **CapCut** | Montage du teaser final (19 secondes) |

### Session 2 — Développement webapp

| Outil | Usage |
|---|---|
| **Claude Code** (Anthropic) | Génération complète de la webapp : architecture React, composants, intégration assets, chatbot, configuration déploiement |
| **Mistral AI** (`mistral-small`) | Moteur du chatbot conversationnel intégré dans l'interface |

---

## Installation

### Prérequis

- Node.js ≥ 18
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
# Éditer .env.local et renseigner VITE_MISTRAL_API_KEY
# Clé disponible sur : https://console.mistral.ai/

# 4. Lancer en développement
npm run dev
# → http://localhost:5173

# 5. Build de production
npm run build

# 6. Prévisualiser le build
npm run preview
# → http://localhost:4173
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```
VITE_MISTRAL_API_KEY=votre_clé_api_mistral
```

| Variable | Description | Requis |
|---|---|---|
| `VITE_MISTRAL_API_KEY` | Clé API Mistral AI | Oui (chatbot) |

Le chatbot affiche un message d'erreur explicite si la clé est absente — le reste du site fonctionne normalement sans elle.

---

## Déploiement Vercel

```bash
# Option A — CLI
npm i -g vercel
vercel

# Option B — Interface vercel.com
# 1. Importer le repo
# 2. Framework : Vite (détecté automatiquement)
# 3. Ajouter la variable VITE_MISTRAL_API_KEY dans les settings
# 4. Deploy
```

Le fichier `vercel.json` configure automatiquement :
- Cache immutable 1 an sur les images WebP
- Cache 7 jours sur les vidéos avec support `Accept-Ranges` (streaming byte-range)

---

## Structure du projet

```
timetravel-app/
├── public/
│   └── assets/
│       ├── images/              # 9 images WebP (paris, cretace, florence × 3 formats)
│       └── videos/              # 3 vidéos MP4 (paris, cretace, florence)
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation fixe + hamburger mobile
│   │   ├── Hero.jsx             # Vidéo plein écran + titre animé
│   │   ├── Destinations.jsx     # Données + layout section destinations
│   │   ├── DestinationCard.jsx  # Card avec <picture> responsive + lazy
│   │   ├── VideoGallery.jsx     # Galerie vidéo IntersectionObserver
│   │   ├── About.jsx            # Présentation agence + 3 features
│   │   ├── Footer.jsx           # Pied de page + liens
│   │   └── ChatBot.jsx          # Widget chatbot Mistral AI
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                # Tailwind + utilitaires gold custom
├── vercel.json                  # Headers cache + config build
├── vite.config.js               # Code splitting + target ES2020
├── tailwind.config.js           # Palette dark/gold + polices display
└── .env.local                   # Variables d'environnement (non commité)
```

---

## Crédits

**Auteur** : Lilian Sonzogni  
**Formation** : Master Expert Développement Full Stack — Ynov Bordeaux  
**Promotion** : 2025–2026

Assets visuels générés par Google Gemini (Imagen 3 / Veo 2) — Session 1.  
Interface développée avec Claude Code (Anthropic) — Session 2.  
Chatbot propulsé par Mistral AI (`mistral-small`).

---

*"Le temps est votre destination."*
