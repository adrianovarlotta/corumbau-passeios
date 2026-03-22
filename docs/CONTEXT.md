# Corumbau Passeios — AI Context File

> Import this file into any AI coding tool (Claude Code, OpenCode, Zed AI, Cursor, Copilot) to continue development with full project context.

## Project Overview

**Corumbau Passeios** is a tourism booking platform for a tour agency in Corumbau, Bahia, Brazil. It has three modules:

1. **Public Booking** (mobile-first, 80-90% mobile users) — Tour catalog, checkout, payment
2. **Admin Dashboard** (desktop) — KPIs, tour management, commissions, reports
3. **Operator Check-in** (tablet/mobile) — QR code scan, manifest, embark counter

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript strict |
| Styling | Tailwind CSS 4 + shadcn/ui (base-nova style) |
| Data Fetching | TanStack Query (client), Server Components (server) |
| Database | Prisma 6 + PostgreSQL (Neon) |
| Auth | Auth.js v5 (Credentials, JWT sessions) |
| Payments | Mercado Pago SDK (Pix + Credit Card) |
| Email | Resend (transactional) |
| Charts | Recharts |
| Design System | Storybook 10 |

## Critical Conventions (MUST FOLLOW)

### 1. No hardcoded hex colors
Always use Tailwind semantic classes: `bg-primary`, `text-foreground`, `border-border`.
Exception: sidebar uses `bg-[#172554]` because CSS variables don't work in that context.

### 2. ButtonLink instead of asChild
shadcn/ui `asChild` prop doesn't work with our setup. Use `<ButtonLink href="...">` from `@/components/ui/button-link` instead of `<Button asChild><Link>`.

### 3. `childCount` prop, never `children: number`
React reserves `children` as a prop name. When a component needs a numeric children count, name the prop `childCount`.

### 4. Zod input vs output types
When a Zod schema has `.default()` fields, the input type differs from the output type.
Use `z.input<typeof schema>` for form types and `z.output<typeof schema>` for validated data.

### 5. Guest checkout
Customers buy without creating accounts. Booking stores `customerName`, `customerEmail`, `customerPhone` directly.

### 6. Design tokens are the single source of truth
Colors, fonts, spacing defined in `design-system/tokens.ts`. Run `npm run tokens` to regenerate CSS.

### 7. Mobile-first design
Design for mobile first, then adapt for desktop. The homepage is a vertical card list, not a grid.

## Project Structure

```
src/app/(public)/          # Public routes (catalog, checkout, payment)
src/app/(admin)/admin/     # Admin dashboard (role=ADMIN)
src/app/(operator)/check/  # Check-in module (role=OPERATOR)
src/app/api/               # RESTful API routes
src/components/            # React components (organized by domain)
src/components/ui/         # shadcn/ui base components
src/hooks/                 # TanStack Query hooks
src/lib/                   # Utilities (auth, db, payments, email, validations)
src/types/                 # TypeScript types
design-system/             # Tokens + CSS generator
prisma/                    # Schema + migrations + seed
stories/                   # Storybook stories
docs/                      # Project documentation
```

## Database Schema (Prisma)

### Models
- **Tour**: name, slug, description, duration, priceAdult, priceChild, maxCapacity, category, commissionRate
- **TourDate**: tourId, date, time, totalSlots, bookedSlots, status (OPEN/FULL/CANCELLED)
- **Booking**: tourDateId, customer info, adults, children, totalAmount, paymentStatus, paymentMethod, voucherCode, checkedInAt
- **Commission**: bookingId, tourId, recipientId, amount, percentage, type (OPERATOR/SELLER)
- **User**: name, email, password (bcrypt), role (ADMIN/OPERATOR)

### Key Enums
- `TourCategory`: BOAT, BUGGY, WHALE, EXPERIENCE
- `PaymentStatus`: PENDING, PAID, REFUNDED, CANCELLED
- `PaymentMethod`: PIX, CREDIT_CARD, CASH, COURTESY
- `BookingSource`: ONLINE, OFFLINE, WHATSAPP
- `DateStatus`: OPEN, FULL, CANCELLED

## Payment Flow (Mercado Pago)

### Pix Flow
1. Customer submits checkout form → `POST /api/bookings` → creates booking (PENDING)
2. Redirect to `/pagamento/pix?bookingId=xxx`
3. Page calls `POST /api/payment/pix` → generates QR code via Mercado Pago
4. Customer scans QR code in banking app
5. Page polls `GET /api/payment/status?bookingId=xxx` every 5 seconds
6. Mercado Pago webhook → `POST /api/webhooks/mercadopago` → updates booking to PAID
7. Redirect to `/pagamento/sucesso`

### Credit Card Flow
1. Customer submits checkout → `POST /api/bookings` → creates booking (PENDING)
2. Calls `POST /api/payment/card` → creates Mercado Pago checkout preference
3. Redirects to Mercado Pago hosted checkout page
4. Customer fills card info on Mercado Pago
5. Mercado Pago redirects back to `/pagamento/sucesso` or `/pagamento/erro`
6. Webhook confirms payment → updates booking

### Mercado Pago Sandbox
- Access Token starts with `TEST-`
- Test cards: Visa `4509 9535 6623 3704`, MC `5031 4332 1540 6351`
- CVV: `123`, any future expiry, CPF: `12345678909`
- Panel: https://www.mercadopago.com.br/developers/panel

## Auth & Roles

| Role | Access | Credentials (dev) |
|---|---|---|
| ADMIN | Full dashboard, tour CRUD, reports | admin@corumbau.com / admin123 |
| OPERATOR | Check-in module only | operador@corumbau.com / operador123 |
| Guest | Public pages, booking, payment | No account needed |

## Design System

### Typography
- **Display**: Cormorant Garamond (serif) — headings, prices
- **Body**: Nunito (sans-serif) — text, labels, buttons
- **Mono**: JetBrains Mono — codes, vouchers

### Color Palette
- **Primary**: Deep Ocean Blue `#0C4A6E` (HSL 204 80% 24%)
- **Accent**: Golden Sand `#EAB308` (HSL 43 96% 56%)
- **Sky**: `#0EA5E9` — links, highlights
- **Sidebar**: Dark Navy `#172554`

### Tour Category Colors
- WHALE: Blue `#1E40AF`
- BOAT: Cyan `#0891B2`
- BUGGY: Amber `#B45309`
- EXPERIENCE: Violet `#7C3AED`

## Environment Variables

```env
# Required
DATABASE_URL=             # Neon PostgreSQL connection string
NEXTAUTH_SECRET=          # Auth.js secret (generate with openssl rand -base64 32)
MERCADOPAGO_ACCESS_TOKEN= # Mercado Pago sandbox token (TEST-xxx)

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=  # Mercado Pago public key
RESEND_API_KEY=           # Email service
```

## Key Commands

```bash
npm run dev               # Dev server (Turbopack)
npm run build             # Production build
npm run tokens            # Regenerate CSS from design tokens
npm run storybook         # Storybook on port 6006
npx prisma migrate dev    # Run migrations
npx prisma db seed        # Seed database
npx prisma studio         # Database GUI
```

## Deployment

- **Platform**: Vercel
- **URL**: https://workshop-ia-eight.vercel.app
- **GitHub**: https://github.com/adrianovarlotta/corumbau-passeios
- **Database**: Neon (project: icy-shape-45399714)

## Common Pitfalls

1. **Turbopack cache**: If you get `MODULE_NOT_FOUND`, run `rm -rf .next`
2. **Prisma types**: After schema changes, run `npx prisma generate`
3. **shadcn Select**: `onValueChange` passes `string | null`, wrap with `(v) => fn(v ?? '')`
4. **Recharts Tooltip formatter**: Don't type `value` as `number`, use `(value) => [String(Number(value))]`
5. **Next.js Image**: Always use `next/image` Image component, never `<img>`
6. **Tailwind CSS 4**: No `tailwind.config.ts` file — config is in `globals.css` via `@theme`
7. **npm install**: Use `--legacy-peer-deps` flag (configured in `.npmrc`)
