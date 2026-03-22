import type { Tour, TourDate, Booking, Commission, User } from '@prisma/client'

// Re-export Prisma types
export type { Tour, TourDate, Booking, Commission, User }

// Extended types with relations
export type TourWithDates = Tour & {
  tourDates: TourDate[]
}

export type TourDateWithTour = TourDate & {
  tour: Tour
}

export type BookingWithTourDate = Booking & {
  tourDate: TourDateWithTour
}

export type BookingManifest = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  adults: number
  children: number
  voucherCode: string
  checkedInAt: Date | null
  checkedInBy: string | null
  paymentStatus: string
}

export type CommissionWithRelations = Commission & {
  booking: BookingWithTourDate
  recipient: User
}

// Form types
export type CheckoutFormData = {
  customerName: string
  customerEmail: string
  customerPhone: string
  adults: number
  children: number
  tourDateId: string
  paymentMethod: 'PIX' | 'CREDIT_CARD'
  partnerCode?: string
}

export type OfflineBookingFormData = {
  tourId: string
  tourDateId: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  adults: number
  children: number
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'CASH' | 'COURTESY'
  amountPaid: number
  notes?: string
}

// API response types
export type ApiResponse<T> = {
  data: T
  success: true
} | {
  error: string
  success: false
}

export type KPIData = {
  revenueToday: number
  bookingsToday: number
  revenueMonth: number
  occupancyRate: number
}

export type ReportData = {
  totalRevenue: number
  onlineRevenue: number
  offlineRevenue: number
  averageTicket: number
  salesByDay: { date: string; amount: number; count: number }[]
  salesByCategory: { category: string; amount: number; count: number }[]
}
