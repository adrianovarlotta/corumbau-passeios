---
shaping: true
---

# Corumbau Passeios — Breadboard

**Shape:** C — Monolito Next.js + Service Worker no módulo /check
**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS 4 · shadcn/ui · TanStack Query · Prisma · Auth.js v5 · Stripe · Resend · Storybook 10

---

## Schema de Dados (Prisma)

```prisma
model Tour {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String
  duration    String      // "4 horas", "Dia inteiro"
  includes    String[]    // ["Snorkel", "Colete salva-vidas"]
  priceAdult  Decimal
  priceChild  Decimal?    // null = não aceita criança / mesmo preço
  maxCapacity Int
  category    TourCategory
  images      String[]
  isActive    Boolean     @default(true)
  tourDates   TourDate[]
  commissions Commission[]
  createdAt   DateTime    @default(now())
}

enum TourCategory { BOAT BUGGY WHALE EXPERIENCE }

model TourDate {
  id             String      @id @default(cuid())
  tourId         String
  tour           Tour        @relation(fields: [tourId], references: [id])
  date           DateTime
  time           String      // "06:00", "13:00"
  totalSlots     Int
  bookedSlots    Int         @default(0)
  status         DateStatus  @default(OPEN)
  cancelReason   String?
  cancelledAt    DateTime?
  bookings       Booking[]
  createdAt      DateTime    @default(now())
}

enum DateStatus { OPEN FULL CANCELLED }

model Booking {
  id              String        @id @default(cuid())
  tourDateId      String
  tourDate        TourDate      @relation(fields: [tourDateId], references: [id])
  customerName    String
  customerEmail   String
  customerPhone   String
  adults          Int           @default(1)
  children        Int           @default(0)
  unitPriceAdult  Decimal
  unitPriceChild  Decimal       @default(0)
  totalAmount     Decimal
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   PaymentMethod
  paymentId       String?       // ID do gateway (Stripe)
  source          BookingSource @default(ONLINE)
  voucherCode     String        @unique
  checkedInAt     DateTime?
  checkedInBy     String?       // User.id do operador
  notes           String?
  commissions     Commission[]
  createdAt       DateTime      @default(now())
}

enum PaymentStatus { PENDING PAID REFUNDED CANCELLED }
enum PaymentMethod { PIX CREDIT_CARD CASH COURTESY }
enum BookingSource { ONLINE OFFLINE WHATSAPP }

model Commission {
  id          String         @id @default(cuid())
  bookingId   String
  booking     Booking        @relation(fields: [bookingId], references: [id])
  tourId      String
  tour        Tour           @relation(fields: [tourId], references: [id])
  recipientId String
  recipient   User           @relation(fields: [recipientId], references: [id])
  amount      Decimal
  percentage  Decimal
  type        CommissionType
  isPaid      Boolean        @default(false)
  paidAt      DateTime?
  createdAt   DateTime       @default(now())
}

enum CommissionType { OPERATOR SELLER }

model User {
  id          String       @id @default(cuid())
  name        String
  email       String       @unique
  password    String?
  role        UserRole
  phone       String?
  commissions Commission[]
  createdAt   DateTime     @default(now())
}

enum UserRole { ADMIN OPERATOR }
```

---

## Places

| # | Place | Route | Auth | Description |
|---|-------|-------|------|-------------|
| P1 | Landing | `/` | ❌ | Hero + destaques + CTA |
| P2 | Catálogo | `/passeios` | ❌ | Grid de passeios com filtros |
| P3 | Detalhe do Passeio | `/passeios/[slug]` | ❌ | Fotos, descrição, CTA |
| P4 | Modal Seleção Data/Vagas | (modal sobre P3) | ❌ | Calendário + quantidade |
| P5 | Checkout | `/checkout` | ❌ | Dados do cliente + método |
| P6 | Pagamento Pix | `/checkout/pix` | ❌ | QR Code + polling |
| P6b | Pagamento Cartão | `/checkout/card` | ❌ | Iframe Stripe |
| P7 | Confirmação/Voucher | `/confirmacao/[bookingId]` | ❌ | Voucher + QR Code |
| P8 | Login Admin | `/admin/login` | ❌ | Form login gestora |
| P9 | Overview Admin | `/admin` | ADMIN | KPIs + próximas reservas |
| P10 | Gestão de Passeios | `/admin/tours` | ADMIN | CRUD tours |
| P11 | Modal Tour | (modal sobre P10) | ADMIN | Form criar/editar tour |
| P12 | Datas do Tour | `/admin/tours/[id]/dates` | ADMIN | Calendário de datas |
| P13 | Lançamento Offline | (modal sobre P9/P12) | ADMIN | Form venda manual |
| P14 | Comissões | `/admin/commissions` | ADMIN | Lista + marcar pago |
| P15 | Relatórios | `/admin/reports` | ADMIN | Charts + export CSV |
| P16 | Login Operador | `/check/login` | ❌ | Login simplificado |
| P17 | Manifest do Dia | `/check` | OPERATOR | Lista de passageiros |
| P18 | Scanner QR | `/check/scan` | OPERATOR | Câmera + validação |
| P19 | Modal Confirmação | (modal sobre P17) | OPERATOR | Dados do voucher + OK |
| PB | Backend API | `/api/*` | varies | Handlers + Prisma |

---

## MÓDULO 1 — LOJA (Turista)

### UI Affordances — Módulo 1

| # | Place | Component | Affordance | Control | Wires Out | Returns To |
|---|-------|-----------|------------|---------|-----------|------------|
| U1 | P1 | `HeroSection` | Botão "Ver Passeios" | click | → P2 | — |
| U2 | P1 | `TourCard` | Card destaque passeio | click | → P3 | — |
| U3 | P1 | `Navbar` | Link "Passeios" | click | → P2 | — |
| U4 | P1 | `SeasonBadge` | Badge "Temporada de Baleias" | render | — | — |
| U5 | P2 | `CategoryFilter` | Tabs filtro (Todos/Baleia/Barco/Buggy/Vivência) | click | → N2 | — |
| U6 | P2 | `TourGrid` | Grid de TourCards | render | — | — |
| U7 | P2 | `TourCard` | Card passeio | click | → P3 | — |
| U8 | P2 | `LoadingSkeleton` | Skeleton 4 cards | render | — | — |
| U9 | P2 | `EmptyState` | "Nenhum passeio disponível" | render | — | — |
| U10 | P3 | `PhotoGallery` | Galeria de fotos (swiper mobile) | swipe/click | — | — |
| U11 | P3 | `TourDetail` | Título, descrição, duração | render | — | — |
| U12 | P3 | `TourCategoryBadge` | Badge categoria colorido | render | — | — |
| U13 | P3 | `IncludesList` | Lista "O que inclui" | render | — | — |
| U14 | P3 | `PriceDisplay` | Preço por pessoa (adulto/criança) | render | — | — |
| U15 | P3 | `CTAButton` | Botão "Escolher Data" | click | → P4 | — |
| U16 | P3 | `Breadcrumb` | Link voltar ao catálogo | click | → P2 | — |
| U17 | P4 | `AvailabilityCalendar` | Calendário com status de vagas | click | → N5 | — |
| U18 | P4 | `DatePill` | Data selecionada | render | — | — |
| U19 | P4 | `TimeBadge` | Horário da saída | render | — | — |
| U20 | P4 | `QuantitySelector` | Seletor adultos (+/-) | click | → N6 | — |
| U21 | P4 | `QuantitySelector` | Seletor crianças (+/-) | click | → N6 | — |
| U22 | P4 | `PriceSummary` | Total dinâmico em tempo real | render | — | — |
| U23 | P4 | `SlotsWarning` | "Apenas X vagas restantes!" | render | — | — |
| U24 | P4 | `CTAButton` | Botão "Continuar" | click | → N7 → P5 | — |
| U25 | P5 | `OrderSummary` | Resumo: passeio, data, hora, pessoas, total | render | — | — |
| U26 | P5 | `CheckoutForm` | Input Nome completo | type | — | — |
| U27 | P5 | `CheckoutForm` | Input Email | type | — | — |
| U28 | P5 | `CheckoutForm` | Input Telefone/WhatsApp | type | — | — |
| U29 | P5 | `PaymentToggle` | Toggle Pix / Cartão | click | → S5 | — |
| U30 | P5 | `CTAButton` | Botão "Pagar com Pix" / "Pagar com Cartão" | click | → N10 | — |
| U31 | P5 | `FormError` | Erros de validação inline | render | — | — |
| U32 | P6 | `PixQRCode` | QR Code Pix (imagem) | render | — | — |
| U33 | P6 | `PixCopyCode` | Código copia-e-cola | render | — | — |
| U34 | P6 | `CopyButton` | Botão "Copiar código" | click | → N12 | — |
| U35 | P6 | `ExpirationTimer` | Contagem regressiva 30 min | render | — | — |
| U36 | P6 | `PaymentStatus` | "Aguardando pagamento..." / spinner | render | — | — |
| U37 | P6 | `SuccessAnimation` | Flash verde + redirect automático | render | → P7 | — |
| U38 | P6b | `MercadoPagoIframe` | Formulário cartão (MP Bricks) | fill | — | — |
| U39 | P6b | `CTAButton` | Botão "Confirmar pagamento" | click | → N13 | — |
| U40 | P6b | `LoadingOverlay` | "Processando..." | render | — | — |
| U41 | P6b | `PaymentError` | "Cartão recusado, tente novamente" | render | — | — |
| U42 | P7 | `SuccessCheck` | Animação check de sucesso | render | — | — |
| U43 | P7 | `VoucherCard` | QR Code do voucher | render | — | — |
| U44 | P7 | `VoucherCode` | Código alfanumérico (6 chars) | render | — | — |
| U45 | P7 | `BookingDetails` | Passeio, data, hora, pessoas | render | — | — |
| U46 | P7 | `CTAButton` | Botão "Baixar voucher (PDF)" | click | → N15 | — |
| U47 | P7 | `WhatsAppShare` | Botão "Compartilhar no WhatsApp" | click | → N16 | — |
| U48 | P7 | `EmailNotice` | "Verifique seu email [email]" | render | — | — |
| U49 | P7 | `CTAButton` | Botão "Ver mais passeios" | click | → P2 | — |

### Code Affordances — Módulo 1

| # | Place | Component | Affordance | Control | Wires Out | Returns To |
|---|-------|-----------|------------|---------|-----------|------------|
| N1 | P2 | `api/tours` | `GET /api/tours?category=` | call | → PB | → N2 |
| N2 | P2 | `useTours` | `useQuery(['tours', category])` | observe | → N1 | → U6, U8, U9 |
| N3 | P3 | `api/tours/[slug]` | `GET /api/tours/[slug]` | call | → PB | → N4 |
| N4 | P3 | `useTour` | `useQuery(['tour', slug])` | observe | → N3 | → U10–U15 |
| N5 | P4 | `api/tour-dates` | `GET /api/tour-dates?tourId=&month=` | call | → PB | → U17 |
| N6 | P4 | `useBookingBuilder` | `calculateTotal(adults, children, tourDate)` | call | — | → U22, U23 |
| N7 | P5 | `validateSelection` | Verifica `availableSlots >= (adults+children)` | call | — | → U31 ou → P5 |
| N8 | P5 | `useCheckoutForm` | `zodSchema.parse(formData)` | call | — | → U31 ou → N9 |
| N9 | P5 | `useCheckoutForm` | `storeCheckoutData(formData)` | call | → S4 | — |
| N10 | P5 | `api/bookings` | `POST /api/bookings` → cria Booking PENDING | call | → PB | → N11 |
| N11 | P5/P6 | `useCreateBooking` | `useMutation('createBooking')` | mutate | → N10 | → P6 ou P6b |
| N12 | P6 | `PixPayment` | `navigator.clipboard.writeText(pixCode)` | call | → S_Clipboard | — |
| N13 | P6 | `api/payment/pix` | `GET /api/payment/pix?bookingId=` → Stripe Payment Intent with Pix | call | → PB | → U32, U33, U35 |
| N14 | P6 | `usePixPolling` | `useQuery(['paymentStatus', bookingId], {refetchInterval: 3000})` | poll | → N13b | → U36, U37 |
| N13b | P6 | `api/payment/status` | `GET /api/payment/status?bookingId=` | call | → PB | → N14 |
| N15 | P7 | `VoucherPDF` | `generateVoucherPDF(booking)` → download | call | — | → browser download |
| N16 | P7 | `WhatsAppShare` | `buildWhatsAppLink(voucherCode, tourName, date)` → open | call | → browser | — |
| N17 | PB | `api/bookings POST` | `prisma.booking.create()` + `generateVoucherCode()` | call | → S_DB | → N10 |
| N18 | PB | `api/webhooks/mp` | `POST /api/webhooks/mercadopago` → verifica assinatura | receive | → N19 | — |
| N19 | PB | `webhookHandler` | `updateBookingStatus(PAID)` + `sendVoucherEmail()` | call | → S_DB, → N20 | — |
| N20 | PB | `emailService` | `resend.emails.send({template: 'voucher', to: email})` | call | — | — |
| N21 | PB | `validateAvailability` | `tourDate.totalSlots - tourDate.bookedSlots >= quantity` | call | — | → N10 |

### Data Stores — Módulo 1

| # | Place | Store | Type | Description |
|---|-------|-------|------|-------------|
| S1 | P4 | `selectedTourDate` | `TourDate \| null` | Data/hora selecionada |
| S2 | P4 | `selectedQuantity` | `{adults, children}` | Quantidade de pessoas |
| S3 | P5 | `checkoutFormData` | `CheckoutForm` | Dados pessoais do cliente |
| S4 | P5 | `paymentMethod` | `'PIX' \| 'CREDIT_CARD'` | Método escolhido |
| S5 | P6 | `pixData` | `{qrCode, code, expiresAt}` | Dados do QR Pix |
| S6 | P6 | `currentBookingId` | `string \| null` | ID do booking em progresso |
| S7 | P7 | `confirmedBooking` | `Booking` | Booking confirmado para exibir voucher |
| S_DB | PB | `PostgreSQL (Neon)` | external | Banco principal via Prisma |
| S_Clipboard | — | `Browser Clipboard` | external | Cópia do código Pix |

---

## MÓDULO 2 — DASHBOARD ADMIN

### UI Affordances — Módulo 2

| # | Place | Component | Affordance | Control | Wires Out | Returns To |
|---|-------|-----------|------------|---------|-----------|------------|
| U50 | P8 | `LoginForm` | Input Email | type | — | — |
| U51 | P8 | `LoginForm` | Input Senha | type | — | — |
| U52 | P8 | `LoginForm` | Botão "Entrar" | click | → N22 | — |
| U53 | P8 | `LoginError` | "Credenciais inválidas" | render | — | — |
| U54 | P9 | `KPICard` | Card "Faturamento hoje" (R$) | render | — | — |
| U55 | P9 | `KPICard` | Card "Reservas hoje" (n) | render | — | — |
| U56 | P9 | `KPICard` | Card "Faturamento mês" (R$) | render | — | — |
| U57 | P9 | `KPICard` | Card "Taxa ocupação" (%) | render | — | — |
| U58 | P9 | `UpcomingBookingsTable` | Tabela próximas reservas (data, passeio, cliente, status) | render | — | — |
| U59 | P9 | `UpcomingBookingsTable` | Row click → ver detalhe | click | → N23 | — |
| U60 | P9 | `LowStockAlert` | Badge alerta "X: apenas 2 vagas" | render | — | — |
| U61 | P9 | `QuickActions` | Botão "+ Lançamento Offline" | click | → P13 | — |
| U62 | P9 | `AdminSidebar` | Nav: Passeios / Reservas / Comissões / Relatórios | click | → routes | — |
| U63 | P10 | `ToursTable` | Tabela: nome, categoria, preço, capacidade, status | render | — | — |
| U64 | P10 | `ToursTable` | Toggle Ativo/Inativo | click | → N24 | — |
| U65 | P10 | `ToursTable` | Botão "Editar" | click | → P11 | — |
| U66 | P10 | `ToursTable` | Botão "Datas" | click | → P12 | — |
| U67 | P10 | `ToursTable` | Botão "+ Novo Passeio" | click | → P11 | — |
| U68 | P10 | `SearchInput` | Busca por nome | type | → N25 | — |
| U69 | P11 | `TourForm` | Input Nome do passeio | type | — | — |
| U70 | P11 | `TourForm` | Select Categoria | change | — | — |
| U71 | P11 | `TourForm` | Textarea Descrição | type | — | — |
| U72 | P11 | `TourForm` | Input Duração ("4 horas") | type | — | — |
| U73 | P11 | `TourForm` | Input Preço adulto (R$) | type | — | — |
| U74 | P11 | `TourForm` | Input Preço criança (R$) | type | — | — |
| U75 | P11 | `TourForm` | Input Capacidade máxima | type | — | — |
| U76 | P11 | `ImageUpload` | Upload de imagens (múltiplas, drag & drop) | drop/click | → N26 | — |
| U77 | P11 | `TourForm` | Toggle "Ativo" | click | — | — |
| U78 | P11 | `TourForm` | Botão "Salvar" | click | → N27 | — |
| U79 | P11 | `TourForm` | Botão "Cancelar" | click | → P10 | — |
| U80 | P12 | `DateCalendar` | Calendário de datas do tour | render | — | — |
| U81 | P12 | `DateCard` | Card por data: vagas totais/vendidas/disponíveis + badge status | render | — | — |
| U82 | P12 | `DateCard` | Botão "Ver manifest" | click | → N28 | — |
| U83 | P12 | `DateCard` | Botão "Cancelar data" (vermelho) | click | → P_CancelModal | — |
| U84 | P12 | `AddDateForm` | Botão "+ Adicionar data" | click | → modal inline | — |
| U85 | P12 | `AddDateForm` | Date picker + Time input + Slots input | fill | → N29 | — |
| U86 | P_CancelModal | `CancelDateModal` | Select motivo (Mau tempo / Embarcação / Outro) | change | — | — |
| U87 | P_CancelModal | `CancelDateModal` | Textarea motivo personalizado | type | — | — |
| U88 | P_CancelModal | `CancelDateModal` | Botão "Confirmar cancelamento" | click | → N30 | — |
| U89 | P13 | `OfflineBookingForm` | Select passeio | change | → N31 | — |
| U90 | P13 | `OfflineBookingForm` | Select data/horário | change | → N32 | — |
| U91 | P13 | `OfflineBookingForm` | Display vagas disponíveis (read-only) | render | — | — |
| U92 | P13 | `OfflineBookingForm` | Input número de adultos | type | → N33 | — |
| U93 | P13 | `OfflineBookingForm` | Input número de crianças | type | → N33 | — |
| U94 | P13 | `OfflineBookingForm` | Input nome do cliente | type | — | — |
| U95 | P13 | `OfflineBookingForm` | Input telefone | type | — | — |
| U96 | P13 | `OfflineBookingForm` | Input email (opcional) | type | — | — |
| U97 | P13 | `OfflineBookingForm` | Select forma de pagamento (Dinheiro/Pix/Cartão/Cortesia) | change | — | — |
| U98 | P13 | `OfflineBookingForm` | Input valor cobrado (auto mas editável) | type | — | — |
| U99 | P13 | `OfflineBookingForm` | Textarea observações | type | — | — |
| U100 | P13 | `OfflineBookingForm` | Botão "Registrar venda" | click | → N34 | — |
| U101 | P14 | `CommissionsFilter` | Filtro por operador | change | → N35 | — |
| U102 | P14 | `CommissionsFilter` | Filtro por período (date range) | change | → N35 | — |
| U103 | P14 | `CommissionsTable` | Tabela: data, passeio, operador, valor, %, status | render | — | — |
| U104 | P14 | `CommissionsTable` | Checkbox seleção para pagar em lote | click | → S8 | — |
| U105 | P14 | `CommissionsTable` | Botão "Marcar selecionados como pago" | click | → N36 | — |
| U106 | P14 | `CommissionTotal` | Total selecionado (R$) | render | — | — |
| U107 | P15 | `DateRangePicker` | Seletor de período | change | → N37 | — |
| U108 | P15 | `ReportKPIs` | Cards: total, online vs offline, ticket médio | render | — | — |
| U109 | P15 | `SalesChart` | Gráfico de barras: vendas por dia | render | — | — |
| U110 | P15 | `CategoryTable` | Tabela por categoria (WHALE, BOAT, BUGGY, EXPERIENCE) | render | — | — |
| U111 | P15 | `ExportButton` | Botão "Exportar CSV" | click | → N38 | — |

### Code Affordances — Módulo 2

| # | Place | Component | Affordance | Control | Wires Out | Returns To |
|---|-------|-----------|------------|---------|-----------|------------|
| N22 | P8 | `auth` | `Auth.js signIn(credentials)` | call | → PB | → P9 ou U53 |
| N23 | P9 | `api/admin/bookings/[id]` | `GET /api/admin/bookings/[id]` | call | → PB | → modal detalhe |
| N24 | P10 | `api/admin/tours/[id]` | `PATCH /api/admin/tours/[id]` → toggle isActive | call | → PB | → U64 |
| N25 | P10 | `useAdminTours` | `useQuery(['admin-tours', search])` | observe | → N25a | → U63 |
| N25a | PB | `api/admin/tours` | `GET /api/admin/tours?search=` | call | → PB | → N25 |
| N26 | P11 | `api/admin/upload` | `POST /api/admin/upload` → Vercel Blob / Cloudflare R2 | call | → Storage | → U76 |
| N27 | P11 | `useUpsertTour` | `useMutation` → POST ou PATCH `/api/admin/tours` | mutate | → PB | → P10 |
| N28 | P12 | `api/admin/manifest` | `GET /api/admin/manifest?tourDateId=` | call | → PB | → modal manifest |
| N29 | P12 | `useCreateDate` | `useMutation` → `POST /api/admin/tour-dates` | mutate | → PB | → U80 |
| N30 | P12 | `useCancelDate` | `useMutation` → `POST /api/admin/tour-dates/[id]/cancel` | mutate | → PB, N30a | → U80 |
| N30a | PB | `cancelDateHandler` | `updateTourDate(CANCELLED)` + `cancelAllBookings()` + `sendCancellationEmails()` + `initiateRefunds()` | call | → S_DB, → N20 | — |
| N31 | P13 | `api/admin/tours/[id]/dates` | `GET` → datas disponíveis do tour | call | → PB | → U90 |
| N32 | P13 | `useOfflineBuilder` | `calculateTotal(adults, children, tourDate)` | call | — | → U98 |
| N33 | P13 | `useOfflineBuilder` | `getAvailableSlots(tourDateId)` | call | → PB | → U91 |
| N34 | P13 | `useCreateOfflineBooking` | `useMutation` → `POST /api/admin/bookings` com `source: OFFLINE` | mutate | → PB | → success toast |
| N35 | P14 | `useCommissions` | `useQuery(['commissions', filters])` | observe | → N35a | → U103 |
| N35a | PB | `api/admin/commissions` | `GET /api/admin/commissions?operatorId=&from=&to=` | call | → PB | → N35 |
| N36 | P14 | `useMarkPaid` | `useMutation` → `PATCH /api/admin/commissions/batch` | mutate | → PB | → U103 |
| N37 | P15 | `useReports` | `useQuery(['reports', dateRange])` | observe | → N37a | → U108–U110 |
| N37a | PB | `api/admin/reports` | `GET /api/admin/reports?from=&to=` → aggregated data | call | → PB | → N37 |
| N38 | P15 | `exportCSV` | `generateCSV(reportData)` → download | call | — | → browser download |
| N39 | PB | `calculateCommissions` | `booking.totalAmount × tour.commissionRate` → cria `Commission` | call | → S_DB | — |

### Data Stores — Módulo 2

| # | Place | Store | Type | Description |
|---|-------|-------|------|-------------|
| S8 | P14 | `selectedCommissions` | `string[]` | IDs de comissões selecionadas para pagamento |
| S9 | P15 | `reportDateRange` | `{from: Date, to: Date}` | Período dos relatórios |
| S10 | P10 | `tourSearch` | `string` | Filtro de busca na tabela de tours |

---

## MÓDULO 3 — CHECK-IN (Operador/Barqueiro)

### UI Affordances — Módulo 3

| # | Place | Component | Affordance | Control | Wires Out | Returns To |
|---|-------|-----------|------------|---------|-----------|------------|
| U112 | P16 | `OperatorLoginForm` | Input Email | type | — | — |
| U113 | P16 | `OperatorLoginForm` | Input Senha (ou PIN 4 dígitos) | type | — | — |
| U114 | P16 | `OperatorLoginForm` | Botão "Entrar" | click | → N40 | — |
| U115 | P17 | `ManifestHeader` | Selector "Passeio do dia" | change | → N41 | — |
| U116 | P17 | `ManifestHeader` | Data atual (automática — hoje) | render | — | — |
| U117 | P17 | `EmbarkCounter` | Badge "X de Y embarcados" | render | — | — |
| U118 | P17 | `PassengerList` | Lista: nome, adultos, crianças, status (🟡/✅) | render | — | — |
| U119 | P17 | `PassengerSearch` | Input busca por nome (fallback manual) | type | → N42 | — |
| U120 | P17 | `ScanButton` | Botão "Escanear voucher" | click | → P18 | — |
| U121 | P17 | `ManualCodeInput` | Input "Digitar código manualmente" | type | → N43 | — |
| U122 | P17 | `OfflineBanner` | Banner "Modo offline — lista do cache" | render | — | — |
| U123 | P17 | `EmptyManifest` | "Nenhum passageiro hoje" | render | — | — |
| U124 | P18 | `QRViewfinder` | Câmera ativada com frame/guia | render | — | — |
| U125 | P18 | `ScanFeedback` | Flash verde (válido) / flash vermelho (inválido) | render | — | — |
| U126 | P18 | `ManualCodeButton` | Botão "Digitar código" | click | → P17 (U121) | — |
| U127 | P18 | `CloseScanner` | Botão "Fechar scanner" | click | → P17 | — |
| U128 | P19 | `PassengerCard` | Nome do passageiro + passeio | render | — | — |
| U129 | P19 | `PassengerCard` | Quantidade de adultos e crianças | render | — | — |
| U130 | P19 | `VoucherStatus` | Badge "Válido" / "Já embarcado" / "Inválido" | render | — | — |
| U131 | P19 | `ConfirmButton` | Botão "Confirmar Embarque" (verde) | click | → N45 | — |
| U132 | P19 | `CancelButton` | Botão "Cancelar" | click | → P17 | — |

### Code Affordances — Módulo 3

| # | Place | Component | Affordance | Control | Wires Out | Returns To |
|---|-------|-----------|------------|---------|-----------|------------|
| N40 | P16 | `auth` | `Auth.js signIn(credentials)` role=OPERATOR | call | → PB | → P17 |
| N41 | P17 | `useManifest` | `useQuery(['manifest', tourDateId])` | observe | → N41a, N41b | → U118, U117 |
| N41a | PB | `api/operator/manifest` | `GET /api/operator/manifest?tourDateId=` → BookingManifest[] | call | → PB | → N41 |
| N41b | P17 | `serviceWorker` | `cacheManifest(tourDateId, data)` → IndexedDB | call | → S11 | — |
| N42 | P17 | `filterManifest` | `manifest.filter(b => b.customerName.includes(query))` | call | — | → U118 |
| N43 | P17 | `lookupVoucher` | `validateVoucher(code)` (online: API / offline: IndexedDB) | call | → N43a ou N43b | → P19 |
| N43a | PB | `api/operator/voucher` | `GET /api/operator/voucher/[code]` → Booking | call | → PB | → N43 |
| N43b | P17 | `offlineValidate` | `indexedDB.get('manifest').find(b => b.voucherCode === code)` | call | → S11 | → N43 |
| N44 | P18 | `qrScanner` | `jsQR(imageData)` → decodedCode | call | — | → N43 |
| N45 | P19 | `useCheckin` | `useMutation` → online: `POST /api/operator/checkin` / offline: `queueCheckin(code)` | mutate | → N45a ou N46 | → P17 |
| N45a | PB | `api/operator/checkin` | `POST /api/operator/checkin` → `updateBooking(checkedInAt)` | call | → S_DB | → N45 |
| N46 | P17 | `offlineQueue` | `indexedDB.put('pending-checkins', code)` | call | → S12 | — |
| N47 | P17 | `syncCheckins` | `navigator.onLine` event → processa S12 → N45a para cada item | call | → N45a | → S12 |
| N48 | P17 | `serviceWorkerInit` | `navigator.serviceWorker.register('/sw.js')` na montagem | call | — | — |

### Data Stores — Módulo 3

| # | Place | Store | Type | Description |
|---|-------|-------|------|-------------|
| S11 | P17 | `IndexedDB: manifests` | `BookingManifest[]` | Cache local das próximas 48h |
| S12 | P17 | `IndexedDB: pending-checkins` | `string[]` | Fila de chekins offline para sync |
| S13 | P17 | `isOffline` | `boolean` | Estado de conectividade |
| S14 | P18 | `scannedCode` | `string \| null` | Código lido pelo scanner |
| S15 | P19 | `pendingCheckinBooking` | `Booking \| null` | Booking aguardando confirmação |

---

## Design Tokens

```typescript
// design-system/tokens.ts
export const tokens = {
  colors: {
    // Brand
    brandOcean:       '#0B6E8E',  // Primary — botões, links, CTAs
    brandOceanLight:  '#E8F4F8',  // Hover, fundos sutis
    brandOceanDark:   '#084E66',  // Pressed state
    brandSand:        '#F5E6C8',  // Background quente, seções alternadas
    brandCoral:       '#E8643C',  // Accent — CTAs principais, urgência, preço
    brandForest:      '#2D6A4F',  // Success — confirmações, check-in OK, válido

    // Semantic
    background:       '#FFFFFF',
    surface:          '#F8F9FA',
    surfaceElevated:  '#FFFFFF',
    border:           '#E2E8F0',
    borderSubtle:     '#F1F5F9',

    // Text
    textPrimary:      '#1A2332',
    textSecondary:    '#4A5568',
    textMuted:        '#94A3B8',
    textInverse:      '#FFFFFF',

    // Status
    success:          '#10B981',
    successLight:     '#D1FAE5',
    warning:          '#F59E0B',
    warningLight:     '#FEF3C7',
    error:            '#EF4444',
    errorLight:       '#FEE2E2',
    info:             '#3B82F6',
    infoLight:        '#DBEAFE',

    // Tour Categories
    whale:            '#1E40AF',  // Azul profundo (oceano)
    boat:             '#0891B2',  // Ciano (água)
    buggy:            '#B45309',  // Terra/areia
    experience:       '#7C3AED',  // Roxo (vivência imersiva)
  },

  typography: {
    fontDisplay: '"Playfair Display", Georgia, serif',  // Títulos premium
    fontBody:    '"Inter", system-ui, -apple-system, sans-serif',
    fontMono:    '"JetBrains Mono", "Fira Code", monospace',  // Códigos voucher

    sizeXs:  '0.75rem',    // 12px
    sizeSm:  '0.875rem',   // 14px
    sizeMd:  '1rem',       // 16px
    sizeLg:  '1.125rem',   // 18px
    sizeXl:  '1.25rem',    // 20px
    size2xl: '1.5rem',     // 24px
    size3xl: '1.875rem',   // 30px
    size4xl: '2.25rem',    // 36px
    size5xl: '3rem',       // 48px

    weightNormal:   '400',
    weightMedium:   '500',
    weightSemibold: '600',
    weightBold:     '700',

    lineHeightTight:   '1.25',
    lineHeightNormal:  '1.5',
    lineHeightRelaxed: '1.75',
  },

  spacing: {
    xs:  '0.25rem',  // 4px
    sm:  '0.5rem',   // 8px
    md:  '1rem',     // 16px
    lg:  '1.5rem',   // 24px
    xl:  '2rem',     // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },

  radius: {
    sm:   '0.25rem',   // 4px
    md:   '0.5rem',    // 8px
    lg:   '0.75rem',   // 12px
    xl:   '1rem',      // 16px
    '2xl':'1.5rem',    // 24px
    full: '9999px',    // Pill
  },

  shadows: {
    sm:  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md:  '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg:  '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl:  '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    card: '0 2px 8px 0 rgb(11 110 142 / 0.08)',  // Sombra com tinte brand
  },
}
```

---

## Componentes React para Storybook

| Componente | Localização | Variantes Storybook | Usado em |
|------------|-------------|---------------------|----------|
| `TourCard` | `components/tour/TourCard` | default, featured, compact, loading | P2 |
| `TourCategoryBadge` | `components/tour/TourCategoryBadge` | WHALE, BOAT, BUGGY, EXPERIENCE | P2, P3 |
| `PhotoGallery` | `components/tour/PhotoGallery` | default, single, loading | P3 |
| `AvailabilityCalendar` | `components/booking/AvailabilityCalendar` | default, loading, allFull | P4 |
| `QuantitySelector` | `components/booking/QuantitySelector` | adults, children, disabled | P4 |
| `PriceSummary` | `components/booking/PriceSummary` | default, loading, withChildren | P4, P5 |
| `OrderSummary` | `components/booking/OrderSummary` | checkout, confirmation | P5, P7 |
| `PaymentToggle` | `components/payment/PaymentToggle` | default, pixSelected, cardSelected | P5 |
| `PixQRCode` | `components/payment/PixQRCode` | waiting, success, expired | P6 |
| `ExpirationTimer` | `components/payment/ExpirationTimer` | active, warning, expired | P6 |
| `VoucherCard` | `components/voucher/VoucherCard` | default, compact, print | P7 |
| `VoucherCode` | `components/voucher/VoucherCode` | default | P7, P19 |
| `CheckinRow` | `components/checkin/CheckinRow` | pending, checkedIn, invalid | P17 |
| `EmbarkCounter` | `components/checkin/EmbarkCounter` | default, allBoarded, empty | P17 |
| `QRScanner` | `components/checkin/QRScanner` | active, offline, success, error | P18 |
| `OfflineBanner` | `components/checkin/OfflineBanner` | default, syncing | P17 |
| `KPICard` | `components/admin/KPICard` | default, loading, trend-up, trend-down | P9 |
| `TourForm` | `components/admin/TourForm` | create, edit, loading | P11 |
| `DateCard` | `components/admin/DateCard` | open, full, cancelled, loading | P12 |
| `CommissionRow` | `components/admin/CommissionRow` | pending, paid, selected | P14 |
| `LoadingSkeleton` | `components/ui/LoadingSkeleton` | TourCard, Table, Form, KPI | vários |
| `EmptyState` | `components/ui/EmptyState` | no-tours, no-bookings, no-results, no-commissions | vários |
| `SlotsWarning` | `components/ui/SlotsWarning` | few (≤3), last (1) | P4 |

---

## Slices de Implementação

| # | Slice | Mecanismo (Shape C) | Affordances incluídas | Demo |
|---|-------|---------------------|----------------------|------|
| V1 | Setup + Design System | — | tokens.ts, Storybook, schema Prisma, CI tokens:check | "Storybook rodando com paleta Corumbau, todos os componentes documentados" |
| V2 | Loja: Catálogo + Detalhe | C1 (parcial) | P1, P2, P3 · U1–U16 · N1–N4 | "Turista navega pelo catálogo, abre detalhe do passeio" |
| V3 | Loja: Seleção Data + Checkout | C1, C6 | P4, P5 · U17–U31 · N5–N9 | "Seleciona data, preenche dados, vê resumo antes de pagar" |
| V4 | Loja: Pagamento Pix + Voucher | C1, C5, C7 | P6, P7 · U32–U49 · N10–N20 | "Paga com Pix, recebe email com voucher, vê QR Code na tela" |
| V5 | Loja: Pagamento Cartão | C5 | P6b · U38–U41 · MP Bricks | "Paga com cartão de crédito via Stripe" |
| V6 | Admin: Tour CRUD + Datas | C2 | P8–P12 · U50–U85 · N22–N29 | "Gestora cria passeio, adiciona datas, vê ocupação por data" |
| V7 | Admin: Lançamento Offline + Comissões | C2, C10 | P13, P14 · U89–U106 · N30–N36 | "Registra venda do WhatsApp, comissão calculada automaticamente" |
| V8 | Admin: Cancelamento + Relatórios | C9 | P12 (cancel), P15 · U86–U88, U107–U111 · N30a, N37–N38 | "Cancela data por mau tempo, emails disparados, vê relatório do mês" |
| V9 | Check-in: Manifest + Scanner + Offline | C3, C4 | P16–P19 · U112–U132 · N40–N48 | "Barqueiro no pier escaneia QR sem internet, embarque confirmado" |

---

## API Routes

```
GET    /api/tours                           → Tour[] (public)
GET    /api/tours/[slug]                    → Tour (public)
GET    /api/tour-dates?tourId=&month=       → TourDate[] (public)
POST   /api/bookings                        → cria Booking PENDING (guest)
GET    /api/payment/pix?bookingId=          → {qrCode, code, expiresAt}
GET    /api/payment/status?bookingId=       → {status: PaymentStatus}
GET    /api/voucher/[code]                  → Booking public info
POST   /api/webhooks/mercadopago            → webhook handler

GET    /api/admin/tours?search=             → Tour[] (ADMIN)
POST   /api/admin/tours                     → cria Tour (ADMIN)
PATCH  /api/admin/tours/[id]               → atualiza Tour (ADMIN)
POST   /api/admin/tour-dates               → cria TourDate (ADMIN)
POST   /api/admin/tour-dates/[id]/cancel   → cancela data + notifica (ADMIN)
POST   /api/admin/bookings                 → lançamento offline (ADMIN)
GET    /api/admin/bookings/[id]            → detalhe booking (ADMIN)
GET    /api/admin/manifest?tourDateId=     → manifest do admin (ADMIN)
GET    /api/admin/commissions?filters=     → Commission[] (ADMIN)
PATCH  /api/admin/commissions/batch        → marca como pagas (ADMIN)
GET    /api/admin/reports?from=&to=        → dados agregados (ADMIN)
POST   /api/admin/upload                   → upload imagens (ADMIN)

GET    /api/operator/manifest?tourDateId=  → BookingManifest[] (OPERATOR)
GET    /api/operator/voucher/[code]        → validação voucher (OPERATOR)
POST   /api/operator/checkin               → marca embarque (OPERATOR)
```
