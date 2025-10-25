# Socialize

A full‑stack social media app built as a monorepo:
- Backend: Node.js + Express + TypeScript, MongoDB, Socket.IO
- Frontend: React + TypeScript, Vite, Tailwind CSS

For detailed guides, setup, and API/component docs, see:
- Backend documentation: backend/README.md
- Frontend documentation: frontend/README.md

## Monorepo layout

```
socialize/
├─ backend/   # REST API, WebSocket, database, services
└─ frontend/  # React client, UI, routing, assets
```

## Requirements

- Node.js 22.11.0 or newer
- npm (or yarn/pnpm)
- MongoDB (local or cloud)

## Quick start (local development)

Open two terminals and run backend and frontend separately.

Backend (PowerShell):

```
cd backend
Copy-Item env.example .env
npm install
npm run dev
```

Frontend (PowerShell):

```
cd frontend
npm install
npm run dev
```

Then visit the frontend dev URL printed by Vite (typically http://localhost:5173). Configure the frontend API base URL to point to the backend dev server; see the environment sections below.

## Environment configuration

- Backend envs and SMTP/Mongo setup: see backend/README.md
- Frontend envs (Vite/Firebase/API base URL): see frontend/README.md

## Common scripts

- Backend
  - npm run dev – start API with hot reload
  - npm run build – compile TypeScript
  - npm start – run compiled server
- Frontend
  - npm run dev – start Vite dev server
  - npm run build – production build
  - npm run preview – preview built app

## Contributing

Issues and PRs are welcome. Follow TypeScript strict mode and lint rules in each package. See the respective READMEs for coding standards and contribution notes.

## License

This repository contains multiple packages. Refer to backend/README.md and frontend/README.md for license details applicable to each package.
