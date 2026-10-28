# telangana-moment-smart-pyq

Full-stack **Next.js 16 + TypeScript + SQLite** web platform tailored for Telangana Police SI and Constable exam candidates.

## What is implemented

- 150 Telangana Movement practice questions seeded into SQLite (`AUTHENTIC` + `EXPECTED` mix)
- Multi-user account isolation
- Password protection using **scrypt** hashing with per-user salts
- Session-based login/logout with secure HTTP-only cookies
- Spaced-repetition mistake queue (wrong answers are queued and reviewed until mastery)
- Edge-runtime API routes (`runtime = "edge"`) to support low-latency Cloudflare edge deployments

## Tech stack

- Next.js 16 App Router
- TypeScript
- SQLite via `@libsql/client`
- `scrypt-js` for password derivation

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Optional (defaults work locally):

- `DATABASE_URL` (default: `file:./platform.db`)
- `DATABASE_AUTH_TOKEN` (for remote/libSQL/Turso setups)

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/questions?mode=mistakes|all&limit=10`
- `POST /api/answer`
