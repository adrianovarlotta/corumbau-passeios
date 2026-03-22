# Quick Start - Corumbau Passeios

**Para:** Dev Senior, AI Assistant, Novo Contributor
**Tempo:** 5 minutos para entender, 10 minutos para rodar localmente
**Última atualização:** 22 de março de 2026

---

## 🚀 Iniciar em 3 Passos

### 1️⃣ Clone & Install

```bash
cd /Users/adrianovarlotta/Projetos/workshop-ia
git pull origin main
npm install
```

### 2️⃣ Setup Environment

```bash
# Copiar .env.example para .env.local
cp .env.example .env.local

# Editar .env.local:
# - DATABASE_URL já deve estar configurada (Neon)
# - NEXTAUTH_SECRET já deve estar lá
# - MERCADOPAGO_ACCESS_TOKEN = adicionar quando tiver sandbox token
```

### 3️⃣ Rodar Dev Server

```bash
npm run dev
# Acessa em http://localhost:3000
```

---

## 📁 Estrutura Essencial

```
src/
├── app/
│   ├── (public)/                # Homepage, catálogo, checkout
│   │   └── page.tsx             # 🎯 Tour catalog (mobile-first)
│   ├── (admin)/admin/           # Dashboard admin
│   │   └── page.tsx             # 🎯 KPIs + Recharts
│   └── api/
│       ├── bookings/route.ts     # 🎯 POST: criar reserva
│       ├── payment/pix/route.ts  # 🔄 Mercado Pago em progresso
│       └── tours/route.ts        # GET: listar passeios
├── components/
│   ├── TourCard.tsx             # Card de passeio
│   ├── TourDateCard.tsx         # Card de data específica
│   └── layout/AdminSidebar.tsx  # Sidebar admin
├── hooks/
│   ├── use-tours.ts             # Fetch passeios (TanStack Query)
│   └── use-bookings.ts          # CRUD reservas
├── lib/
│   ├── auth.ts                  # Auth.js v5
│   ├── db.ts                    # Prisma client
│   ├── mercadopago.ts           # 🎯 NEW: Pagamentos
│   └── validations.ts           # Zod schemas
└── app/globals.css              # Design tokens + utilities
```

---

## 🎨 Design Tokens (IMPORTANTE!)

**Princípio:** Nenhum hex hardcoded. Sempre use classes Tailwind semânticas.

```tsx
// ✅ CERTO
<div className="bg-primary text-foreground">
<button className="bg-accent hover:bg-accent/90">

// ❌ ERRADO
<div className="bg-[#0C4A6E]">
```

### Cores Disponíveis
- `primary` = Azul Oceano (#0C4A6E)
- `accent` = Ouro (#EAB308)
- `secondary` = Azul Céu (#0EA5E9)
- `foreground` = Texto (#1a1a1a)
- `muted` = Cinza (#999999)
- `background` = Branco

### Atualizar Tokens
```bash
# 1. Edite design-system/tokens.ts
# 2. Rode:
npm run tokens

# 3. Verifique:
npm run tokens:check
```

---

## 🔐 Auth & Database

### Credenciais de Teste
```
Admin:    admin@corumbau.com / admin123
Operador: operador@corumbau.com / operador123
```

### Database GUI
```bash
npx prisma studio
# Abre em http://localhost:5555
```

### Database URL
Já configurada em `.env` (Neon PostgreSQL)

---

## ⚡ Comandos Úteis

```bash
# Development
npm run dev              # Dev server (port 3000)
npm run build            # Build check
npm run storybook        # Design system docs

# Database
npx prisma migrate dev   # Rodar migrations
npx prisma studio       # GUI do banco

# Design System
npm run tokens           # Gerar CSS de tokens
npm run tokens:check     # Verificar sincronização (CI)

# Git
git pull origin main     # Atualizar código
git push origin main     # Fazer push
git status              # Ver mudanças
```

---

## 🎯 Workflow Típico

### Adicionar Feature

```bash
# 1. Atualizar código
# 2. Testar localmente
npm run dev

# 3. Check build
npm run build

# 4. Commit
git add .
git commit -m "feat: nova feature"

# 5. Push (auto-deploy em Vercel)
git push origin main
```

### Fixar Bug

```bash
# 1. Reproduzir bug localmente
# 2. Fix código
# 3. Test
npm run build

# 4. Commit
git commit -m "fix: descrição do bug"
git push origin main
```

---

## 📚 Documentação Completa

**Leia nesta ordem:**

1. **`PROJECT_CONTEXT.md`** — Overview do projeto, stack, arquitetura
2. **`CODE_STANDARDS.md`** — Padrões de código, exemplos, conventions
3. **`CONVERSATION_HISTORY.md`** — Tudo que foi feito, decisões, bugs resolvidos

---

## 🔗 Deployment

### Vercel (Automático)
- **URL:** https://workshop-ia-eight.vercel.app
- **Trigger:** Push para `main`
- **Logs:** `vercel logs`

### Variáveis de Ambiente
```bash
# .env.local (local)
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
MERCADOPAGO_ACCESS_TOKEN=...

# Vercel Console
Mesmo padrão
```

---

## 🚨 Checklist Antes de Push

- [ ] `npm run build` passou ✅
- [ ] `npm run tokens:check` passou ✅
- [ ] Teste feature localmente
- [ ] Sem `console.log` ou `debugger` leftover
- [ ] Commit message descritivo
- [ ] Sem hardcoded hex colors

---

## 💾 Dados Seed do Banco

Passeios já no banco:
1. **Baleia Jubarte** (WHALE) — R$ 250
2. **Barco Praia do Espelho** (BOAT) — R$ 180
3. **Buggy Costa das Baleias** (BUGGY) — R$ 320
4. **Vivência com Pescadores** (EXPERIENCE) — R$ 150
5. **Aldeia Porto do Boi** (EXPERIENCE) — R$ 180

---

## ❓ Troubleshooting

### Port 3000 em uso?
```bash
npx kill-port 3000
npm run dev
```

### Build falha?
```bash
rm -rf .next
npm run build
```

### Prisma error?
```bash
npx prisma generate
npx prisma migrate dev
```

### Tailwind não atualiza?
```bash
npm run tokens
npm run build
```

---

## 📞 Suporte Rápido

| Problema | Solução |
|----------|---------|
| Database connection | Verificar `DATABASE_URL` em `.env` |
| Auth não funciona | Verificar `NEXTAUTH_SECRET` |
| Styles não aplicam | Rodar `npm run tokens` |
| Build fails | `rm -rf .next && npm run build` |
| Imagens quebradas | Checar `/public/images/` |

---

## 🎓 Próximos Passos Típicos

### Se você vai trabalhar em...

**Payment (Pix + Cartão):**
- Ler: `src/lib/mercadopago.ts` + `CODE_STANDARDS.md` (seção API Routes)
- Obter sandbox token em https://www.mercadopago.com.br/developers
- Implementar `/api/payment/pix` e `/api/payment/card`

**Homepage:**
- Arquivo: `src/app/(public)/page.tsx`
- Componentes: `TourCard.tsx`, `TourDateCard.tsx`
- Design: siga `CODE_STANDARDS.md` → section "Design System"

**Admin Dashboard:**
- Arquivo: `src/app/(admin)/admin/page.tsx`
- Charts: `recharts` (AreaChart, BarChart)
- Sidebar: `src/components/layout/AdminSidebar.tsx`

**Database:**
- Schema: `prisma/schema.prisma`
- Migrations: `npx prisma migrate dev --name your_migration`
- Query patterns: `CODE_STANDARDS.md` → section "Database (Prisma)"

---

**Pronto para começar? 🚀**

Clone o projeto, rode `npm run dev`, abra http://localhost:3000!

Para dúvidas, consulte `PROJECT_CONTEXT.md` ou `CODE_STANDARDS.md`.
