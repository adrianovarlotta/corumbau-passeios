# Corumbau Passeios

Plataforma de vendas online + gestao operacional para agencia de passeios em Corumbau/BA.

## Stack
- Next.js 15 (App Router) + TypeScript strict
- Tailwind CSS 4 + shadcn/ui
- TanStack Query (data fetching client)
- Prisma + PostgreSQL (Neon)
- Auth.js v5 (admin/operator login only — customers are guests)
- Stripe (Pix + Cartao de Credito)
- Resend (emails transacionais)
- Storybook 10 (design system documentation)

## Conventions
- **Design tokens**: Single source of truth in `design-system/tokens.ts`. Run `npm run tokens` to generate CSS.
- **Zero hardcoded hex**: Always use Tailwind semantic classes (`bg-primary`, `text-foreground`). Never `bg-[#hex]`.
- **Components**: All in `src/components/`. Stories in `stories/`.
- **API routes**: RESTful in `src/app/api/`. Public routes have no auth. Admin routes check role=ADMIN. Operator routes check role=OPERATOR.
- **Forms**: react-hook-form + zod for validation.
- **Data fetching**: TanStack Query hooks in `src/hooks/`.
- **Guest checkout**: Tourists buy without creating an account. Booking has customerName/Email/Phone directly.

## Project Structure
- `src/app/(public)/` — Public routes (landing, shop, checkout)
- `src/app/(admin)/admin/` — Admin dashboard (protected, role=ADMIN)
- `src/app/(operator)/check/` — Check-in module (protected, role=OPERATOR)
- `src/app/api/` — API routes
- `src/components/` — UI components
- `src/hooks/` — TanStack Query hooks
- `src/lib/` — Utilities, auth, db, stripe, email
- `src/types/` — TypeScript types
- `design-system/` — Tokens, utils, CSS generator
- `prisma/` — Schema + migrations
- `stories/` — Storybook stories

## Key Commands
- `npm run dev` — Development server
- `npm run tokens` — Generate CSS from tokens
- `npm run tokens:check` — Verify CSS sync (CI)
- `npm run storybook` — Storybook dev server
- `npx prisma migrate dev` — Run migrations
- `npx prisma studio` — Database GUI

## Important Notes
- Stripe handles both Pix and Credit Card payments via Payment Intents
- Voucher codes are 6-char alphanumeric, verified via QR or manual entry
- Check-in module is online-only with printed manifest as fallback
- Commission calculations happen automatically on booking creation
