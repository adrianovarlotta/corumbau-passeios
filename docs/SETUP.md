# Setup Guide

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL (or Neon account)

## Quick Start

```bash
# 1. Clone
git clone https://github.com/adrianovarlotta/corumbau-passeios.git
cd corumbau-passeios

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Copy env template
cp .env.example .env

# 4. Configure .env (see below)

# 5. Run migrations
npx prisma migrate dev

# 6. Seed database
npx prisma db seed

# 7. Start dev server
npm run dev
```

## Environment Variables

### Required

```env
# PostgreSQL connection (Neon recommended)
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"

# Auth.js secret (generate: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-here"

# App URL
NEXTAUTH_URL="http://localhost:3000"
```

### Mercado Pago (for payments)

1. Go to https://www.mercadopago.com.br/developers/panel
2. Create an application
3. Go to "Credenciais de teste" (test credentials)
4. Copy Access Token and Public Key

```env
MERCADOPAGO_ACCESS_TOKEN="TEST-xxxx-xxxx-xxxx"
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="TEST-xxxx-xxxx-xxxx"
```

### Optional

```env
# Email (Resend)
RESEND_API_KEY="re_xxxx"

# App URL for production
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

## Database Setup (Neon)

1. Create account at https://neon.tech
2. Create a new project
3. Copy the connection string to `DATABASE_URL`
4. Run `npx prisma migrate dev` to create tables
5. Run `npx prisma db seed` to add initial data

### Default Users (from seed)

| Email | Password | Role |
|---|---|---|
| admin@corumbau.com | admin123 | ADMIN |
| operador@corumbau.com | operador123 | OPERATOR |

## Mercado Pago Sandbox Testing

### Test Cards

| Brand | Number | CVV | Expiry |
|---|---|---|---|
| Visa | 4509 9535 6623 3704 | 123 | Any future |
| Mastercard | 5031 4332 1540 6351 | 123 | Any future |

**Test CPF:** 12345678909

### Test Accounts

Create test buyer/seller accounts in the Mercado Pago developer panel under "Contas de teste".

### Webhook Testing (Local)

For local development, use ngrok or similar to expose your webhook:

```bash
ngrok http 3000
```

Then set the webhook URL in Mercado Pago panel:
`https://your-ngrok-url.ngrok.io/api/webhooks/mercadopago`

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL        # https://your-domain.vercel.app
vercel env add MERCADOPAGO_ACCESS_TOKEN
```

## Common Issues

### `MODULE_NOT_FOUND` error in dev
```bash
rm -rf .next && npm run dev
```

### Prisma types out of sync
```bash
npx prisma generate
```

### npm install fails with peer dependency errors
```bash
npm install --legacy-peer-deps
```

### Port 3000 already in use
The dev server will automatically pick the next available port (e.g., 3001).

## Useful Commands

```bash
npm run dev               # Start dev server
npm run build             # Production build
npm run tokens            # Regenerate CSS from design tokens
npm run storybook         # Storybook on port 6006
npx prisma studio         # Database GUI (browser)
npx prisma migrate dev    # Create/run migrations
npx prisma db seed        # Seed database
npx prisma migrate reset  # Reset database (WARNING: deletes all data)
```
