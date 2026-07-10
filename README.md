# Freelectory MVP

Freelectory is an AI assistant for finding jobs and freelance clients. The MVP includes a Next.js SaaS UI, backend API routes, cookie auth, token economy, CRM, AI reply generation stub, referral mechanics, leaderboard, Prisma/Postgres schema, and Telegram bot phone verification.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Lucide Icons
- Prisma + PostgreSQL-compatible schema
- Server fallback store for local development without `DATABASE_URL`
- Telegram Bot API webhook integration

## Run

```bash
npm install
npm run prisma:generate
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local` from `.env.example`.

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=
DATABASE_URL=
```

Without `DATABASE_URL`, the app runs on an in-memory fallback store. After connecting PostgreSQL/Supabase, run:

```bash
npm run db:push
npm run db:seed
```

## Auth

Implemented API endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Sessions are stored in an HTTP-only `freelectory_session` cookie. Passwords are hashed with bcrypt when a real database is configured.

## Telegram Phone Confirmation

Phone confirmation happens through Telegram, not SMS or calls:

1. The site calls `POST /api/telegram/phone/start` with a phone number.
2. The API returns a Telegram deep link like `https://t.me/<bot>?start=phone_xxx`.
3. The bot handles `/start phone_xxx` and asks the user to share their Telegram contact.
4. The webhook receives `message.contact`, verifies it is the user's own contact, marks the phone as verified, and grants bonus tokens.

## Pages

- `/`
- `/auth`
- `/onboarding`
- `/dashboard`
- `/feed`
- `/profile`
- `/profile/resumes`
- `/crm`
- `/leaderboard`
- `/admin`
- `/settings`

## API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/jobs`
- `POST /api/jobs/like`
- `POST /api/applications/generate`
- `GET /api/crm`
- `PATCH /api/crm`
- `GET /api/tokens`
- `POST /api/tokens`
- `GET /api/referrals`
- `POST /api/referrals`
- `GET /api/leaderboard`
- `POST /api/admin/seed`
- `GET /api/telegram/webhook`
- `POST /api/telegram/webhook`
- `POST /api/telegram/set-webhook`
- `POST /api/telegram/phone/start`
- `GET /api/telegram/phone/status`

## Production Deploy

The free production deploy is on Vercel:

[https://freelectory.vercel.app](https://freelectory.vercel.app)

Vercel production env vars already configured:

- `NEXT_PUBLIC_APP_URL`
- `TELEGRAM_BOT_USERNAME`
- `TELEGRAM_BOT_TOKEN`
- `AUTH_SECRET`

Add `DATABASE_URL` when the Supabase connection string is ready, then redeploy:

```bash
vercel env add DATABASE_URL production
vercel deploy --prod
```

## Firebase App Hosting

This repository includes `apphosting.yaml` for Firebase App Hosting.

Firebase App Hosting is not the free path for this MVP because it requires the Firebase Blaze plan.

Store secrets in Firebase App Hosting / Google Cloud Secret Manager:

```bash
firebase apphosting:secrets:set TELEGRAM_BOT_TOKEN
firebase apphosting:secrets:set OPENAI_API_KEY
firebase apphosting:secrets:set AUTH_SECRET
firebase apphosting:secrets:set DATABASE_URL
```

Then create an App Hosting backend from the Firebase console or CLI and connect it to the GitHub repository.

## Telegram Webhook

After deploying to HTTPS, register the webhook:

```bash
curl -X POST https://your-domain.com/api/telegram/set-webhook \
  -H "content-type: application/json" \
  -d "{\"url\":\"https://your-domain.com/api/telegram/webhook\"}"
```

Supported demo commands:

- `/start`
- `/feed`
- `/tokens`
- `/crm`
