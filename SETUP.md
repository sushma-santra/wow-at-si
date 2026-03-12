# Women Community App - Complete Setup Guide

This guide walks you through setting up the Women Community app from scratch and deploying it to Vercel.

## 📋 Prerequisites

Before starting, you'll need:
- GitHub account (for code hosting)
- Vercel account (free tier works)
- PostgreSQL database (Vercel Postgres, Neon, or Supabase)
- Google Cloud account (for OAuth)
- Node.js 18+ installed locally
- npm or yarn

## 🔧 Part 1: Local Development Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd women-community-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up PostgreSQL Database

Choose one of these options:

#### Option A: Local PostgreSQL (Easiest for Development)

```bash
# Install PostgreSQL if you haven't already
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql
# Windows: Download from postgresql.org

# Start PostgreSQL service
# macOS: brew services start postgresql
# Ubuntu: sudo service postgresql start
# Windows: Start PostgreSQL from services

# Create a new database
createdb women_community

# Get connection string
# Usually: postgresql://postgres:password@localhost:5432/women_community
```

#### Option B: Neon (Recommended for Cloud)

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy your connection string:
   ```
   postgresql://user:password@ep-name.neon.tech/women_community
   ```

#### Option C: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to "Connection Pooler" (pgBouncer)
4. Copy the connection string

### Step 4: Configure Environment Variables

```bash
# Copy template
cp .env.local.example .env.local

# Edit .env.local with your values
nano .env.local  # or use your favorite editor
```

Fill in:
```env
DATABASE_URL="your-connection-string-here"
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="will-set-later"
GOOGLE_CLIENT_SECRET="will-set-later"
NODE_ENV="development"
```

### Step 5: Set Up Google OAuth

#### In Google Cloud Console:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)

2. Create a new project:
   - Click "Select a Project" → "New Project"
   - Name: "Women Community App"
   - Click "Create"

3. Enable Google+ API:
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth credentials:
   - Go to "Credentials" (left sidebar)
   - Click "Create Credentials" → "OAuth Client ID"
   - Choose "Web application"
   - Name: "Women Community"
   - Add Authorized origins:
     ```
     http://localhost:3000
     http://localhost:3001
     ```
   - Add Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     http://localhost:3001/api/auth/callback/google
     ```
   - Click "Create"
   - Copy the Client ID and Client Secret

5. Update `.env.local`:
   ```env
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### Step 6: Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database schema
npm run prisma:push

# Seed with sample data (optional)
node scripts/seed.js
```

### Step 7: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 8: Add Allowed Emails

#### Option A: Via Admin Dashboard (after first sign-in)

1. Create `allowlist.csv`:
   ```csv
   email
   your-email@company.com
   user1@company.com
   user2@company.com
   ```

2. Sign in with Google (use any email for now to access the site)
3. Go to `/admin`
4. Upload your CSV file

#### Option B: Update Database Directly

```bash
npm run prisma:studio

# Open Prisma Studio and add emails to AllowedEmail table manually
```

### Step 9: Test the App

1. Sign out if logged in
2. Visit [http://localhost:3000](http://localhost:3000)
3. Try signing in with an email in your allowlist
4. Create a post, add a comment, add reactions
5. Test admin panel

## 🚀 Part 2: Deploy to Vercel

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Initial commit: Women Community App"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### Step 3: Create Vercel Project

1. In Vercel dashboard, click "Add New..." → "Project"
2. Select your GitHub repository
3. Click "Import"
4. Configure project:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`
5. Click "Deploy"

### Step 4: Add Environment Variables

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add these variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your PostgreSQL connection string |
   | `NEXTAUTH_SECRET` | `openssl rand -base64 32` (run locally to generate) |
   | `NEXTAUTH_URL` | `https://your-app-name.vercel.app` |
   | `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
   | `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret |
   | `NODE_ENV` | `production` |

4. Click "Save"

### Step 5: Trigger Deployment

1. Go to "Deployments" tab
2. Click "..." on the latest deployment
3. Click "Redeploy"

### Step 6: Set Up Database

After first deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Pull environment variables
vercel env pull

# Run migrations
npm run prisma:push
```

### Step 7: Update Google OAuth

In Google Cloud Console:

1. Go to your OAuth credentials
2. Add your Vercel domain to Authorized origins:
   ```
   https://your-app-name.vercel.app
   ```
3. Add your Vercel domain to Authorized redirect URIs:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

### Step 8: Upload Email Allowlist

1. Create your final `allowlist.csv` with all authorized emails
2. Visit your deployed app: `https://your-app-name.vercel.app`
3. Sign in (use any email that's in your CSV)
4. Go to Admin → Email Allowlist
5. Upload your CSV file

## ✅ Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Google Sign-In works
- [ ] Can create posts
- [ ] Can add comments
- [ ] Can add reactions
- [ ] Can report posts
- [ ] Admin dashboard accessible
- [ ] Can upload new allowlist
- [ ] Database backups configured (if using Vercel Postgres)
- [ ] Custom domain configured (if desired)

## 🔒 Security Checklist

- [ ] `NEXTAUTH_SECRET` is unique and strong
- [ ] Environment variables are not in `.env.local` in GitHub
- [ ] Database credentials are not exposed
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Google OAuth callback URLs are correct
- [ ] Admin users are properly configured

## 🐛 Common Issues & Solutions

### "Access Denied" on Login
**Problem**: Email not in allowlist
**Solution**: Add email to allowed_emails table or upload new CSV via admin

### Database Connection Error
**Problem**: `DATABASE_URL` is incorrect
**Solution**:
1. Go to Vercel Settings → Environment Variables
2. Verify `DATABASE_URL` is correct
3. Redeploy

### Google OAuth Error
**Problem**: Redirect URI mismatch
**Solution**:
1. Check your Vercel domain in Google Cloud Console
2. Ensure redirect URI matches exactly: `https://yourdomain.com/api/auth/callback/google`
3. Wait 5-10 minutes for changes to take effect

### Migrations Failed
**Problem**: Schema sync issues
**Solution**:
```bash
vercel env pull
npm run prisma:push
```

### Prisma Client Not Found
**Problem**: Migration didn't run
**Solution**:
```bash
npm run prisma:generate
npm run prisma:push
```

## 📚 Useful Commands

```bash
# Local Development
npm run dev              # Start dev server
npm run prisma:studio   # Open database GUI
npm run build           # Build for production

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:push     # Sync schema to database
npm run prisma:migrate  # Create migration
node scripts/seed.js    # Add sample data

# Deployment
vercel env pull         # Pull Vercel environment vars
vercel deploy          # Deploy to Vercel
vercel logs            # View logs
```

## 📞 Getting Help

- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Prisma Docs**: https://www.prisma.io/docs
- **Vercel Docs**: https://vercel.com/docs

## 🎉 You're Done!

Your Women Community app is now live! Share the URL with your organization and start building a supportive community.

Remember:
- Keep email allowlist updated
- Monitor reported posts regularly
- Maintain database backups
- Keep dependencies updated
