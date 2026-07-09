# Freelectory Backend Setup

## Supabase

Project:

- Name: `freelectory`
- Project ref: `qvcqlfyoyoyxmcrabnub`
- API URL: `https://qvcqlfyoyoyxmcrabnub.supabase.co`
- Region: `eu-central-1`

Schema status:

- Prisma-compatible tables are created.
- RLS is enabled on all public app tables.
- Seed data is inserted: 1 demo user, 3 opportunities, 1 application.

## Local Database Connection

Open Supabase dashboard:

`https://supabase.com/dashboard/project/qvcqlfyoyoyxmcrabnub/settings/database`

Copy a PostgreSQL connection string and put it into `.env.local`:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
AUTH_SECRET="generate-a-long-random-string"
```

Then run:

```bash
npm run prisma:generate
npm run dev
```

The app automatically uses Supabase when `DATABASE_URL` is present. Without it, API routes keep working through the in-memory fallback store.

## Firebase App Hosting

Firebase project:

- Project ID: `freelectory`
- Console: `https://console.firebase.google.com/project/freelectory/overview`

App Hosting requires the Firebase project to be upgraded to the Blaze plan.

When deploying to Firebase App Hosting, add these secrets:

```bash
firebase apphosting:secrets:set DATABASE_URL
firebase apphosting:secrets:set AUTH_SECRET
firebase apphosting:secrets:set TELEGRAM_BOT_TOKEN
firebase apphosting:secrets:set OPENAI_API_KEY
```

Set public app URL:

```env
NEXT_PUBLIC_APP_URL=https://your-production-domain
TELEGRAM_BOT_USERNAME=freelectory_bot
```

After deployment, set Telegram webhook:

```bash
curl -X POST https://your-production-domain/api/telegram/set-webhook \
  -H "content-type: application/json" \
  -d "{\"url\":\"https://your-production-domain/api/telegram/webhook\"}"
```
