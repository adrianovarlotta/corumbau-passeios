# Architecture Guide

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Public   │  │  Admin   │  │    Operator      │  │
│  │  Booking  │  │Dashboard │  │    Check-in      │  │
│  │ (mobile)  │  │(desktop) │  │  (tablet/mob)    │  │
│  └────┬─────┘  └────┬─────┘  └───────┬──────────┘  │
│       │              │                │              │
│       └──────────────┼────────────────┘              │
│                      │                               │
│              TanStack Query                          │
│                      │                               │
├──────────────────────┼───────────────────────────────┤
│                      │                               │
│               API Routes (Next.js)                   │
│                      │                               │
│  ┌──────────┐  ┌─────┴────┐  ┌────────────────┐    │
│  │ /api/    │  │/api/admin│  │/api/operator   │    │
│  │ public   │  │ (ADMIN)  │  │ (OPERATOR)     │    │
│  │ routes   │  │ routes   │  │ routes         │    │
│  └────┬─────┘  └────┬─────┘  └───────┬────────┘    │
│       │              │                │              │
│       └──────────────┼────────────────┘              │
│                      │                               │
├──────────────────────┼───────────────────────────────┤
│                      │                               │
│  ┌─────────┐   ┌─────┴────┐   ┌─────────────────┐  │
│  │ Prisma  │   │ Auth.js  │   │  Mercado Pago   │  │
│  │   ORM   │   │  v5/JWT  │   │     SDK         │  │
│  └────┬────┘   └──────────┘   └────────┬────────┘  │
│       │                                 │            │
│  ┌────┴────┐                   ┌────────┴────────┐  │
│  │  Neon   │                   │  MP Sandbox/    │  │
│  │PostgreSQL│                   │  Production    │  │
│  └─────────┘                   └─────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Request Flow

### Public Booking Flow

```
Customer (mobile browser)
  │
  ├─ GET /                        → Tour catalog (client component + mock data)
  │
  ├─ GET /passeios/[slug]         → Tour detail page (server component)
  │
  ├─ GET /passeios/[slug]/checkout → Checkout form (client component)
  │     │
  │     ├─ POST /api/bookings     → Create booking (Prisma transaction)
  │     │     │
  │     │     ├─ Validate Zod schema
  │     │     ├─ Check availability (tourDate.bookedSlots vs totalSlots)
  │     │     ├─ Generate voucher code (6 chars, unique)
  │     │     ├─ Create booking + update bookedSlots (atomic)
  │     │     └─ Return booking with voucherCode
  │     │
  │     ├─ [PIX] → Redirect /pagamento/pix?bookingId=xxx
  │     │     │
  │     │     ├─ POST /api/payment/pix → createPixPayment() via MP SDK
  │     │     ├─ Display QR code + copy-paste code
  │     │     ├─ Poll GET /api/payment/status every 5s
  │     │     └─ On PAID → redirect /pagamento/sucesso
  │     │
  │     └─ [CARD] → POST /api/payment/card → createCheckoutPreference() via MP SDK
  │           │
  │           └─ Redirect to Mercado Pago hosted checkout
  │                 │
  │                 ├─ Success → /pagamento/sucesso?bookingId=xxx
  │                 ├─ Failure → /pagamento/erro?bookingId=xxx
  │                 └─ Pending → /pagamento/pendente?bookingId=xxx
  │
  └─ Webhook: POST /api/webhooks/mercadopago
        │
        ├─ Verify payment via getPaymentStatus()
        ├─ Map MP status → PaymentStatus enum
        ├─ Update booking.paymentStatus
        └─ If PAID → create Commission record
```

### Admin Flow

```
Admin browser → /login → Auth.js Credentials → JWT token
  │
  ├─ GET /admin              → Dashboard (KPIs, revenue chart, recent bookings)
  ├─ GET /admin/tours        → Tour list + CRUD
  ├─ GET /admin/commissions  → Commission tracking
  └─ GET /admin/reports      → Revenue charts, analytics
```

### Operator Flow

```
Operator (tablet) → /login → Auth.js Credentials → JWT token
  │
  ├─ GET /check              → Select tour date
  ├─ GET /check/select       → Passenger manifest
  └─ GET /check/scan         → QR code scanner → POST /api/operator/checkin
```

## Directory Conventions

### Route Groups

| Group | Purpose | Auth | Layout |
|---|---|---|---|
| `(public)` | Customer-facing pages | None | App bar + content |
| `(admin)` | Dashboard pages | ADMIN role | Sidebar + content |
| `(operator)` | Check-in pages | OPERATOR role | Simple header |
| `(auth)` | Login page | None | Centered card |

### API Route Patterns

```
/api/tours              GET     → Public tour list (no auth)
/api/bookings           POST    → Create booking (no auth, guest checkout)
/api/payment/pix        POST    → Generate Pix payment (no auth)
/api/payment/card       POST    → Create card checkout (no auth)
/api/payment/status     GET     → Check payment status (no auth)
/api/voucher/[code]     GET     → Validate voucher (no auth)

/api/admin/tours        GET/POST   → Tour CRUD (ADMIN)
/api/admin/tours/[id]   PUT/DELETE → Tour update/delete (ADMIN)
/api/admin/tour-dates   POST       → Create date (ADMIN)
/api/admin/bookings     GET        → List bookings (ADMIN)
/api/admin/commissions  GET        → List commissions (ADMIN)

/api/operator/checkin   POST    → Check in passenger (OPERATOR)
/api/operator/manifest  GET     → Get day's manifest (OPERATOR)

/api/webhooks/mercadopago POST  → Payment notifications (no auth, MP IPN)
```

## Component Architecture

### Component Categories

```
src/components/
├── ui/                  # Primitives (shadcn/ui) — never modify directly
│   ├── button.tsx       # Button variants
│   ├── button-link.tsx  # Button + Next.js Link (custom, replaces asChild)
│   ├── card.tsx         # Card container
│   ├── input.tsx        # Form input
│   └── ...              # 20+ shadcn components
│
├── admin/               # Admin-specific components
│   ├── KPICard.tsx      # Metric card with icon + trend
│   ├── CommissionRow.tsx
│   └── DateCard.tsx
│
├── booking/             # Booking flow components
│   ├── PriceSummary.tsx # Order summary sidebar
│   └── QuantitySelector.tsx
│
├── payment/             # Payment components
│   └── PaymentToggle.tsx # PIX/CARD toggle
│
├── checkin/             # Check-in components
│   ├── CheckinRow.tsx
│   └── EmbarkCounter.tsx
│
├── tour/                # Tour display components
│   ├── TourCard.tsx
│   └── TourCategoryBadge.tsx
│
├── voucher/             # Voucher components
│   ├── VoucherCard.tsx
│   └── VoucherCode.tsx
│
├── layout/              # Layout components
│   ├── AdminSidebar.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
│
└── providers/           # Context providers
    └── QueryProvider.tsx # TanStack Query + ReactQueryDevtools
```

### State Management

| Concern | Solution |
|---|---|
| Server data | TanStack Query (hooks in `src/hooks/`) |
| Form state | react-hook-form + Zod resolver |
| Auth state | Auth.js v5 JWT (server: `auth()`, client: `useSession()`) |
| UI state | React `useState` (local, no global store needed) |
| URL state | `useSearchParams()` for filters, `usePathname()` for active nav |

## Database Design Decisions

### Why no User account for customers?
Tourists are one-time buyers. Creating accounts adds friction. Booking stores customer data directly (name, email, phone). Voucher code is the customer's "ticket".

### Commission calculation
Commissions are created automatically when payment is confirmed (webhook). Each Tour has a `commissionRate` (0-1). Commission = `totalAmount * commissionRate`.

### Voucher codes
6-character alphanumeric (A-Z, 2-9, excluding I/O/0/1 to avoid confusion). Generated on booking creation, unique constraint in database.

### Slot management
`TourDate.bookedSlots` is incremented atomically in a Prisma transaction when a booking is created. When `bookedSlots >= totalSlots`, status changes to `FULL`.
