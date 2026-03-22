# Code Standards & Patterns - Corumbau Passeios

**Documento para:** Dev Senior, AI Assistant, Code Reviewer
**Última atualização:** 22 de março de 2026
**Status:** v1.0 — Estabelecido em produção

---

## 🎨 Design System & CSS

### Princípio Zero: Nenhum Hex Hardcoded

```tsx
// ❌ NUNCA FAÇA ISTO
<div className="bg-[#0C4A6E] text-[#1a1a1a] border-[#EAB308]">

// ✅ SEMPRE ASSIM
<div className="bg-primary text-foreground border-accent">
```

### Semantic Tailwind Classes

| Classe | Uso | Hex |
|--------|-----|-----|
| `bg-primary` / `text-primary` | Azul oceano (headings, botões) | `#0C4A6E` |
| `bg-accent` / `text-accent` | Ouro (CTAs, highlights) | `#EAB308` |
| `bg-secondary` / `text-secondary` | Azul céu (links, badges) | `#0EA5E9` |
| `bg-foreground` / `text-foreground` | Texto escuro (corpo) | `#1a1a1a` |
| `bg-muted` / `text-muted` | Texto secundário | `#999999` |
| `bg-background` | Fundo padrão | `#ffffff` |

### Custom Utilities (em globals.css)

```css
/* Tipografia */
.font-display         /* Cormorant Garamond */
.text-gradient-ocean  /* Gradiente azul oceano */

/* Backgrounds */
.bg-ocean-gradient    /* Linear gradient azul */
.bg-warm-gradient     /* Linear gradient ouro/coral */

/* Efeitos */
.grain-overlay        /* Textura grain subtle */
```

### Atualizar Tokens

Se precisar mudar cores, fontes, tamanhos:

```bash
# 1. Edite design-system/tokens.ts
# 2. Rode:
npm run tokens

# 3. Verifique sincronização:
npm run tokens:check

# 4. Commit:
git add design-system/tokens.ts app/globals.css
git commit -m "chore: update design tokens"
```

---

## 🧩 Componentes & React

### Template de Componente

```tsx
'use client'

import { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * MyComponent - Brief description
 *
 * @example
 * <MyComponent variant="primary">Content</MyComponent>
 */

interface MyComponentProps extends ComponentProps<'div'> {
  /** Variant style */
  variant?: 'primary' | 'secondary'
  /** Children content */
  children: ReactNode
}

export function MyComponent({
  variant = 'primary',
  className,
  children,
  ...props
}: MyComponentProps) {
  const variantStyles = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-black',
  }

  return (
    <div className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </div>
  )
}
```

### Props Naming Convention

```tsx
// ✅ CERTO: childCount para evitar conflito com React.children
<CheckinRow childCount={2} />

// ❌ ERRADO: children é reservado
<CheckinRow children={2} />

// ✅ CERTO: className é extensível
<Button className="px-8" />

// ✅ CERTO: usar ...props spread para flexibilidade
<div {...props} />
```

### Client vs Server Components

```tsx
// ✅ Server Component (padrão)
// Sem 'use client', pode usar async, banco direto
export async function TourList() {
  const tours = await db.tour.findMany()
  return <div>{tours.map(...)}</div>
}

// ✅ Client Component (hooks, eventos, state)
'use client'
export function TourFilter() {
  const [category, setCategory] = useState('all')
  return <select value={category} onChange={...} />
}

// ❌ ERRO: Server component chamando client hook
export async function BadComponent() {
  const [state, setState] = useState() // ❌ Não funciona
}
```

### Shadcn/ui Components

**Importante:** Este projeto usa shadcn/ui **base-nova style** — sem suporte a `asChild` prop.

```tsx
// ❌ NÃO FUNCIONA (asChild não existe)
<Button asChild>
  <Link href="/checkout">Reservar</Link>
</Button>

// ✅ CERTO: Usar ButtonLink component
import { ButtonLink } from '@/components/ButtonLink'
<ButtonLink href="/checkout" variant="default">
  Reservar
</ButtonLink>

// ✅ ALTERNATIVA: wrapping manual
<Link href="/checkout">
  <Button variant="default">Reservar</Button>
</Link>
```

---

## 🛣️ API Routes & Backend

### Template de API Route

```typescript
// src/app/api/example/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * GET /api/example
 * Descrição da rota
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Auth check (se necessário)
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Role check (se necessário)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // 3. Parse input
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      )
    }

    // 4. Fetch data
    const data = await db.example.findUnique({ where: { id } })

    if (!data) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      )
    }

    // 5. Return success
    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/example]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/example
 * Criar novo item
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description } = body

    // Validação (considere usar Zod)
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const created = await db.example.create({
      data: { name, description },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('[POST /api/example]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Auth & Authorization Pattern

```typescript
// ✅ PADRÃO: Sempre check session
const session = await auth()

// Public endpoint
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// Admin only
if (session.user.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// Operator or Admin
if (!['ADMIN', 'OPERATOR'].includes(session.user.role)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Error Handling

```typescript
// ✅ PADRÃO: Log + generic error response
try {
  // ...
} catch (error) {
  console.error('[POST /api/bookings]', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

// ❌ EVITAR: Expor erro interno
return NextResponse.json({ error: error.message }, { status: 500 })
```

---

## 🔗 Data Fetching (TanStack Query)

### Hook Pattern

```typescript
// src/hooks/use-tours.ts

import { useQuery } from '@tanstack/react-query'

interface Tour {
  id: string
  name: string
  price: number
}

/**
 * Fetch all tours, optionally filtered by category
 * @param category - WHALE, BOAT, BUGGY, EXPERIENCE
 */
export function useTours(category?: string) {
  return useQuery({
    queryKey: ['tours', category],
    queryFn: async () => {
      const url = new URL('/api/tours', window.location.origin)
      if (category) url.searchParams.set('category', category)

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('Failed to fetch tours')

      return res.json() as Promise<Tour[]>
    },
    staleTime: 60000,        // 1 minuto
    retry: 2,
    retryDelay: 1000,
  })
}

// Uso
'use client'

export function TourList() {
  const { data: tours, isLoading, error } = useTours('WHALE')

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar</div>

  return (
    <div>
      {tours?.map(tour => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  )
}
```

### Mutation Pattern (Create/Update/Delete)

```typescript
// src/hooks/use-create-booking.ts

import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/components/providers/QueryProvider'

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (data: CreateBookingInput) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create booking')
      }

      return res.json()
    },
    onSuccess: () => {
      // Invalidar cache para refetch
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['tours'] })
    },
    onError: (error) => {
      console.error('Booking creation failed:', error)
    },
  })
}

// Uso
'use client'

export function CheckoutForm() {
  const { mutate: createBooking, isPending } = useCreateBooking()

  const handleSubmit = (data: CreateBookingInput) => {
    createBooking(data)
  }

  return <form onSubmit={handleSubmit} />
}
```

---

## ✅ Validação com Zod

### Schema Pattern

```typescript
// src/lib/validations.ts

import { z } from 'zod'

// Problema: z.number().default(0) faz input type ser number | undefined
// Solução: usar z.input<> para forms, z.output<> para database

export const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  childCount: z.number().int().min(0).default(0),
  tourDateId: z.string(),
})

// Para forms (permite undefined):
export type CheckoutInput = z.input<typeof checkoutSchema>

// Para database (sempre tem valor):
export type CheckoutOutput = z.output<typeof checkoutSchema>
```

### Form Integration (react-hook-form)

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckoutInput, checkoutSchema } from '@/lib/validations'

export function CheckoutForm() {
  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      childCount: 0,
    },
  })

  // Watch com fallback para defaults
  const childCount = form.watch('childCount') ?? 0

  const onSubmit = async (data: CheckoutInput) => {
    // Validação já feita por Zod + react-hook-form
    const validated = checkoutSchema.parse(data) // CheckoutOutput
    await fetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(validated),
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('customerName')} />
      <button disabled={!form.formState.isValid}>Prosseguir</button>
    </form>
  )
}
```

---

## 📊 Database (Prisma)

### Migration Workflow

```bash
# 1. Editar schema.prisma
# 2. Criar migração
npx prisma migrate dev --name add_featured_column

# 3. Verificar schema
npx prisma studio

# 4. Commit
git add prisma/migrations/
git commit -m "feat: add featured tours support"
```

### Query Patterns

```typescript
// src/lib/db.ts (reexportar client)
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient
}

export const db = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = db
}
```

```typescript
// Uso em API routes
import { db } from '@/lib/db'

// Read
const tours = await db.tour.findMany({
  where: { category: 'WHALE' },
  include: { dates: true },
})

const tour = await db.tour.findUnique({
  where: { id: tourId },
  select: { name: true, price: true },
})

// Create
const booking = await db.booking.create({
  data: {
    tourDateId,
    customerName,
    customerEmail,
    voucherCode: generateVoucher(),
  },
})

// Update
await db.tour.update({
  where: { id: tourId },
  data: { featured: true },
})

// Delete
await db.booking.delete({
  where: { id: bookingId },
})

// Transaction
const result = await db.$transaction(async (tx) => {
  const booking = await tx.booking.create({ data: {...} })
  await tx.tourDate.update({
    where: { id: booking.tourDateId },
    data: { capacity: { decrement: 1 } },
  })
  return booking
})
```

---

## 🔐 Authentication

### Auth.js v5 Setup

```typescript
// src/lib/auth.ts

import { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from './db'

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) return null

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

### Usando Session

```tsx
// API route
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  console.log(session.user.role) // 'ADMIN' | 'OPERATOR'
}

// Component
'use client'
import { useSession } from 'next-auth/react'

export function AdminPanel() {
  const { data: session } = useSession()
  if (session?.user?.role !== 'ADMIN') return <div>Forbidden</div>
  return <div>Admin content</div>
}
```

---

## 📋 Formulários & Validação

### Padrão Completo

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations'
import { useCreateBooking } from '@/hooks/use-create-booking'

export function CheckoutForm() {
  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      childCount: 0,
      tourDateId: '',
    },
  })

  const { mutate: createBooking, isPending } = useCreateBooking()

  const onSubmit = form.handleSubmit((data) => {
    createBooking(data, {
      onSuccess: () => {
        form.reset()
        // Redirect ou toast
      },
    })
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        {...form.register('customerName')}
        placeholder="Seu nome"
        className="w-full rounded border p-2"
      />
      {form.formState.errors.customerName && (
        <p className="text-red-500 text-sm">
          {form.formState.errors.customerName.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || !form.formState.isValid}
        className="bg-accent text-white px-6 py-2 rounded"
      >
        {isPending ? 'Processando...' : 'Confirmar'}
      </button>
    </form>
  )
}
```

---

## 🧪 Testing & Debugging

### Local Dev

```bash
# Dev server
npm run dev

# Build check
npm run build

# Storybook (design system)
npm run storybook

# Database GUI
npx prisma studio

# Check design tokens
npm run tokens:check
```

### Console Logging

```typescript
// ✅ PADRÃO: log com contexto
console.error('[POST /api/bookings]', error)
console.log('[useTours] Loading tours for category:', category)

// ❌ EVITAR: generic logs
console.log(error)
console.log(data)
```

### Error Messages

```typescript
// ✅ PADRÃO: user-friendly
return NextResponse.json(
  { error: 'Email já cadastrado' },
  { status: 400 }
)

// ❌ EVITAR: technical details
return NextResponse.json(
  { error: 'UNIQUE constraint failed on user.email' },
  { status: 400 }
)
```

---

## 🚀 Git & Commits

### Commit Message Format

```bash
# Feature
git commit -m "feat: add featured tours support"

# Bug fix
git commit -m "fix: padding on mobile buttons"

# Chore/docs
git commit -m "chore: update design tokens"
git commit -m "docs: add Mercado Pago setup guide"

# Co-authored (com AI)
git commit -m "$(cat <<'EOF'
feat: implement Mercado Pago payment flow

- Add src/lib/mercadopago.ts with SDK integration
- Create /api/payment/pix and /api/payment/card routes
- Add webhook handler at /api/webhooks/mercadopago

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Branch Strategy

```bash
# Main branch: production-ready
# Todos os merges via push (no pull requests neste projeto solo)

git checkout main
git pull origin main
git push origin main
```

---

## ⚠️ Common Pitfalls & Solutions

| Problema | Causa | Solução |
|----------|-------|---------|
| `children` prop conflict | React tem built-in `children` | Use `childCount` |
| Gráfico invisível | CSS flex height 0 | Use Recharts, não CSS |
| Cors errors | Requisição cross-origin | Usar `/api/*` routes |
| Build fails | Tipo mismatch TypeScript | `npm run build`, fix errors |
| Imagens quebradas | Usando `<img>` com src relativo | Use `next/image` com Image |
| Auth não funciona | Session não inicializada | Verificar `NEXTAUTH_SECRET` |
| Tailwind não aplica | Classe não no allowlist | Usar semântica ou `arbitrary` |
| Prisma type error | Schema desync | `npx prisma generate` |

---

## 📚 Referências Rápidas

- **Next.js:** https://nextjs.org/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind:** https://tailwindcss.com/docs
- **Prisma:** https://www.prisma.io/docs
- **Auth.js:** https://authjs.dev
- **React Hook Form:** https://react-hook-form.com
- **Zod:** https://zod.dev
- **TanStack Query:** https://tanstack.com/query

---

**Versão:** 1.0
**Status:** Em uso em produção
**Última atualização:** 22 de março de 2026

Mantenha este documento atualizado conforme novos padrões emergirem.
