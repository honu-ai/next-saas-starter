# Database Configuration Guide

This project can run in two modes:

## 1. Static Mode (No Database)

Perfect for running the site as a static page without authentication or subscription features.

### Setup

1. Copy the static environment template:
   ```bash
   cp .env.static.example .env
   ```

2. Simply **don't set** `POSTGRES_URL` - the app will automatically run in static mode

3. Start the development server:
   ```bash
   pnpm dev
   ```

### What's Available in Static Mode

- ✅ All static pages (landing, blog, pricing, terms, privacy)
- ✅ Public content and marketing pages
- ❌ User authentication (sign up/sign in)
- ❌ Dashboard and protected routes
- ❌ Subscription management
- ❌ Activity logging

---

## 2. Full Mode (With Database)

Enables all features including authentication, subscriptions, and user management.

### Setup

1. Copy the full environment template:
   ```bash
   cp .env.full.example .env
   ```

2. Set up your database:
   - **Option A**: Use the automated setup script
     ```bash
     pnpm run db:setup
     ```
   - **Option B**: Manually configure your `.env` file

3. Required environment variables:
   ```env
   # Database connection (presence enables database features)
   POSTGRES_URL=postgresql://user:password@host:port/database

   STRIPE_API_KEY=sk_test_your_stripe_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   BASE_URL=http://localhost:3000
   AUTH_SECRET=your_auth_secret_here
   ```

4. Run database migrations:
   ```bash
   pnpm run db:migrate
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

### What's Available in Full Mode

- ✅ All static pages
- ✅ User authentication and session management
- ✅ Dashboard and protected routes
- ✅ Stripe subscription management
- ✅ Activity logging
- ✅ User profile management

---

## Switching Between Modes

You can switch between modes by adding or removing the `POSTGRES_URL` environment variable in your `.env` file:

```env
# Static mode - just omit or comment out POSTGRES_URL
# POSTGRES_URL=...

# Full mode - set POSTGRES_URL
POSTGRES_URL=postgresql://user:password@host:port/database
```

After changing the mode, restart your development server.

---

## How It Works

The application uses a feature flag system that automatically switches between real and mock database queries:

- **lib/config/features.ts**: Feature flag configuration (checks for `POSTGRES_URL`)
- **lib/db/index.ts**: Query proxy that routes to real or mock implementations
- **lib/db/queries.ts**: Real database queries (used when `POSTGRES_URL` is set)
- **lib/db/queries-mock.ts**: Mock queries (used when `POSTGRES_URL` is not set)

All database imports use `@/lib/db` which automatically provides the correct implementation based on whether `POSTGRES_URL` is set.
