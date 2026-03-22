# Changelog

## 2026-03-21

### Added
- **Mercado Pago integration**: Complete payment flow replacing Stripe
  - `src/lib/mercadopago.ts` — SDK wrapper (Pix, Checkout Preference, Status, Refund)
  - `POST /api/payment/pix` — Generate Pix QR code via Mercado Pago
  - `POST /api/payment/card` — Create checkout preference for credit card
  - `POST /api/webhooks/mercadopago` — IPN webhook for payment notifications
  - `/pagamento/pix` — Pix payment page with QR code, copy-paste, auto-polling
  - `/pagamento/sucesso` — Payment success page
  - `/pagamento/erro` — Payment error page
  - `/pagamento/pendente` — Payment pending page

- **Mobile-first homepage**: Replaced landing page with tour catalog
  - Vertical card list (96px image + info)
  - Horizontal-scroll category filter pills
  - 2-column grid on tablet/desktop
  - No hero banner, no landing page — straight to available tours

- **Admin dashboard redesign**
  - KPI cards with icons and trends
  - Recharts AreaChart for revenue over time
  - Recent bookings table with status badges
  - Fixed sidebar with dark navy background

- **Reports page fix**
  - Replaced broken CSS bar chart with Recharts BarChart
  - Proper ResponsiveContainer for sizing

- **Documentation**
  - `docs/CONTEXT.md` — AI context file for continuing development
  - `docs/ARCHITECTURE.md` — System architecture and flows
  - `docs/PATTERNS.md` — Code patterns and standards
  - `docs/API-REFERENCE.md` — Complete API documentation
  - `docs/SETUP.md` — Development setup guide
  - `docs/DESIGN-SYSTEM.md` — Design system reference
  - `docs/CHANGELOG.md` — This file

### Changed
- **Checkout flow**: Now initiates payment after booking creation
  - PIX: redirects to `/pagamento/pix` for QR code
  - Card: redirects to Mercado Pago hosted checkout
- **Public layout**: Simplified to app bar + content (no navbar/footer)
- **`/passeios` route**: Now redirects to `/` (homepage is the catalog)
- **Admin sidebar**: Fixed colors from CSS vars to explicit `bg-[#172554]`
- **Recharts tooltips**: Fixed TypeScript type errors with formatter

### Infrastructure
- Neon PostgreSQL database connected (project: icy-shape-45399714)
- Vercel deployment: https://workshop-ia-eight.vercel.app
- GitHub repository: https://github.com/adrianovarlotta/corumbau-passeios
- Auth.js v5 with JWT sessions
- TanStack Query provider configured
- Storybook 10 with 16 component stories

### Previous Session Work
- Next.js 15 project setup with TypeScript strict
- Prisma 6 schema with 9 models
- shadcn/ui components (base-nova style)
- Auth.js v5 with Credentials provider
- Design token system (tokens.ts → CSS generator)
- Cormorant Garamond + Nunito typography
- Blue (#0C4A6E) + Gold (#EAB308) color palette
- Real Unsplash photos for tours
- Admin dashboard, tour management, commission tracking
- Operator check-in module with QR scanner
- Voucher generation and validation
- Database seed with users, tours, and dates
