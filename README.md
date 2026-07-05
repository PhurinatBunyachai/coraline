# coraline

Full-stack app: Express backend + Next.js frontend, reverse-proxied by Caddy.

**Live Demo**: [https://coraline-49iw.vercel.app/](https://coraline-49iw.vercel.app/)

## Demo — Event Broadcast

https://github.com/user-attachments/assets/4472123e-f157-41ba-ba33-700d649c6269

## Stack

- `backend/` — Express + TypeScript (port 3001)
- `frontend/` — Next.js + TypeScript (port 3000)
- `Caddyfile` / `docker-compose.yml` — reverse proxy, routes `/api/*` to backend, everything else to frontend (port 80)

## Run with Docker (recommended)

```bash
docker compose up --build
```

App available at [http://localhost](http://localhost). Caddy proxies `/api/*` to the backend and everything else to the frontend.

## Run locally (without Docker)

**Backend**

```bash
cd backend
npm install
npm run dev
```

Runs on [http://localhost:3001](http://localhost:3001). Config in `backend/.env` (`PORT`, `CORS_ORIGIN`).

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Runs on [http://localhost:3000](http://localhost:3000).

## Tests

```bash
cd backend && npm test
cd frontend && npm test
```
