# Corumbau Passeios - Contexto Completo do Projeto

**Data:** 22 de Março de 2026
**Status:** Em desenvolvimento — Homepage + Admin Dashboard funcionando, Mercado Pago pronto para integração
**URL Local:** http://localhost:3000
**Deploy:** https://workshop-ia-eight.vercel.app

---

## 📋 Resumo Executivo

**Corumbau Passeios** é uma plataforma completa de vendas online + gestão operacional para uma agência de passeios turísticos em Corumbau/BA.

- **Frontend:** Next.js 15 (App Router) + TypeScript strict + Tailwind CSS 4 + shadcn/ui
- **Backend:** API REST em Next.js, Prisma 6, PostgreSQL (Neon)
- **Autenticação:** Auth.js v5 (Credentials + JWT)
- **Pagamentos:** Mercado Pago (Pix + Cartão de Crédito) — **Sandbox pronto, aguardando Access Token**
- **Design:** Mobile-first (80-90% dos usuários), Desktop responsivo
- **Palete:** Azul Oceano (#0C4A6E) + Ouro (#EAB308)

---

## 🏗️ Arquitetura do Projeto

```
src/
├── app/
│   ├── (public)/          # Rotas públicas (landing, catálogo, checkout)
│   │   ├── page.tsx       # Homepage: catálogo mobile-first com filtros
│   │   ├── passeios/[slug]/page.tsx
│   │   ├── passeios/[slug]/checkout/page.tsx
│   │   └── layout.tsx     # App bar minimalista
│   ├── (admin)/admin/     # Dashboard admin (role=ADMIN)
│   │   ├── page.tsx       # Dashboard com KPIs, gráficos Recharts
│   │   ├── reports/page.tsx
│   │   ├── tours/page.tsx
│   │   └── bookings/page.tsx
│   ├── (operator)/check/  # Check-in (role=OPERATOR ou ADMIN)
│   ├── api/
│   │   ├── bookings/route.ts      # POST: criar reserva
│   │   ├── payment/pix/route.ts   # POST: criar pagamento Pix (será Mercado Pago)
│   │   ├── payment/status/route.ts
│   │   ├── webhooks/mercadopago/route.ts  # Notificações IPN
│   │   └── tours/route.ts
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── AdminSidebar.tsx   # Sidebar: navy #172554, amarela, com Waves icon
│   │   └── Navbar.tsx
│   ├── TourCard.tsx           # Card: imagem, nome, descrição, preço, botão
│   ├── TourDateCard.tsx       # Card de data específica (featured tours)
│   ├── CheckinRow.tsx
│   ├── VoucherCard.tsx
│   └── ...
├── hooks/
│   ├── use-tours.ts           # TanStack Query: listar passeios
│   ├── use-bookings.ts        # TanStack Query: CRUD reservas
│   └── use-admin.ts           # TanStack Query: dashboard data
├── lib/
│   ├── auth.ts                # Auth.js v5 setup
│   ├── db.ts                  # Prisma client
│   ├── mercadopago.ts         # **NOVO** Integração Mercado Pago
│   ├── stripe.ts              # DEPRECATED (será removido)
│   └── validations.ts         # Zod schemas (CheckoutInput/Output)
├── types/
│   └── index.ts               # TypeScript types compartilhados
└── app/globals.css            # Design tokens, utilities

prisma/
├── schema.prisma              # Modelo de dados
└── seed.ts                    # Seed: users, tours, tour_dates

design-system/
├── tokens.ts                  # Single source of truth: cores, tamanhos
└── utils.ts

middleware.ts                  # Proteção de rotas (/admin, /check)
.env.local                     # Variáveis locais
```

---

## 🎨 Design System & Tokens

### Cores (Tropical Luxe)
- **Azul Oceano (Primary):** `#0C4A6E` — headings, buttons primários, sidebar
- **Ouro (Accent):** `#EAB308` — botões secundários, highlights, accents
- **Azul Céu (Secondary):** `#0EA5E9` — links, badges
- **Navy Escuro (Sidebar):** `#172554`
- **Foreground:** `#1a1a1a` (text)
- **Muted:** `#999999`

### Tipografia
- **Display:** Cormorant Garamond (headings, títulos)
- **Body:** Nunito (textos, labels)

### Utilities CSS
```css
.font-display           /* Cormorant Garamond */
.text-gradient-ocean    /* Gradiente azul */
.bg-ocean-gradient      /* Gradiente oceano */
.bg-warm-gradient       /* Gradiente quente (ouro/coral) */
.grain-overlay          /* Textura grain subtle */
```

**Princípio:** Sempre usar classes Tailwind semânticas (`bg-primary`, `text-foreground`). **ZERO hex hardcoded**.

Atualizar tokens:
```bash
npm run tokens          # Gera CSS de design-system/tokens.ts
npm run tokens:check   # Verifica sincronização (CI)
```

---

## 🔐 Autenticação & Autorização

### Auth.js v5 (Credentials Provider)
- **Arquivo:** `src/lib/auth.ts`
- **Estratégia:** Credentials (email + senha hash com bcryptjs)
- **Sessão:** JWT com claims `role` (ADMIN/OPERATOR) e `id`
- **Secret:** `NEXTAUTH_SECRET` em `.env`

### Credenciais de Teste
```
Admin:     admin@corumbau.com / admin123
Operador:  operador@corumbau.com / operador123
```

### Proteção de Rotas (Middleware)
- `/admin/*` → requer `role=ADMIN`
- `/check/*` → requer `role=ADMIN` ou `OPERATOR`
- Públicas: `/`, `/passeios/*`, `/checkout`

---

## 📦 Stack & Dependências

| Pacote | Versão | Uso |
|--------|--------|-----|
| next | 15.5.14 | Framework (CVE-2025-66478 patch) |
| react | 19+ | UI |
| typescript | strict | Type safety |
| tailwindcss | 4 | Styling |
| shadcn/ui | latest | Components base-nova style |
| @hookform/react | latest | Form handling |
| zod | latest | Schema validation |
| @tanstack/react-query | latest | Client data fetching |
| prisma | 6 | ORM |
| @prisma/client | 6 | DB client |
| next-auth | 5.x | Authentication |
| bcryptjs | latest | Password hashing |
| recharts | latest | Charts (admin dashboard) |
| mercadopago | latest | Payment processing |
| next/image | built-in | Image optimization |

---

## 🗄️ Database (Neon PostgreSQL)

### Conexão
- **Project:** `icy-shape-45399714`
- **Org:** `org-spring-night-89602574`
- **URL:** `postgresql://neondb_owner:npg_Ds8k1qiBIXcZ@ep-quiet-wave-amw1clu5.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

### Schema Principal
```prisma
model User {
  id String @id @default(cuid())
  email String @unique
  password String (bcrypted)
  role Role (ADMIN, OPERATOR)
  createdAt DateTime
}

model Tour {
  id String @id @default(cuid())
  slug String @unique
  name String
  description String
  image String (path em /public/images/)
  basePrice Float
  category Category (WHALE, BOAT, BUGGY, EXPERIENCE)
  dates TourDate[]
}

model TourDate {
  id String @id @default(cuid())
  tourId String
  tour Tour
  date DateTime
  time String (HH:00)
  capacity Int
  bookings Booking[]
}

model Booking {
  id String @id @default(cuid())
  tourDateId String
  tourDate TourDate
  customerName String
  customerEmail String
  customerPhone String
  childCount Int @default(0)
  totalAmount Float
  paymentStatus PaymentStatus (PENDING, COMPLETED, FAILED)
  voucherCode String @unique (6 alphanumeric)
  createdAt DateTime
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
}
```

### Migrations
```bash
npx prisma migrate dev           # Executar migrações
npx prisma studio              # GUI interativa do banco
```

---

## 💰 Mercado Pago Integration

### Status Atual
- ✅ SDK instalado (`mercadopago` package)
- ✅ `src/lib/mercadopago.ts` criado com funções base
- ⏳ **Aguardando:** Access Token do Sandbox

### Funções Criadas
```typescript
// src/lib/mercadopago.ts
export async function createPixPayment(
  amount: number,
  bookingId: string,
  customerEmail: string,
  customerName: string
): Promise<{ qrCode: string; transactionId: string }>

export async function createCheckoutPreference(
  amount: number,
  bookingId: string,
  tourName: string,
  customerEmail: string,
  customerName: string
): Promise<{ preferenceId: string; initPoint: string }>

export async function getPaymentStatus(paymentId: string)
export async function refundPayment(paymentId: string)
```

### Setup Sandbox
1. Ir em https://www.mercadopago.com.br/developers
2. Criar/obter **Access Token de Teste**
3. Adicionar a `.env.local`:
   ```
   MERCADOPAGO_ACCESS_TOKEN=APP_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Adicionar em Vercel env vars também
5. Testar Pix (QR code local) e Cartão (redireciona para checkout MP)

### Webhooks
- URL: `/api/webhooks/mercadopago`
- Back URLs:
  - Sucesso: `/pagamento/sucesso?id={payment_id}`
  - Erro: `/pagamento/erro`
  - Pendente: `/pagamento/pendente`

---

## 📱 Homepage (Catálogo Mobile-First)

### Estrutura
1. **Header:** App bar minimalista com Waves icon, "Corumbau Passeios", maré (em desenvolvimento)
2. **Passeios em Destaque:** 3-5 cards com datas específicas (featured tours)
3. **Filtros:** Pills horizontais (Todos, Baleias, Barcos, Buggy, Vivências)
4. **Catálogo:** Lista vertical no mobile, 2-colunas no desktop

### Arquivo
- **`src/app/(public)/page.tsx`**

### Card de Passeio
```
┌─────────────────────────┐
│  [96px image] Nome      │
│                Descrição│
│                R$ 250   │
│            [Reservar]   │
└─────────────────────────┘
```

### Featured Tours (TourDateCard)
```
┌────────────────────────────┐
│  Terça, 24 de mar. 08:00h  │
│  8 vagas                   │
│      [Reservar]            │
└────────────────────────────┘
```

---

## 🎯 Admin Dashboard

### Componentes
1. **Header:** "Dashboard" + data (português)
2. **Faturamento do Mês:** Card grande com R$ total, green text
3. **KPIs (4 cards):** Reservas Hoje, Faturamento Hoje, Taxa Ocupação, Passeios Amanhã
4. **Gráfico AreaChart:** Últimos 7 dias de faturamento (Recharts com gradient)
5. **Tabela:** 5 últimas reservas (cliente, passeio, data, valor, status)

### Arquivo
- **`src/app/(admin)/admin/page.tsx`** (client component)

### Relatórios
- **`src/app/(admin)/admin/reports/page.tsx`** — BarChart com Recharts

---

## 🎨 Design Patterns & Conventions

### Componentes
- **ButtonLink:** Substitui `asChild` prop (não funciona com shadcn base-nova)
  ```tsx
  import { ButtonLink } from '@/components/ButtonLink'
  <ButtonLink href="/checkout" variant="default">Reservar</ButtonLink>
  ```

- **childCount prop:** Não use `children: number`. Use `childCount` para evitar conflito com React.
  ```tsx
  <CheckinRow childCount={2} />  // ✅
  <CheckinRow children={2} />    // ❌ Conflita com React
  ```

### Tailwind Semântico
```tsx
// ✅ CERTO
<div className="bg-primary text-foreground">
<button className="bg-accent hover:bg-accent/90">

// ❌ ERRADO
<div className="bg-[#0C4A6E] text-[#1a1a1a]">
```

### Zod Schemas com Defaults
```typescript
const checkoutSchema = z.object({
  childCount: z.number().default(0),
  // ...
})

// Para forms com defaults, usar z.input<>
type CheckoutInput = z.input<typeof checkoutSchema>  // number | undefined
type CheckoutOutput = z.output<typeof checkoutSchema> // number (sempre)

// No form:
const form = useForm<CheckoutInput>()  // Permite undefined
const watched = form.watch('childCount') ?? 0  // Fallback a 0
```

### TanStack Query Hooks
```typescript
// src/hooks/use-tours.ts
export function useTours(category?: string) {
  return useQuery({
    queryKey: ['tours', category],
    queryFn: async () => {
      const res = await fetch(`/api/tours?category=${category}`)
      return res.json()
    },
    staleTime: 60000,  // 1 minuto
  })
}
```

---

## 📋 Passeios Seed (Banco de Dados)

### Tours Atuais
1. **Baleia Jubarte** (WHALE) — R$ 250
2. **Barco Praia do Espelho** (BOAT) — R$ 180
3. **Buggy Costa das Baleias** (BUGGY) — R$ 320
4. **Vivência com Pescadores** (EXPERIENCE) — R$ 150
5. **Aldeia Porto do Boi** (EXPERIENCE) — R$ 180
6. **Aldeia Pará-Cura** (EXPERIENCE) — R$ 200 *(A ADICIONAR)*

### Imagens
```
/public/images/
├── baleia-jubarte.jpg          (Unsplash: baleias)
├── barco-espelho.jpg           (Unsplash: pôr do sol praia)
├── buggy-costa.jpg             (Unsplash: desert beach)
├── vivencia-pescadores.jpg     (Unsplash: diving)
├── aldeia-porto-do-boi.jpg     (Real: Pataxó dança)
└── aldeia-para-cura.jpg        (A OBTER)
```

---

## 🚀 Deployment & CI/CD

### Vercel
- **Project:** `prj_mU4M3Wgm2fh1RdHR62I8JGiuLxLc`
- **Team:** `team_Xxf3vFtOJ9oMyQwGScPuClg3`
- **URL:** https://workshop-ia-eight.vercel.app
- **Auto-deploy:** On every push to `main`

### Env Vars (Vercel)
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://workshop-ia-eight.vercel.app
MERCADOPAGO_ACCESS_TOKEN=APP_xxx (A ADICIONAR)
```

### GitHub
- **Repo:** https://github.com/adrianovarlotta/corumbau-passeios
- **Branch:** `main`

### CI Checks
```bash
npm run build          # Build Next.js
npm run tokens:check   # Design tokens sincronizados
npm run lint           # ESLint
```

---

## 📁 Próximas Tarefas

### Imediato
- [ ] Obter MERCADOPAGO_ACCESS_TOKEN do Sandbox
- [ ] Adicionar a `.env.local` e Vercel
- [ ] Testar fluxo Pix (QR code local)
- [ ] Testar fluxo Cartão (redirect a MP checkout)
- [ ] Criar páginas de resultado (`/pagamento/sucesso`, `/pagamento/erro`)

### Homepage
- [ ] Maré real (conectar API Tábua de Marés)
- [ ] Aumentar fontSize do "0.8m Subindo"
- [ ] Featured tours (admin pode destacar datas específicas)
- [ ] Aldeia Pará-Cura (imagem + descrição)

### Detalhe do Passeio
- [ ] Desktop: imagem direita, info esquerda
- [ ] Card de datas melhorado (sem repetir fotos)
- [ ] Padronizar botões em amarelo

### Backend
- [ ] Deprecar `/src/lib/stripe.ts`
- [ ] Integrar Mercado Pago nas API routes
- [ ] Webhook IPN para atualizar pagamentos

### Admin
- [ ] Destaque de passeios (interface)
- [ ] Relatórios mais detalhados

---

## 🐛 Bugs Resolvidos

| Bug | Solução |
|-----|---------|
| `children` prop conflict | Renomeado para `childCount` |
| Barras gráfico invisíveis | Substituído CSS por Recharts BarChart |
| Sidebar sem cores | Substituído CSS vars por hex explícito |
| Zod schema type mismatch | Usado `z.input<>` vs `z.output<>` |
| Next.js CVE-2025-66478 | Upgraded para 15.5.14 |
| npm peer deps | Adicionado `.npmrc` com `legacy-peer-deps` |
| Turbopack cache | Deletado `.next/` |
| Duplicate `:root` CSS | Reescrito `globals.css` com single HSL block |

---

## 📚 Referências & Documentação

- **Next.js:** https://nextjs.org/docs
- **shadcn/ui:** https://ui.shadcn.com/docs
- **Tailwind CSS 4:** https://tailwindcss.com/docs
- **Prisma:** https://www.prisma.io/docs
- **Auth.js v5:** https://authjs.dev
- **Mercado Pago API:** https://www.mercadopago.com.br/developers
- **Tábua de Marés API:** https://tabuamare.devtu.qzz.io/docs
- **Recharts:** https://recharts.org/

---

## 💬 Como Usar Este Documento

Este arquivo é a **fonte única de verdade** do projeto. Quando:

- **Mudanças de arquitetura:** Atualize aqui
- **Novo padrão de código:** Documente na seção "Design Patterns"
- **Novo stage/env:** Adicione em "Deployment"
- **Bug resolvido:** Registre em "Bugs Resolvidos"

**Seu futuro eu (e qualquer AI) vai agradecer! 🙏**
