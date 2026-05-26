# Stick&Dot App

Stick&Dot is a role-based editorial platform built with Next.js, Supabase Auth, Supabase Postgres, Row Level Security, and Supabase Storage.

The frontend is treated as design-locked. Backend work should wire the existing screens without changing the visual direction unless a product decision explicitly requires it.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React
- Supabase Auth
- Supabase SSR cookies
- Supabase Postgres with RLS
- Supabase Storage

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example` and fill these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Server-only. Do not expose this in browser code or Vercel public env vars.
SUPABASE_SERVICE_ROLE_KEY=

# Local/dev only. Keep false in production.
DEV_AUTH_ENABLED=true
NEXT_PUBLIC_DEV_AUTH_ENABLED=true

# Temporary founder/demo quick login for Vercel Production.
# Keep false unless you intentionally want seeded test buttons visible online.
DEMO_AUTH_ENABLED=false
NEXT_PUBLIC_DEMO_AUTH_ENABLED=false

# before_publish | commissions_only | optional
SME_REVIEW_MODE=before_publish
NEXT_PUBLIC_SME_REVIEW_MODE=before_publish

DEV_TEST_PASSWORD=StickDotDev123!
DEV_TEST_DEV_WRITER_EMAIL=dev-writer@stickanddot.test
DEV_TEST_WRITER_EMAIL=writer@stickanddot.test
DEV_TEST_SME_EMAIL=sme@stickanddot.test
DEV_TEST_READER_EMAIL=reader@stickanddot.test
DEV_TEST_BUSINESS_EMAIL=business@stickanddot.test
```

### Where The Env Values Come From

Get these from the Supabase dashboard:

| Env key | Where to find it | What it does | Safe in browser? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings > API Keys, or the Connect button | Your project API URL, usually `https://project-ref.supabase.co` | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings > API Keys | Public client key, usually starts with `sb_publishable_`; legacy `anon` key also works | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings > API Keys > secret/service role key | Lets the seed script create confirmed dev users | No |
| `SUPABASE_SECRET_KEY` | Project Settings > API Keys, if using new secret keys | Alternative to `SUPABASE_SERVICE_ROLE_KEY` for the seed script | No |

Important rules:

- Any env var starting with `NEXT_PUBLIC_` is bundled into browser code.
- Never put a secret/service-role key in a `NEXT_PUBLIC_` variable.
- The app itself uses the publishable key plus user sessions/RLS.
- The elevated key is only for `npm run seed:dev`.
- `DEMO_AUTH_ENABLED` and `NEXT_PUBLIC_DEMO_AUTH_ENABLED` are an explicit temporary production demo override for seeded quick-login buttons.
- Do not paste real keys into chat, screenshots, commits, or frontend code.

Run the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Supabase Setup

1. Create or open the Supabase project.
2. Copy the project URL and publishable key into `.env.local`.
3. Copy the secret/service-role key into `.env.local` only if you want to run `npm run seed:dev`.
4. In Supabase SQL Editor, run:

```text
supabase/schema.sql
```

5. In Authentication > URL Configuration, add:

```text
http://localhost:3000/auth/callback
https://your-production-domain.com/auth/callback
```

6. In Authentication > Emails, keep the signup confirmation template synced with the OTP screen by including the token variable:

```html
<p>Your Stick&Dot verification code is:</p>
<h2>{{ .Token }}</h2>
```

7. OAuth providers can stay disabled until credentials are ready. Google should be tested first when OAuth work resumes.

## Dev Seed Users

After running the SQL schema and filling `SUPABASE_SERVICE_ROLE_KEY`, seed local test users:

```bash
npm run seed:dev
```

Default dev accounts:

| Account | Email | Password | Role |
|---|---|---|---|
| Dev Writer | `dev-writer@stickanddot.test` | `StickDotDev123!` | Writer |
| Writer | `writer@stickanddot.test` | `StickDotDev123!` | Writer |
| SME | `sme@stickanddot.test` | `StickDotDev123!` | Subject Expert |
| Reader | `reader@stickanddot.test` | `StickDotDev123!` | Reader |
| Business | `business@stickanddot.test` | `StickDotDev123!` | Client |

When dev auth is enabled, `/login` shows quick-login buttons for these users. This signs into real Supabase users, so RLS still applies.

## Automated Checks

Run these before committing:

```bash
npm run lint
npm run build
npm audit
```

Expected:

- lint passes
- build passes
- audit reports `0 vulnerabilities`

Note: if npm warns that your Node version is unsupported, switch to Node `22.9+` or Node `20.17+` before production work. The app can still build locally, but production tooling should use a supported Node/npm pair.

## What Is Backend-Wired Now

- Dashboard role routes are protected in the Next proxy before client pages render.
- Writer article creation, SME reviews, reader comments, business commissions, commission applications, direct assignment, and application acceptance go through server API routes.
- The backend-wired pages no longer hide empty or broken Supabase data behind demo fallback rows.
- Writer, Reader, Business, and SME dashboards now pull their primary stats/lists from Supabase-backed helpers.
- Mobile dashboard pages keep the existing dark navigation style but use a top rail on small screens instead of squeezing content behind a permanent left sidebar.

The remaining static/demo pages are mostly marketing or secondary profile/settings surfaces. Treat those as lower priority than the role flows below.

## Manual Test Checklist

### 1. Auth And Profile

- Open `/signup`.
- Create a test user through email/password.
- Confirm the OTP screen accepts the email token from Supabase.
- Complete `/signup/details`.
- For Writer and Subject Expert, complete `/signup/expertise`.
- Confirm file upload works for profile credentials or writing samples.
- Log out and log back in with password.
- Try selecting the wrong role on `/login`; the app should reject the mismatch.
- Visit another role dashboard directly, for example `/dashboard/business` while signed in as Writer; it should redirect to the correct dashboard.

### 2. Dev Quick Login

- Set `DEV_AUTH_ENABLED=true` and `NEXT_PUBLIC_DEV_AUTH_ENABLED=true`.
- Lowercase `true` is recommended. The app accepts common truthy casing, but Vercel/Supabase docs and this README use lowercase.
- Run `npm run seed:dev`.
- Open `/login`.
- Confirm quick-login buttons appear.
- Sign into each seeded account:
  - Dev Writer
  - Writer
  - SME
  - Reader
  - Business
- Confirm each account lands on its own dashboard.
- Set both dev auth flags back to `false` before production deploy.

### 2a. Temporary Vercel Demo Login

The normal dev quick-login flags do not show buttons on Vercel Production. That is intentional, so seeded test accounts are not exposed by accident.

For a controlled founder demo on the production deployment:

- Confirm the seeded users exist in the same Supabase project that Vercel is using.
- In Vercel Project Settings > Environment Variables, set these for the Production environment:

```bash
DEMO_AUTH_ENABLED=true
NEXT_PUBLIC_DEMO_AUTH_ENABLED=true
DEV_TEST_PASSWORD=StickDotDev123!
DEV_TEST_DEV_WRITER_EMAIL=dev-writer@stickanddot.test
DEV_TEST_WRITER_EMAIL=writer@stickanddot.test
DEV_TEST_SME_EMAIL=sme@stickanddot.test
DEV_TEST_READER_EMAIL=reader@stickanddot.test
DEV_TEST_BUSINESS_EMAIL=business@stickanddot.test
```

- Redeploy the production deployment after changing env vars. `NEXT_PUBLIC_` values are baked into the browser bundle at build time.
- Open `/login` and confirm the quick-login buttons appear.
- After the demo, set both demo flags back to `false` and redeploy.

### 3. Writer Flow

- Quick-login as Writer.
- Go to `/dashboard/writer/create`.
- Enter a title, body, and tags.
- Click `Save Draft`.
- Go to `/dashboard/writer/portfolio`; the article should appear as `Draft`.
- Create another article and click `Publish`.
- With `SME_REVIEW_MODE=before_publish`, the article should appear as `Pending`.
- Open the article from portfolio with `own=1`; the writer tools panel should show.
- Go to `/dashboard/writer/explore`.
- Open a published article.
- Switch to `Open Commissions`.
- Click `Apply` on a commission; the button should change to `Applied`.
- Visit `/dashboard/business` directly while still logged in as Writer; it should redirect back to `/dashboard/writer`.

### 4. SME Flow

- Quick-login as SME.
- Go to `/dashboard/subject-expert/explore`.
- Confirm only articles in the SME expertise domains appear.
- Open a pending article.
- Rate all quality dimensions.
- Click `Submit Review`.
- Confirm the review success state appears.
- Go back to the review queue; approved articles should become published after review.
- Visit `/dashboard/reader` directly while logged in as SME; it should redirect back to `/dashboard/subject-expert`.

### 5. Reader Flow

- Quick-login as Reader.
- Go to `/explore`.
- Open a published article.
- Add a comment.
- Confirm the comment appears in the comments table.
- Go to `/dashboard/reader/create`.
- Create a reading list using an existing published article title from Explore.
- Go to `/dashboard/reader/reading-list`.
- Confirm the saved article appears.
- Click Start/Continue/Re-read and confirm it opens the article.
- Remove a saved article and confirm it disappears.
- Open a missing article slug such as `/articles/not-real`; it should show the article-not-found state instead of demo article text.

### 6. Business Flow

- Quick-login as Business.
- Go to `/dashboard/business/commission`.
- Post a commission with topic, domain, due date, word count, instructions, and payment amount.
- Confirm the commission appears in Active Orders.
- Go to `/dashboard/business/writers`.
- Confirm the writer directory loads from Supabase profiles.
- Switch back to Writer and confirm the commission appears under Open Commissions.
- Apply as Writer.
- Switch back to Business and confirm the commission status changes from open toward applied/assigned as the flow is expanded.
- Visit `/dashboard/writer` directly while logged in as Business; it should redirect back to `/dashboard/business`.

### 7. Review Mode Switch

Test all three review modes by changing `.env.local`, restarting the dev server, and creating a new article:

```bash
SME_REVIEW_MODE=before_publish
NEXT_PUBLIC_SME_REVIEW_MODE=before_publish
```

- Writer publish sends every article to SME review.

```bash
SME_REVIEW_MODE=commissions_only
NEXT_PUBLIC_SME_REVIEW_MODE=commissions_only
```

- Independent writer articles publish directly.
- Commission-linked articles require SME review.

```bash
SME_REVIEW_MODE=optional
NEXT_PUBLIC_SME_REVIEW_MODE=optional
```

- Writer publish makes articles public immediately.
- SME can still review eligible articles when available.

### 8. RLS Checks

Do these before shipping:

- Reader cannot edit writer articles.
- Writer cannot edit another writer's articles.
- SME cannot see draft articles.
- SME cannot review articles outside their expertise domains.
- Business cannot see another business account's private commissions.
- Public visitors can read published articles.
- Public visitors cannot comment without logging in.

## Production Checklist

- Run `npm run lint`.
- Run `npm run build`.
- Run `npm audit`.
- Confirm the build output shows the API routes under `/api/articles`, `/api/commissions`, and `/api/dev-auth`.
- Apply `supabase/schema.sql` to production Supabase before Vercel deploy.
- Configure Vercel env vars.
- Do not add `SUPABASE_SERVICE_ROLE_KEY` as a public env var.
- Keep `DEV_AUTH_ENABLED=false` and `NEXT_PUBLIC_DEV_AUTH_ENABLED=false` in production.
- Keep `DEMO_AUTH_ENABLED=false` and `NEXT_PUBLIC_DEMO_AUTH_ENABLED=false` except during a controlled founder/demo session.
- Configure custom SMTP before real email volume.
- Configure OAuth providers only after provider callback URLs are ready.
- Do one full role-by-role seeded test before committing or shipping.
- Test mobile layouts at roughly `390x844`, tablet at `768x1024`, and desktop at `1440x900`.
