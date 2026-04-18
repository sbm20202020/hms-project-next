# HMS Project Next

Stack cible :
- Frontend : Next.js
- Backend API : Django
- Base de données : SQLite en développement, PostgreSQL en production

## 1) Frontend (Next.js)

```bash
corepack enable
corepack pnpm install
corepack pnpm dev
```

Le frontend démarre sur `http://localhost:3000`.

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

Healthcheck backend :
- `GET http://localhost:8000/api/health/`

## Configuration base de données Django

Le backend utilise :
- **SQLite** par défaut (développement)
- **PostgreSQL** quand `DJANGO_ENV=production`

Variables importantes (voir `backend/.env.example`) :
- `DJANGO_ENV` (`development` ou `production`)
- `DATABASE_URL` (obligatoire en production, format PostgreSQL)
- `DATABASE_SSL_REQUIRE`
