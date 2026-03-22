import { z } from 'zod'

export const checkoutSchema = z.object({
  customerName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  customerEmail: z.string().email('Email invalido'),
  customerPhone: z.string().min(10, 'Telefone deve ter pelo menos 10 digitos').regex(/^[0-9()+\- ]+$/, 'Formato de telefone invalido'),
  adults: z.number().int().min(1, 'Minimo 1 adulto'),
  children: z.number().int().min(0).default(0),
  tourDateId: z.string().cuid(),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD']),
  partnerCode: z.string().optional(),
})

export const offlineBookingSchema = z.object({
  tourId: z.string().cuid(),
  tourDateId: z.string().cuid(),
  customerName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  customerEmail: z.string().email('Email invalido').optional().or(z.literal('')),
  customerPhone: z.string().min(10, 'Telefone deve ter pelo menos 10 digitos'),
  adults: z.number().int().min(1, 'Minimo 1 adulto'),
  children: z.number().int().min(0).default(0),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'CASH', 'COURTESY']),
  amountPaid: z.number().min(0),
  notes: z.string().optional(),
})

export const tourSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minusculas, numeros e hifens'),
  description: z.string().min(10, 'Descricao deve ter pelo menos 10 caracteres'),
  duration: z.string().min(1, 'Duracao e obrigatoria'),
  includes: z.array(z.string()),
  priceAdult: z.number().positive('Preco adulto deve ser positivo'),
  priceChild: z.number().min(0).optional(),
  maxCapacity: z.number().int().positive('Capacidade deve ser positiva'),
  category: z.enum(['BOAT', 'BUGGY', 'WHALE', 'EXPERIENCE']),
  images: z.array(z.string()),
  isActive: z.boolean().default(true),
  commissionRate: z.number().min(0).max(1).default(0.10),
})

export const tourDateSchema = z.object({
  tourId: z.string().cuid(),
  date: z.string().datetime(),
  time: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/, 'Formato HH:MM'),
  totalSlots: z.number().int().positive('Vagas devem ser positivas'),
})

export const cancelDateSchema = z.object({
  reason: z.enum(['Mau tempo', 'Embarcacao indisponivel', 'Outro']),
  customReason: z.string().optional(),
})

export type CheckoutInput = z.input<typeof checkoutSchema>
export type CheckoutOutput = z.output<typeof checkoutSchema>
export type OfflineBookingInput = z.infer<typeof offlineBookingSchema>
export type TourInput = z.infer<typeof tourSchema>
export type TourDateInput = z.infer<typeof tourDateSchema>
export type CancelDateInput = z.infer<typeof cancelDateSchema>
