# Freelectory MVP

Freelectory is an AI assistant for finding jobs and freelance clients. The MVP includes a Next.js SaaS UI, mock backend API, token economy, CRM, AI reply generation stub, referral mechanics, leaderboard, and Telegram bot webhook.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Lucide Icons
- Server-side mock store for MVP data
- Telegram Bot API webhook integration

## Run

```bash
npm install
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
```

`TELEGRAM_BOT_TOKEN` is required for real Telegram replies. `OPENAI_API_KEY` is optional in this MVP; without it the app uses a deterministic mock generator.

Phone confirmation is designed to happen through Telegram, not SMS or calls:

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
- `GET /api/telegram/webhook`
- `POST /api/telegram/webhook`
- `POST /api/telegram/set-webhook`
- `POST /api/telegram/phone/start`
- `GET /api/telegram/phone/status`

## Firebase App Hosting

This repository includes `apphosting.yaml` for Firebase App Hosting, which is the current recommended Firebase path for a dynamic Next.js app.

Store secrets in Firebase App Hosting / Google Cloud Secret Manager:

```bash
firebase apphosting:secrets:set TELEGRAM_BOT_TOKEN
firebase apphosting:secrets:set OPENAI_API_KEY
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

## Notes

The backend currently uses an in-memory mock store in `src/server/mock-store.ts`. Replace it with Supabase PostgreSQL tables from the product plan when moving past MVP.
