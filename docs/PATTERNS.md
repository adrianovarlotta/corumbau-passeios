# Code Patterns & Standards

> Reference for maintaining consistency across the codebase. Follow these patterns exactly.

## 1. Component Patterns

### Client Component

```tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  title: string
  variant?: 'default' | 'highlight'
  className?: string
}

export function MyComponent({ title, variant = 'default', className }: MyComponentProps) {
  const [active, setActive] = useState(false)

  return (
    <div className={cn(
      'rounded-xl p-4 transition-colors',
      variant === 'highlight' && 'bg-accent/10 border-accent',
      className,
    )}>
      <h2 className="font-display text-lg font-bold text-primary">{title}</h2>
      <Button onClick={() => setActive(!active)} size="sm">
        {active ? 'Active' : 'Inactive'}
      </Button>
    </div>
  )
}
```

### Server Component (default)

```tsx
import { prisma } from '@/lib/db'

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tour = await prisma.tour.findUnique({ where: { slug } })

  if (!tour) return notFound()

  return <div>{tour.name}</div>
}
```

### Link as Button (ButtonLink pattern)

```tsx
// CORRECT
import { ButtonLink } from '@/components/ui/button-link'
<ButtonLink href="/passeios/baleia" size="sm" className="bg-accent">
  Reservar
</ButtonLink>

// WRONG — DO NOT USE asChild
<Button asChild><Link href="/passeios/baleia">Reservar</Link></Button>
```

## 2. API Route Patterns

### Public Route (no auth)

```tsx
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const data = await prisma.tour.findMany({ where: { isActive: true } })
    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('Failed:', error)
    return NextResponse.json({ error: 'Erro interno', success: false }, { status: 500 })
  }
}
```

### Protected Route (admin only)

```tsx
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado', success: false }, { status: 401 })
  }

  const data = await prisma.booking.findMany()
  return NextResponse.json({ data, success: true })
}
```

### API Response Format

Always return consistent shape:

```ts
// Success
{ data: T, success: true }

// Error
{ error: string, success: false }
```

## 3. Form Patterns

### react-hook-form + Zod

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations'

export function CheckoutForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      adults: 1,
      children: 0,       // Use default from schema
      paymentMethod: 'PIX',
    },
  })

  // Watch with fallback for optional fields with defaults
  const children = watch('children') ?? 0

  async function onSubmit(data: CheckoutInput) {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    // handle response...
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('customerName')} aria-invalid={!!errors.customerName} />
      {errors.customerName && (
        <p className="text-sm text-destructive">{errors.customerName.message}</p>
      )}
    </form>
  )
}
```

### Zod Schema with Input/Output Types

```ts
import { z } from 'zod'

export const checkoutSchema = z.object({
  adults: z.number().min(1),
  children: z.number().min(0).default(0),  // Has .default()
})

// For form type (children is optional in input)
export type CheckoutInput = z.input<typeof checkoutSchema>

// For validated data type (children is always number)
export type CheckoutOutput = z.output<typeof checkoutSchema>
```

## 4. TanStack Query Patterns

### Query Hook

```tsx
// src/hooks/use-tours.ts
import { useQuery } from '@tanstack/react-query'

export function useTours() {
  return useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const res = await fetch('/api/tours')
      if (!res.ok) throw new Error('Failed to fetch tours')
      const json = await res.json()
      return json.data
    },
  })
}
```

### Mutation Hook

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CheckoutInput) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
```

## 5. Styling Patterns

### Semantic Tailwind Classes Only

```tsx
// CORRECT — semantic classes
<div className="bg-primary text-primary-foreground rounded-lg p-4">
<p className="text-muted-foreground text-sm">
<span className="text-accent font-bold">

// WRONG — hardcoded hex
<div className="bg-[#0C4A6E] text-white">
<p className="text-[#64748b]">
```

### Responsive (Mobile-First)

```tsx
// Mobile first, then adapt for larger screens
<div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3">
<div className="px-4 md:px-6 lg:px-8">
```

### Typography Hierarchy

```tsx
// Page title
<h1 className="font-display text-2xl font-bold text-primary">

// Section title
<h2 className="font-display text-xl font-bold text-primary">

// Card title
<h3 className="font-display text-base font-bold text-primary">

// Body text
<p className="text-sm text-muted-foreground">

// Price
<span className="font-display text-lg font-bold text-primary">R$ 250</span>

// Small label
<span className="text-xs text-muted-foreground">
```

### Conditional Classes (cn utility)

```tsx
import { cn } from '@/lib/utils'

<button className={cn(
  'px-4 py-2 rounded-full text-sm font-medium transition-all',
  isActive
    ? 'bg-primary text-primary-foreground shadow-md'
    : 'bg-muted text-muted-foreground hover:bg-muted/80'
)}>
```

## 6. Prisma Patterns

### Singleton Client

```tsx
// src/lib/db.ts — NEVER create new PrismaClient() elsewhere
import { prisma } from '@/lib/db'
```

### Transaction for Atomic Operations

```tsx
const booking = await prisma.$transaction(async (tx: any) => {
  const newBooking = await tx.booking.create({ data: { ... } })
  await tx.tourDate.update({
    where: { id: tourDateId },
    data: { bookedSlots: { increment: totalPeople } },
  })
  return newBooking
})
```

### Include Relations

```tsx
const booking = await prisma.booking.findUnique({
  where: { id },
  include: {
    tourDate: {
      include: { tour: true },
    },
  },
})
// Access: booking.tourDate.tour.name
```

## 7. Mercado Pago Patterns

### Lazy Client Initialization

```tsx
// Avoids crash during build when env vars are not set
const getClient = (() => {
  let client: MercadoPagoConfig | null = null
  return () => {
    if (!client) {
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
      if (!accessToken) throw new Error('MERCADOPAGO_ACCESS_TOKEN is not configured')
      client = new MercadoPagoConfig({ accessToken })
    }
    return client
  }
})()
```

### Webhook Status Mapping

```tsx
import { PaymentStatus } from '@prisma/client'

// Always use Prisma enum, never raw strings
switch (mpStatus) {
  case 'approved':   return PaymentStatus.PAID
  case 'pending':    return PaymentStatus.PENDING
  case 'rejected':   return PaymentStatus.CANCELLED
  case 'refunded':   return PaymentStatus.REFUNDED
}
```

## 8. Recharts Patterns

### Tooltip Formatter (avoid type errors)

```tsx
// CORRECT — untyped value, cast with Number()
<Tooltip formatter={(value) => [
  `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  'Faturamento',
]} />

// WRONG — will cause TS error
<Tooltip formatter={(value: number) => [...]} />
```

### ResponsiveContainer

```tsx
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="day" />
    <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
    <Area type="monotone" dataKey="revenue" fill="url(#gradient)" />
  </AreaChart>
</ResponsiveContainer>
```

## 9. Storybook Patterns

### Component Story

```tsx
// stories/components/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MyComponent } from '@/components/domain/MyComponent'

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {
    title: 'Example',
    variant: 'default',
  },
}

export const Highlight: Story = {
  args: {
    title: 'Highlighted',
    variant: 'highlight',
  },
}
```

## 10. Error Handling Pattern

### User-Facing Errors in Portuguese

```tsx
// API errors
return NextResponse.json({ error: 'Reserva nao encontrada', success: false }, { status: 404 })
return NextResponse.json({ error: 'Data nao disponivel para reservas', success: false }, { status: 400 })
return NextResponse.json({ error: 'Nao autorizado', success: false }, { status: 401 })

// Client error display
{error && (
  <div className="rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm">
    {error}
  </div>
)}
```

### Console Errors in English

```tsx
console.error('Failed to create booking:', error)
console.error('Webhook processing error:', error)
console.warn('Payment has no external reference:', paymentId)
```
