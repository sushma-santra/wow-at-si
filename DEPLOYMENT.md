# Run Locally & Deploy on Vercel

## Run locally

1. **Install and env**
   ```bash
   npm install
   cp .env.local.example .env.local
   ```
   Edit `.env.local`: set `DATABASE_URL` (PostgreSQL), `NEXTAUTH_SECRET`, `NEXTAUTH_URL=http://localhost:3000`, and optionally Google OAuth (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).

2. **Database**
   ```bash
   npm run prisma:push
   node scripts/seed.js   # optional
   ```

3. **Start**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## Deploy on Vercel

### Fixes applied in this repo (so build succeeds)

- **NextAuth types**: `session.user.isAdmin` is declared in `types/next-auth.d.ts`.
- **SessionProvider**: Wrapped in a client component `components/Providers.tsx` so the root layout stays a Server Component (avoids “React Context is unavailable in Server Components”).
- **Viewport**: Moved from `metadata.viewport` to a separate `viewport` export in `app/layout.tsx` (Next.js 14).
- **Login page**: `useSearchParams()` is used inside a component wrapped in `<Suspense>` to satisfy static generation.
- **API routes**: Routes that use `getServerSession()` or cookies have `export const dynamic = "force-dynamic"` so they are not statically prerendered.
- **Prisma on Vercel**: `postinstall` runs `prisma generate` so the client is available after `npm install`.

### Vercel project setup

1. **Environment variables** (Vercel → Project → Settings → Environment Variables):

   | Variable              | Value / note |
   |-----------------------|--------------|
   | `DATABASE_URL`        | PostgreSQL URL (Vercel Postgres, Neon, Supabase, etc.) |
   | `NEXTAUTH_SECRET`     | e.g. `openssl rand -base64 32` |
   | `NEXTAUTH_URL`        | `https://<your-app>.vercel.app` (no trailing slash) |
   | `GOOGLE_CLIENT_ID`    | From Google Cloud Console |
   | `GOOGLE_CLIENT_SECRET`| From Google Cloud Console |

2. **Build**
   - Build Command: `npm run build` (default).
   - Install Command: `npm install` (default).

3. **After first deploy**
   - Apply schema to the production DB (from your machine with env from Vercel):
     ```bash
     npx vercel env pull
     npm run prisma:push
     ```
   - In Google Cloud Console, add your Vercel URL to OAuth authorized origins and redirect URIs:
     - Origin: `https://<your-app>.vercel.app`
     - Redirect: `https://<your-app>.vercel.app/api/auth/callback/google`

4. **Redeploy** after changing env vars so the new values are used.

### If you still see errors on Vercel

- **Build**: Check the build log; the same TypeScript and prerender issues addressed above should be resolved. If something new appears, share the exact error.
- **Runtime (e.g. DB or auth)**:
  - Confirm `DATABASE_URL` is set and correct for the hosted DB.
  - Confirm `NEXTAUTH_URL` matches the deployed URL and OAuth redirect URI.

For full setup (DB options, Google OAuth, allowlist), see `SETUP.md`.
