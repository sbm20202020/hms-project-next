# HMS — Hospital Management System

Stack : **Next.js 15** · **Django 5** · **PostgreSQL 16** · **Docker Compose**

```
hms-project-next/
├── frontend/          # Next.js 15 (App Router, Tailwind, next-auth)
├── backend/           # Django 5 REST API (DRF + SimpleJWT)
├── docker/
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
├── docker-compose.yml
└── .env.example       # Docker Compose variables
```

---

## Démarrage rapide (Docker)

```bash
# 1. Copier et remplir les variables d'environnement
cp .env.example .env

# 2. Lancer la stack
docker compose up --build

# 3. Créer le premier superutilisateur Django (une seule fois)
docker compose exec backend python manage.py createsuperuser
```

Accès :
- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:8000/api/
- **Django Admin** → http://localhost:8000/admin/

---

## Développement local (sans Docker)

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # éditez si nécessaire
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
corepack enable pnpm
pnpm install
cp .env.example .env.local   # éditez DJANGO_API_URL=http://localhost:8000
pnpm dev
```

---

## Architecture

```
Browser
  │
  ▼
Next.js  (port 3000)
  │  /api/auth/* ──────────────► next-auth (JWT en session)
  │  /api/*      ──────────────► Django API (proxy beforeFiles)
  │
  ▼
Django   (port 8000)
  │
  ▼
PostgreSQL (port 5432)
```

Les routes API Next.js (`src/app/api/`) ne contiennent plus que le handler `[...nextauth]`.
Toutes les autres requêtes `/api/*` sont proxiées vers Django via `next.config.mjs`.

---

## Variables d'environnement

| Variable | Où | Description |
|---|---|---|
| `POSTGRES_PASSWORD` | root `.env` | Obligatoire |
| `DJANGO_SECRET_KEY` | root `.env` | Obligatoire en prod |
| `NEXTAUTH_SECRET` | root `.env` | Obligatoire |
| `NEXTAUTH_URL` | root `.env` | URL publique du frontend |
| `DJANGO_API_URL` | `frontend/.env.local` | URL du backend (dev local) |
