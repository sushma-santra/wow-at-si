# 🆓 Complete FREE Hosting Setup Guide

Yes! You can host everything for **completely free**. Here's the best free option:

## 🎯 Best Free Option

### Option 1: Vercel + Vercel Postgres (EASIEST - RECOMMENDED)
- **Database**: Vercel Postgres (free tier)
- **Hosting**: Vercel (free tier)
- **Everything integrated** - Best experience

### Option 2: Neon + Vercel (ALSO GREAT)
- **Database**: Neon (free PostgreSQL)
- **Hosting**: Vercel (free tier)
- Simple setup, reliable

### Option 3: Supabase + Vercel (FULL FEATURED)
- **Database**: Supabase (free PostgreSQL)
- **Hosting**: Vercel (free tier)
- Extra features included

I recommend **Option 1 (Vercel + Vercel Postgres)** for simplest setup.

---

## 📋 Free Tier Limits

### Vercel Postgres (FREE)
- **Storage**: 256 MB
- **Connections**: 3 concurrent
- **Perfect for**: Getting started, testing
- **Cost**: $0/month

### Neon (FREE)
- **Storage**: 3 GB
- **Connections**: 100 concurrent
- **Perfect for**: Production use
- **Cost**: $0/month

### Vercel Hosting (FREE)
- **Bandwidth**: 100 GB/month
- **Functions**: Unlimited
- **Deployments**: Unlimited
- **Cost**: $0/month

---

## 🚀 COMPLETE SETUP: Vercel + Vercel Postgres (RECOMMENDED)

This is the **easiest and fastest way** to get everything running free.

### Step 1: Create GitHub Account (FREE)

1. Go to [github.com](https://github.com)
2. Click "Sign Up"
3. Complete registration
4. Verify email

### Step 2: Push Your Code to GitHub

```bash
# Navigate to your project
cd women-community-app

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Women Community App"

# Create new repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR-USERNAME/women-community-app.git
git branch -M main
git push -u origin main
```

### Step 3: Create Vercel Account (FREE)

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel
5. Click "Create Team" → "Continue"

### Step 4: Create Vercel Project with Database

This is the magic part - Vercel creates the database FOR you!

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Select your `women-community-app` repository
3. Click **"Import"**
4. Under "Configure Project":
   - Framework: **Next.js** (auto-detected)
   - Root Directory: **/** (auto-detected)
   - Click **"Deploy"**

### Step 5: Add Vercel Postgres Database

While it's deploying, let's add the database:

1. Click **"Storage"** tab (top menu)
2. Click **"Create New"** → **"Database"**
3. Select **"Postgres"**
4. Name: `women-community-db`
5. Choose region closest to you
6. Click **"Create"**

### Step 6: Copy Database Connection String

1. Click on your database
2. Click **"Connect"** → **".env.local"**
3. Copy the connection string that looks like:
   ```
   postgres://user:password@ep-xxxxx.region.postgres.vercel.sh/dbname
   ```

### Step 7: Set Environment Variables

1. Go to your Vercel Project Settings
2. Click **"Environment Variables"**
3. Add these variables:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Paste your Vercel Postgres connection string |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` (run in terminal) |
| `NEXTAUTH_URL` | `https://your-project-name.vercel.app` |
| `GOOGLE_CLIENT_ID` | Get from Step 8 below |
| `GOOGLE_CLIENT_SECRET` | Get from Step 8 below |

4. Click "Save"

### Step 8: Set Up Google OAuth (FREE)

This allows users to sign in with Google.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click "Select a Project" → "New Project"
3. Name: `Women Community App`
4. Click "Create"
5. Wait for project creation (may take a minute)
6. Search for **"Google+ API"** in search bar
7. Click on it → Click **"Enable"**
8. Go to **"Credentials"** (left sidebar)
9. Click **"Create Credentials"** → **"OAuth Client ID"**
10. If prompted, click "Configure OAuth Consent Screen first":
    - User Type: **Internal**
    - App name: `Women Community`
    - User support email: Your email
    - Developer contact: Your email
    - Click "Save and Continue"
    - Scopes: Click "Add or Remove Scopes"
      - Search for: `openid`, `email`, `profile`
      - Select all three
      - Click "Update"
    - Click "Save and Continue" → "Back to Dashboard"

11. Now click **"Create Credentials"** → **"OAuth Client ID"** again
12. Application type: **Web application**
13. Name: `Women Community`
14. Under "Authorized origins", add:
    ```
    https://your-project.vercel.app
    https://localhost:3000
    ```
15. Under "Authorized redirect URIs", add:
    ```
    https://your-project.vercel.app/api/auth/callback/google
    https://localhost:3000/api/auth/callback/google
    ```
16. Click "Create"
17. Copy **Client ID** and **Client Secret**

### Step 9: Add Google OAuth to Vercel

1. Go back to Vercel Project
2. Settings → Environment Variables
3. Add:
   - `GOOGLE_CLIENT_ID` = Your Client ID
   - `GOOGLE_CLIENT_SECRET` = Your Client Secret
4. Click "Save"

### Step 10: Run Database Migrations

```bash
# Pull environment variables from Vercel
npm install -g vercel
vercel env pull

# Run migrations
npm run prisma:push

# Done! Your database is set up!
```

### Step 11: Redeploy to Apply Changes

1. Go to Vercel dashboard
2. Go to "Deployments"
3. Click "..." on latest deployment
4. Click "Redeploy"
5. Wait for deployment to complete

### Step 12: Create Allowlist CSV

Create a file named `allowlist.csv`:

```csv
email
user1@company.com
user2@company.com
user3@company.com
admin@company.com
```

### Step 13: Upload Allowlist

1. Visit your deployed app: `https://your-project.vercel.app`
2. You should see login screen
3. For first access, add one of your CSV emails
4. Sign in with that Google email
5. Go to **Admin** (top right)
6. Click **"Email Allowlist"**
7. Upload your CSV file
8. Done!

### Step 14: Share With Your Team

Your app is now live at:
```
https://your-project-name.vercel.app
```

Share this URL with your organization. Users in the allowlist can sign in with their Google account.

---

## 💰 Cost Summary (COMPLETELY FREE)

| Service | Free Tier | Cost |
|---------|-----------|------|
| **Vercel Hosting** | 100 GB/month bandwidth | $0 |
| **Vercel Postgres** | 256 MB storage | $0 |
| **Google OAuth** | Unlimited logins | $0 |
| **GitHub** | Unlimited public repos | $0 |
| **TOTAL MONTHLY** | | **$0** |

---

## 🔄 Alternative: Neon + Vercel (If You Want More DB Space)

If 256 MB isn't enough, use Neon (3 GB free):

### Step 1: Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create new project
4. Copy connection string

### Step 2: Use in Vercel

1. Vercel Settings → Environment Variables
2. Set `DATABASE_URL` to your Neon connection string
3. Continue with Step 7 above

That's it! Same process, just bigger database.

---

## 🔄 Alternative: Supabase + Vercel (If You Want Extra Features)

Supabase includes: Database + Auth + Storage + Realtime

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create new project
4. Go to "Connection Pooler" (pgBouncer mode)
5. Copy connection string

### Step 2: Use in Vercel

1. Vercel Settings → Environment Variables
2. Set `DATABASE_URL` to your Supabase connection string
3. Continue with Step 7 above

---

## ✅ Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Vercel project imported
- [ ] Vercel Postgres created
- [ ] Database connection string added to env vars
- [ ] Google OAuth credentials created
- [ ] Google OAuth env vars added to Vercel
- [ ] NEXTAUTH_SECRET generated and added
- [ ] Migrations run with `npm run prisma:push`
- [ ] Project redeployed
- [ ] Allowlist CSV created
- [ ] Allowlist uploaded via admin panel
- [ ] App working and accessible

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct in Vercel env vars
- Run `vercel env pull` locally
- Run `npm run prisma:push` again

### "Google OAuth error"
- Verify redirect URIs in Google Cloud Console
- Make sure they match your Vercel domain exactly
- Wait 5-10 minutes for changes to apply
- Clear browser cookies and try again

### "Cannot find module 'next-auth'"
- Run `npm install` after pulling env vars
- Vercel should auto-install during build

### "Access Denied when signing in"
- Email not in allowlist
- Upload CSV via admin dashboard
- Or run `npm run prisma:studio` locally to add emails manually

---

## 📱 Local Development (While Deployed)

You can still develop locally and push changes:

```bash
# Pull Vercel env vars
vercel env pull

# Install dependencies
npm install

# Start local dev server
npm run dev

# Make changes, test locally
# Then push to GitHub
git add .
git commit -m "Your changes"
git push origin main

# Vercel auto-deploys when you push!
```

---

## 🎯 What You Get (COMPLETELY FREE)

✅ Fully deployed web app
✅ PostgreSQL database with 256 MB storage
✅ Custom domain: `your-app.vercel.app`
✅ Unlimited users (within free tier)
✅ Google authentication
✅ Complete anonymity system
✅ Moderation dashboard
✅ Email allowlist management
✅ Automatic backups
✅ HTTPS/SSL included
✅ Custom domain support (for additional cost if desired)

---

## 🆘 Need More Help?

### Common Questions

**Q: Can I upgrade later?**
A: Yes! When you hit limits, upgrade to Vercel Pro ($20/month) or Neon paid ($25/month for larger DB)

**Q: How many users can the free tier support?**
A: Theoretically unlimited, but Vercel Postgres has 3 concurrent connections. For more concurrent users, upgrade Neon (100 connections on free) or upgrade Vercel Postgres.

**Q: Can I use my own domain?**
A: Yes! Upgrade to Vercel Pro ($20/month) for custom domains. Free tier uses `vercel.app`.

**Q: How do I update the allowlist?**
A: Two ways:
1. Admin dashboard → Upload new CSV
2. `npm run prisma:studio` locally to edit directly

**Q: How do I back up my data?**
A: Vercel and Neon both backup automatically. You can also export via Prisma:
```bash
npm run prisma:db:pull
```

**Q: Can I move to a different hosting later?**
A: Yes! All code is portable. Just update DATABASE_URL and redeploy anywhere.

---

## 🎉 You're Ready!

Everything you need is **completely free**. Follow the steps above and you'll have a live app in about 30 minutes!

**Questions?** All answers are in the README.md and SETUP.md files included with your project.

---

**Next: Follow the 14 steps above to deploy your app!**
