# Freelectory Repository Index

This file is a compact map for ChatGPT/GitHub-style repository connectors. It identifies the important source files and product flows so an assistant can answer questions without scanning generated folders.

## Project Summary

Freelectory is a Next.js 15 SaaS MVP for people who want to find jobs or clients. The product flow is:

1. Landing page explains the value in under 30 seconds.
2. User signs up or logs in via Google, Telegram, email, and phone confirmation.
3. User chooses a goal: looking for a job or looking for clients.
4. User fills role, skills, categories, market, and language.
5. User generates, uploads, or improves a resume.
6. User gets a Tinder-like opportunity feed, likes cards, generates AI replies, and tracks opportunities in CRM.
7. Telegram bot can show feed, token balance, and CRM status.

## Tech Stack

- Framework: Next.js 15 App Router
- Language: TypeScript
- UI: Tailwind CSS, shadcn-style local primitives, Lucide Icons
- State/backend MVP: in-memory server store
- Integrations: Telegram Bot API webhook stub, optional OpenAI key stub

## Commands

```bash
npm run dev
npm run build
npm run lint
```

## Environment

Use `.env.example` as the template.

Required for real Telegram calls:

```env
TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Optional for future real AI generation:

```env
OPENAI_API_KEY=
```

Do not commit `.env.local`.

## Primary Routes

| Route | Purpose | Main file |
| --- | --- | --- |
| `/` | Conversion landing page | `src/app/page.tsx` |
| `/auth` | Login/registration and token incentives | `src/app/auth/page.tsx` |
| `/onboarding` | First-session user setup flow | `src/app/onboarding/page.tsx` |
| `/dashboard` | App overview after onboarding | `src/app/dashboard/page.tsx` |
| `/feed` | Tinder-style opportunities feed | `src/app/feed/page.tsx` |
| `/profile` | User profile form | `src/app/profile/page.tsx` |
| `/profile/resumes` | Resume variants | `src/app/profile/resumes/page.tsx` |
| `/crm` | Applications CRM | `src/app/crm/page.tsx` |
| `/leaderboard` | Gamified ranking | `src/app/leaderboard/page.tsx` |
| `/admin` | Admin/ops mock panel | `src/app/admin/page.tsx` |
| `/settings` | Theme, market, language settings | `src/app/settings/page.tsx` |

## API Routes

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/health` | GET | Service health and Telegram config flag |
| `/api/auth/register` | POST | Mock registration with token bonus |
| `/api/profile` | GET, PUT | Read/update demo user profile |
| `/api/jobs` | GET | Filter mock opportunities |
| `/api/jobs/like` | POST | Like/skip a job and spend token |
| `/api/applications/generate` | POST | Generate mock AI reply and create application |
| `/api/crm` | GET, PATCH | List/update application CRM statuses |
| `/api/tokens` | GET, POST | Token balance, costs, transactions, refill |
| `/api/referrals` | GET, POST | Referral code and rewards |
| `/api/leaderboard` | GET | Ranking data |
| `/api/telegram/webhook` | GET, POST | Telegram bot commands |
| `/api/telegram/set-webhook` | POST | Register Telegram webhook URL |

## Important Source Files

### App Shell and Theme

- `src/app/layout.tsx`: root layout, fonts, metadata, theme provider.
- `src/app/globals.css`: Tailwind import, CSS variables, light/dark theme tokens.
- `src/components/theme-provider.tsx`: localStorage-backed light/dark theme.
- `src/components/layout/app-shell.tsx`: authenticated app layout, sidebar, topbar.
- `src/components/layout/theme-toggle.tsx`: theme toggle button.

### Conversion and Onboarding

- `src/app/page.tsx`: public landing page focused on quick conversion.
- `src/app/auth/page.tsx`: registration/login page with Telegram and phone token incentives.
- `src/app/onboarding/page.tsx`: mounts the onboarding flow.
- `src/components/features/onboarding/onboarding-flow.tsx`: client-side multi-step onboarding:
  - goal selection
  - contact confirmation
  - role selection
  - skills selection
  - category matching
  - market/language
  - resume generation/upload/improvement
  - ready state

### Product UI Components

- `src/components/features/opportunity-card.tsx`: interactive card feed and mock AI reply.
- `src/components/features/crm-table.tsx`: CRM table.
- `src/components/features/stat-grid.tsx`: dashboard metrics.
- `src/components/features/product-map.tsx`: product/architecture overview block.
- `src/components/features/page-heading.tsx`: shared page heading.

### UI Primitives

- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/select.tsx`

### Server MVP

- `src/server/types.ts`: domain types.
- `src/server/mock-store.ts`: in-memory data store for users, jobs, likes, applications, tokens, referrals.
- `src/server/ai.ts`: deterministic mock AI reply generator; future OpenAI integration hook.
- `src/server/telegram.ts`: Telegram Bot API helper.

### Mock Data

- `src/lib/mock-data.ts`: navigation, UI metrics, opportunities, CRM rows, token costs, leaderboard, stack items.
- `src/lib/utils.ts`: `cn` class utility.

## Data Model Snapshot

The MVP data model in `src/server/types.ts` includes:

- `UserProfile`
- `JobOpportunity`
- `Application`
- `TokenTransaction`
- `Referral`

The intended future database from the product plan maps to:

- `users`
- `profiles`
- `resumes`
- `jobs`
- `job_likes`
- `applications`
- `tokens`
- `token_transactions`
- `referrals`
- `notifications`

## Telegram Bot Behavior

Implemented commands in `src/app/api/telegram/webhook/route.ts`:

- `/start`: intro and command list
- `/feed`: top opportunity
- `/tokens`: token balance
- `/crm`: latest application statuses

Webhook registration is handled by `src/app/api/telegram/set-webhook/route.ts`.

## Current MVP Limitations

- Auth is mock UI plus API contract, not real OAuth/SMS verification.
- Database is in-memory and resets on server restart.
- AI generation is deterministic unless real model integration is added.
- Telegram webhook needs HTTPS deployment to work in production.
- Some older mock labels in `src/lib/mock-data.ts` may still need UTF-8 cleanup if they appear in non-updated app sections.

## Files and Folders to Ignore During Indexing

These are generated or local-only:

- `node_modules/`
- `.next/`
- `work/`
- `outputs/`
- `.env*`
- `package-lock.json` can be read for exact dependency resolution, but source understanding should start with `package.json` and `src/`.
