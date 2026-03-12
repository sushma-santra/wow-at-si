# Women Community - Anonymous Support Platform

A secure, privacy-focused web application providing a safe anonymous space for women in your organization to share thoughts, ask questions, and support each other.

## 🔒 Privacy & Security Guarantees

- **Complete Anonymity**: Posts and comments are NEVER linked to user identity
- **Authentication Only**: Email verification is used solely for access control
- **No User Tracking**: Even administrators cannot identify who posted what
- **No Activity Logs**: Session data is temporary and not stored with user information
- **XSS & Injection Protection**: All content is sanitized and validated
- **Rate Limiting**: Protects against spam and abuse

## ✨ Features

### Core Features
- 🔐 **Google OAuth Authentication** with email allowlist validation
- 💬 **Anonymous Posts** with categories (Advice, Workplace, Mental Health, General)
- 💭 **Nested Comments** - all completely anonymous
- ❤️ **Reactions** - Support, Agree, Hug
- 🚩 **Content Moderation** - Users can report posts, admins review and take action
- 📊 **Admin Dashboard** - Manage reported posts and email allowlist
- 📱 **Mobile-First Design** - Beautiful, responsive UI
- 🎨 **Dark Mode Support** - Comfortable for all lighting conditions

### Admin Features
- 📋 **CSV Email Allowlist Upload** - Easily manage who can access the platform
- 🛡️ **Post Moderation Panel** - Review, approve, or remove reported posts
- 📈 **Activity Audit Trail** - Track moderation actions (not tied to user identity)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel
- **Security**: Content sanitization with DOMPurify & sanitize-html

### Database Schema

```
User (auth only)
├─ id, email, isAdmin, createdAt

AllowedEmail
├─ id, email

Post (ANONYMOUS - no userId)
├─ id, content, category, createdAt, isReported

Comment (ANONYMOUS - no userId)
├─ id, postId, content, createdAt

Reaction (ANONYMOUS)
├─ id, type, postId, commentId, createdAt

ReportedPost
├─ id, postId, reason, reviewed, action, createdAt

RateLimit (keyed by session, not user)
├─ sessionId (hashed), action, count, resetAt

AuditLog (action logs, not user-tied)
├─ action, postId, reason, createdAt
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database (Vercel Postgres, Neon, or Supabase)
- Google OAuth credentials

### 1. Clone and Install

```bash
git clone <repo-url>
cd women-community-app
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your values:

```env
# Database (use your PostgreSQL provider)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth - get from Google Cloud Console
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:push

# Optional: Open Prisma Studio to view database
npm run prisma:studio
```

### 4. Create Initial Admin Account

```bash
node scripts/seed.js
```

This will:
- Add an admin user with your email
- Add sample allowed emails to get started

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and sign in with Google.

## 📋 Creating the Allowlist

### CSV Format

Create a CSV file named `allowlist.csv`:

```csv
email
user1@company.com
user2@company.com
user3@company.com
```

### Upload to Admin Dashboard

1. Sign in to the app
2. Go to **Admin** → **Email Allowlist**
3. Click to upload `allowlist.csv`
4. Confirm the upload

Users with emails in the allowlist can now access the platform.

## 🔑 Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)

### 2. Configure OAuth Consent Screen

1. Go to OAuth consent screen
2. User type: Internal (or External if not using Google Workspace)
3. Add your organization info
4. Add scopes: `openid`, `profile`, `email`
5. Add test users (during development)

### 3. Get Credentials

1. Go to Credentials
2. Click "Create Credentials" → OAuth Client ID
3. Application type: Web application
4. Authorized origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (prod)

Copy the Client ID and Client Secret to your `.env.local`.

## 📦 Database Setup

### Option 1: Vercel Postgres (Recommended)

1. In your Vercel project, add Postgres database
2. Copy the `POSTGRES_PRISMA_URL` from dashboard
3. Use as `DATABASE_URL` in `.env.local`

### Option 2: Neon

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string
4. Use as `DATABASE_URL`

### Option 3: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Connection Pooler (pgBouncer)
4. Copy connection string
5. Use as `DATABASE_URL`

## 🌐 Deploy to Vercel

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` (generate new: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your Vercel domain)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
5. Click "Deploy"

### 3. Run Migrations on Vercel

After first deployment:

```bash
# Connect to Vercel using Vercel CLI
vercel env pull

# Run migrations
npm run prisma:push
```

### 4. Update Google OAuth URLs

Update Google OAuth redirect URIs to your Vercel domain:
- `https://your-app.vercel.app/api/auth/callback/google`

## 🛡️ Security Best Practices

### What We Do ✅
- Hash session IDs for rate limiting (prevents user tracking)
- Use HTTP-only cookies for sessions
- Sanitize all user input (XSS protection)
- Validate content on frontend and backend
- Rate limit post/comment creation
- Remove metadata from posts
- No email stored with posts or comments

### What NOT to Do ❌
- Don't log user IDs with post IDs
- Don't add user tracking/analytics tied to identity
- Don't store comment authors
- Don't create user profiles
- Don't display usernames
- Don't keep activity logs per user
- Don't allow admin to see who posted what

### Content Moderation
- Users can report posts with a reason
- Admins review flagged content
- Admins can approve, remove, or dismiss reports
- Actions are logged without user identification

## 📱 Features Overview

### Public Pages
- `/login` - Google Sign-In
- `/auth/access-denied` - Access denied page

### User Pages
- `/` - Feed (all posts)
- `/posts/[postId]` - Post detail with comments
- `/api/posts` - Create post, list posts
- `/api/posts/[postId]/comments` - Add comments
- `/api/reactions` - Add reactions

### Admin Pages
- `/admin` - Moderation dashboard
- `/api/admin/reported-posts` - View reported posts
- `/api/admin/reported-posts/[reportId]` - Handle reports
- `/api/admin/upload-allowlist` - Upload email allowlist

## 🔒 Rate Limits

- **Posts**: 5 per session per 24 hours
- **Comments**: 10 per session per 24 hours
- **Reactions**: 50 per session per hour

Rate limits are session-based (not user-based) to prevent user tracking.

## 📊 Monitoring

### What to Monitor
- Error logs in Vercel dashboard
- Database connection health
- Rate limit usage
- Reported post queue

### What NOT to Monitor
- User posting activity
- User session data
- Who is accessing what
- User browsing patterns

## 🐛 Troubleshooting

### "Access Denied" on Login
- Check if email is in allowlist
- Verify allowlist CSV format
- Ensure database has AllowedEmail records

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check database is running
- Ensure database credentials are valid

### Google OAuth Error
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check redirect URIs match your domain
- Ensure Google+ API is enabled

### Posts Not Appearing
- Check if posts are being created (check database)
- Verify `POST_CREATE` rate limit hasn't been exceeded
- Clear browser cache and refresh

## 📚 API Documentation

### Create Post
```bash
POST /api/posts
Content-Type: application/json

{
  "content": "Your post content",
  "category": "General" | "Advice" | "Workplace" | "Mental Health"
}

Response: { id, content, category, createdAt }
```

### Get Posts
```bash
GET /api/posts?page=1

Response: {
  posts: [{ id, content, category, createdAt, _count }],
  pagination: { page, pageSize, total, pages }
}
```

### Add Comment
```bash
POST /api/posts/[postId]/comments
Content-Type: application/json

{
  "content": "Your comment"
}

Response: { id, content, postId, createdAt }
```

### Add Reaction
```bash
POST /api/reactions
Content-Type: application/json

{
  "type": "SUPPORT" | "AGREE" | "HUG" | "COMMENT",
  "postId": "[postId]"
}

Response: { id, type, postId, createdAt }
```

### Report Post
```bash
POST /api/posts/[postId]/report
Content-Type: application/json

{
  "reason": "Why you're reporting this post"
}

Response: { id, postId, reason, reviewed, action, createdAt }
```

## 🤝 Contributing

To maintain privacy and security:
1. Never add user identification to posts/comments
2. Never add user tracking or analytics
3. Always validate and sanitize input
4. Always hash sensitive session data
5. Never log personally identifiable information with posts

## 📄 License

Private - Internal use only

## 🆘 Support

For questions or issues:
1. Check the troubleshooting section
2. Review database schema in `prisma/schema.prisma`
3. Check NextAuth documentation: https://next-auth.js.org
4. Check Next.js documentation: https://nextjs.org

## 🔐 Privacy Policy Recommendation

Consider adding a privacy policy explaining:
- All posts are completely anonymous
- Google authentication is used only for access control
- No activity is logged per user
- Admin moderation doesn't reveal poster identity
- Data retention policy
