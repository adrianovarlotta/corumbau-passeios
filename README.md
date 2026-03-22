# 🏄 Corumbau Passeios

**Plataforma online de vendas + gestão operacional para agência de passeios turísticos em Corumbau/BA**

![Status](https://img.shields.io/badge/status-in%20development-blue)
![Next.js](https://img.shields.io/badge/next.js-15.5.14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/tailwind-4-06B6D4?logo=tailwindcss)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# 3. Start dev server
npm run dev

# Open http://localhost:3000
```

---

## 📚 Documentation

**START HERE:** [`.claude/DOCUMENTATION_INDEX.md`](./.claude/DOCUMENTATION_INDEX.md)

All documentation files are in the `.claude/` folder:

| File | Purpose | Read Time |
|------|---------|-----------|
| **[QUICK_START.md](./.claude/QUICK_START.md)** | Setup & commands | 5 min |
| **[PROJECT_CONTEXT.md](./.claude/PROJECT_CONTEXT.md)** | Architecture & overview | 15 min |
| **[CODE_STANDARDS.md](./.claude/CODE_STANDARDS.md)** | Patterns & conventions | 20 min |
| **[CONVERSATION_HISTORY.md](./.claude/CONVERSATION_HISTORY.md)** | Development history | 30 min |
| **[DOCUMENTATION_INDEX.md](./.claude/DOCUMENTATION_INDEX.md)** | Navigation guide | 5 min |

---

## 🏗️ Architecture

### Modules
- **Public** (`/`) — Tour catalog (mobile-first), checkout
- **Admin** (`/admin`) — Dashboard with KPIs, charts, reports
- **Operator** (`/check`) — Check-in management

### Tech Stack
- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Database:** Prisma 6 + PostgreSQL (Neon)
- **Auth:** Auth.js v5 (Credentials provider)
- **Data Fetching:** TanStack Query
- **Payments:** Mercado Pago (Pix + Credit Card)
- **Charts:** Recharts
- **Validation:** Zod + react-hook-form

---

## 🎨 Design System

**Colors (Tropical Luxe):**
- Primary: Azul Oceano `#0C4A6E`
- Accent: Ouro `#EAB308`
- Secondary: Azul Céu `#0EA5E9`

**Typography:**
- Display: Cormorant Garamond
- Body: Nunito

**Zero hardcoded hex.** Always use semantic Tailwind classes (`bg-primary`, `text-foreground`).

Update design tokens:
```bash
npm run tokens
```

---

## 🔐 Authentication

**Test Credentials:**
```
Admin:    admin@corumbau.com / admin123
Operator: operador@corumbau.com / operador123
```

Routes:
- `/` — Public
- `/admin/*` — Admin only
- `/check/*` — Admin or Operator

---

## 💰 Payments (Mercado Pago)

### Current Status
- ✅ SDK installed
- ✅ `src/lib/mercadopago.ts` created
- ⏳ **Awaiting:** Sandbox Access Token

### Setup
1. Get Access Token: https://www.mercadopago.com.br/developers
2. Add to `.env.local`:
   ```
   MERCADOPAGO_ACCESS_TOKEN=APP_xxxxx
   ```
3. Test Pix (QR code) and Card (redirect to MP checkout)

---

## 📦 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run storybook        # Design system docs

# Database
npx prisma studio       # Database GUI
npx prisma migrate dev   # Run migrations

# Design System
npm run tokens           # Generate CSS from tokens
npm run tokens:check     # Verify sync (CI)

# Deployment
vercel logs             # View Vercel logs
```

---

## 🗄️ Database

**Connection:** Neon PostgreSQL (icy-shape-45399714)

**Browse:** `npx prisma studio`

**Tours (seed data):**
1. Baleia Jubarte (R$ 250)
2. Barco Praia do Espelho (R$ 180)
3. Buggy Costa das Baleias (R$ 320)
4. Vivência com Pescadores (R$ 150)
5. Aldeia Porto do Boi (R$ 180)

---

## 🚀 Deployment

**Vercel:** https://workshop-ia-eight.vercel.app

Auto-deploys on push to `main`.

Env vars:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `MERCADOPAGO_ACCESS_TOKEN` (to add)

---

## ⚙️ Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Required
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# Optional (when ready)
MERCADOPAGO_ACCESS_TOKEN=APP_xxxx
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npx kill-port 3000` |
| `.next` corrupted | `rm -rf .next && npm run build` |
| Prisma error | `npx prisma generate && npx prisma migrate dev` |
| Tailwind not updating | `npm run tokens` |
| Build fails | Check `npm run build` output |

---

## 📝 Code Style

**Key Rules:**
- ✅ Semantic Tailwind classes
- ✅ TypeScript strict mode
- ✅ `next/image` for images (no `<img>`)
- ✅ `ButtonLink` instead of `asChild`
- ✅ `childCount` prop (not `children` number)
- ✅ No hardcoded colors

See [CODE_STANDARDS.md](./.claude/CODE_STANDARDS.md) for patterns and examples.

---

## 🔄 Development Workflow

```bash
# 1. Create feature branch (if needed)
git checkout -b feature/your-feature

# 2. Make changes
# 3. Test locally
npm run build

# 4. Commit
git commit -m "feat: description"

# 5. Push to main
git push origin main

# 6. Vercel auto-deploys
```

---

## 📖 For New Developers

1. Read: [.claude/QUICK_START.md](./.claude/QUICK_START.md) (5 min)
2. Run: `npm run dev`
3. Read: [.claude/PROJECT_CONTEXT.md](./.claude/PROJECT_CONTEXT.md) (15 min)
4. Explore: `src/app/`, `src/components/`, `src/hooks/`
5. Code: Follow [.claude/CODE_STANDARDS.md](./.claude/CODE_STANDARDS.md)

---

## 🤝 Contributing

- Follow code standards in `.claude/CODE_STANDARDS.md`
- Always run `npm run build` before pushing
- Keep documentation updated
- Use semantic commit messages

---

## 🔗 Useful Links

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com
- **Prisma:** https://www.prisma.io/docs
- **Auth.js:** https://authjs.dev
- **Mercado Pago:** https://www.mercadopago.com.br/developers

---

## 📊 Project Status

### ✅ Complete
- Homepage with tour catalog (mobile-first)
- Admin dashboard with KPIs & charts
- Database setup & seed
- Authentication system
- Design system

### ⏳ In Progress
- Mercado Pago payment integration
- Tide indicator (Tábua de Marés API)
- Featured tours highlighting

### 📋 Planned
- Tour detail page (desktop layout)
- Operator check-in interface
- Voucher system (end-to-end)
- WhatsApp notifications
- Advanced reporting

---

## 📞 Support

For questions or to understand decisions behind the project:
1. Check `.claude/DOCUMENTATION_INDEX.md` for navigation
2. Search relevant section in `.claude/` docs
3. Review code examples in `.claude/CODE_STANDARDS.md`

---

**Last Updated:** 22 de março de 2026
**Version:** 1.0.0

---

**Built with ❤️ for Corumbau**

🌊 💙 ✨
