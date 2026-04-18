# HMS Project Next

Stack :
- **Frontend** : Next.js
- **Backend API** : Django + Django REST Framework
- **Auth** : next-auth (JWT) → appels validés côté Django (simplejwt)
- **Base de données** : SQLite en développement, PostgreSQL en production

---

## 1) Frontend (Next.js)

```bash
corepack enable
corepack pnpm install
cp .env.example .env.local   # puis éditer les valeurs
corepack pnpm dev
```

Le frontend démarre sur `http://localhost:3000`.

Les appels `/api/*` (sauf `/api/auth/`) sont proxifiés automatiquement vers le backend Django (`DJANGO_API_URL`).

### Variables d'environnement (.env.local)

| Variable | Description |
|---|---|
| `NEXTAUTH_URL` | URL publique du frontend |
| `NEXTAUTH_SECRET` | Clé secrète next-auth |
| `DJANGO_API_URL` | URL du backend Django (défaut `http://localhost:8000`) |
| `GOOGLE_CLIENT_ID` | OAuth Google (optionnel) |
| `GOOGLE_CLIENT_SECRET` | OAuth Google (optionnel) |

---

## 2) Backend (Django)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Le backend démarre sur `http://localhost:8000`.

### Endpoints principaux

| Méthode | URL | Description |
|---|---|---|
| GET | `/api/health/` | Healthcheck |
| POST | `/api/auth/signup/` | Inscription |
| POST | `/api/auth/token/` | Connexion → JWT |
| POST | `/api/auth/token/refresh/` | Rafraîchissement JWT |
| GET/POST | `/api/patients/` | Liste / création patients |
| GET | `/api/patients/count/` | Comptage patients |
| GET/POST | `/api/dossiers/` | Liste / création dossiers |
| PUT | `/api/dossiers/<id>/` | Mise à jour dossier + ticket |
| GET | `/api/dossiers/today/` | Dossiers du jour |
| GET | `/api/dossiers/yesterday/` | Dossiers d'hier |
| GET | `/api/dossiers/count/` | Statistiques dossiers |
| GET | `/api/dossiers/date/<YYYY-MM-DD>/` | Dossiers par date |
| GET | `/api/hospital/services/` | Liste services |
| GET | `/api/hospital/tickets/` | Tickets du jour |
| PUT | `/api/hospital/tickets/<id>/` | Mise à jour ticket |
| GET/POST | `/api/soins/` | Soins |

### Configuration base de données

- **Dev** : SQLite par défaut
- **Prod** (`DJANGO_ENV=production`) : PostgreSQL depuis `DATABASE_URL`

### Variables d'environnement (backend/.env)

Voir `backend/.env.example` pour la liste complète.

---

## Tests

```bash
# Backend
cd backend && python manage.py test

# Frontend lint
corepack pnpm lint
```

