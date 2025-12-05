# 🏆 Podium de Concours - Nuit de l'Info 2025 by NOUBA_REBORN

Plateforme de gamification et de classement en temps réel pour les équipes participant à la Nuit de l'Info 2025.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Lancement en développement](#-lancement-en-développement)
- [Lancement avec Docker](#-lancement-avec-docker)
- [Structure du projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)

## ✨ Fonctionnalités

### Backend (API REST)

- **Authentification JWT** : Inscription, connexion et gestion des sessions utilisateurs
- **Gestion des équipes** : CRUD complet pour les équipes (création, modification, suppression)
- **Système de points** : Attribution et gestion des scores des équipes
- **Achievements/Badges** : Système de récompenses et badges pour les équipes
- **Classement en temps réel** : Leaderboard dynamique avec mise à jour instantanée
- **Server-Sent Events (SSE)** : Notifications push en temps réel pour les mises à jour du classement
- **Écoute des changements DB** : Listener PostgreSQL pour détecter les modifications en base

### Frontend (React SPA)

- **Dashboard Leaderboard** : Affichage du classement avec animations fluides
- **Détail des équipes** : Page dédiée pour chaque équipe avec historique et achievements
- **Mises à jour en temps réel** : Synchronisation SSE pour un classement toujours à jour
- **Interface responsive** : Design adaptatif avec Tailwind CSS
- **Animations** : Transitions fluides avec Motion (Framer Motion)
- **Indicateur de connexion** : Statut de la connexion SSE en temps réel

### Fonctionnalités techniques

- **Validation des données** : Schémas Zod pour la validation côté serveur
- **Gestion d'erreurs** : Middleware centralisé pour les erreurs
- **CORS configuré** : Support multi-origines pour le développement
- **React Query** : Cache intelligent et synchronisation des données
- **TypeScript** : Typage strict sur l'ensemble du projet

## 🏗 Architecture

```
┌─────────────────┐     SSE      ┌─────────────────┐
│                 │◄────────────►│                 │
│   Frontend      │              │    Backend      │
│   (React/Vite)  │◄────REST────►│   (Express)     │
│                 │              │                 │
└─────────────────┘              └────────┬────────┘
                                          │
                                          │ Prisma ORM
                                          │
                                 ┌────────▼────────┐
                                 │                 │
                                 │   PostgreSQL    │
                                 │                 │
                                 └─────────────────┘
```

## 📦 Prérequis

- **Node.js** >= 20.x
- **npm** >= 10.x
- **PostgreSQL** >= 14
- **Docker** (optionnel, pour le déploiement)

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/moetezbouazra/nuit-info-2025-podium-de-concours.git
cd nuit-info-2025-podium-de-concours
```

### 2. Configuration de la base de données

Créez une base de données PostgreSQL :

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE leaderboard;

# Quitter
\q
```

### 3. Installation du Backend

```bash
cd leader-board-back

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env  # ou créer le fichier .env
```

Créez le fichier `.env` dans `leader-board-back/` :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/leaderboard?schema=public"
JWT_SECRET="votre-secret-jwt-super-securise"
PORT=3001
CORS_ORIGINS="http://localhost:5173"
```

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# (Optionnel) Peupler la base avec des données de test
npm run db:seed
```

### 4. Installation du Frontend

```bash
cd ../leader-board-front

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env  # ou créer le fichier .env
```

Créez le fichier `.env` dans `leader-board-front/` :

```env
VITE_API_URL="http://localhost:3001/api"
```

## 💻 Lancement en développement

### Démarrer le Backend

```bash
cd leader-board-back
npm run dev
```

Le serveur API démarre sur `http://localhost:3001`

### Démarrer le Frontend

Dans un nouveau terminal :

```bash
cd leader-board-front
npm run dev
```

L'application démarre sur `http://localhost:5173`

### Accéder à l'application

- **Frontend** : http://localhost:5173
- **API** : http://localhost:3001/api
- **Health Check** : http://localhost:3001/api/health
- **Prisma Studio** (gestion DB) : `npm run db:studio` dans le backend

## 🐳 Lancement avec Docker

### Build des images

```bash
# Backend
cd leader-board-back
docker build -t leaderboard-backend .

# Frontend
cd ../leader-board-front
docker build -t leaderboard-frontend .
```

### Lancement avec Docker Compose (recommandé)

Créez un fichier `docker-compose.yml` à la racine :

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: leaderboard
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./leader-board-back
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/leaderboard
      JWT_SECRET: your-jwt-secret
      PORT: 3001
      CORS_ORIGINS: http://localhost:80
    ports:
      - "3001:3001"
    depends_on:
      - db

  frontend:
    build: ./leader-board-front
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

```bash
# Lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

## 📁 Structure du projet

```
nuit-info-2025-podium-de-concours/
├── leader-board-back/          # API Backend
│   ├── prisma/                 # Schéma et migrations DB
│   │   ├── schema.prisma       # Modèles de données
│   │   └── migrations/         # Historique des migrations
│   ├── src/
│   │   ├── config/             # Configuration (CORS, etc.)
│   │   ├── controllers/        # Logique des routes
│   │   ├── middlewares/        # Auth, validation, erreurs
│   │   ├── routes/             # Définition des endpoints
│   │   ├── services/           # Logique métier
│   │   ├── utils/              # Helpers (JWT, password, etc.)
│   │   └── validators/         # Schémas Zod
│   └── Dockerfile
│
├── leader-board-front/         # Application Frontend
│   ├── src/
│   │   ├── components/         # Composants UI réutilisables
│   │   ├── features/           # Fonctionnalités (leaderboard, teams)
│   │   ├── lib/                # Utilitaires et hooks
│   │   ├── pages/              # Pages de l'application
│   │   └── types/              # Types TypeScript
│   └── Dockerfile
│
└── README.md                   # Ce fichier
```

## 🔌 API Endpoints

### Authentification (`/api/auth`)

| Méthode | Endpoint    | Description           |
|---------|-------------|-----------------------|
| POST    | `/register` | Inscription           |
| POST    | `/login`    | Connexion             |

### Équipes (`/api/teams`)

| Méthode | Endpoint      | Description              |
|---------|---------------|--------------------------|
| GET     | `/`           | Liste des équipes        |
| GET     | `/:id`        | Détail d'une équipe      |
| POST    | `/`           | Créer une équipe         |
| PUT     | `/:id`        | Modifier une équipe      |
| DELETE  | `/:id`        | Supprimer une équipe     |
| POST    | `/:id/score`  | Modifier le score        |

### Leaderboard (`/api/leaderboard`)

| Méthode | Endpoint | Description                    |
|---------|----------|--------------------------------|
| GET     | `/`      | Classement complet des équipes |

### Achievements (`/api/achievements`)

| Méthode | Endpoint               | Description                    |
|---------|------------------------|--------------------------------|
| GET     | `/`                    | Liste des achievements         |
| POST    | `/`                    | Créer un achievement           |
| POST    | `/award`               | Attribuer à une équipe         |

### SSE (`/api/sse`)

| Méthode | Endpoint       | Description                           |
|---------|----------------|---------------------------------------|
| GET     | `/leaderboard` | Stream SSE des mises à jour en temps réel |

### Utilitaires

| Méthode | Endpoint      | Description    |
|---------|---------------|----------------|
| GET     | `/api/health` | Health check   |

## 🧪 Scripts disponibles

### Backend

```bash
npm run dev          # Démarrer en mode développement
npm run build        # Compiler TypeScript
npm run start        # Démarrer en production
npm run db:generate  # Générer le client Prisma
npm run db:migrate   # Appliquer les migrations
npm run db:push      # Push schema sans migration
npm run db:studio    # Ouvrir Prisma Studio
npm run db:seed      # Peupler la base de données
```

### Frontend

```bash
npm run dev      # Démarrer en mode développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Vérifier le code avec ESLint
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

Développé avec ❤️ pour la Nuit de l'Info 2025
